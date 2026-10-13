(function () {
  const config = window.DIVE_COMPASS_FIREBASE_CONFIG || {};
  const requiredConfig = ["apiKey", "authDomain", "projectId", "appId"];
  const enabled = requiredConfig.every(key => typeof config[key] === "string" && config[key] && !config[key].startsWith("REPLACE_"));
  if (!enabled || !window.firebase) {
    window.DiveCompassFirebase = { enabled: false };
    return;
  }

  if (!firebase.apps.length) firebase.initializeApp(config);
  const auth = firebase.auth();
  const database = firebase.firestore();
  const storage = firebase.storage();
  const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
  const increment = firebase.firestore.FieldValue.increment;

  function currentUser() {
    const user = auth.currentUser;
    if (!user) throw new Error("Sign in before using the community.");
    return user;
  }

  function clean(value, limit) {
    return String(value == null ? "" : value).trim().slice(0, limit);
  }

  function requireProfile(user) {
    return database.collection("profiles").doc(user.uid).get().then(snapshot => {
      if (!snapshot.exists) throw new Error("Create your profile before posting to the community.");
      return snapshot.data();
    });
  }

  function uploadImages(dataUrls, path) {
    return Promise.all(dataUrls.map((dataUrl, index) => {
      const reference = storage.ref(`${path}/${index + 1}.jpg`);
      return reference.putString(dataUrl, "data_url", { contentType: "image/jpeg" }).then(() => reference.getDownloadURL());
    }));
  }

  function removeFolder(path) {
    const reference = storage.ref(path);
    return reference.listAll().then(result => Promise.all(result.items.map(item => item.delete())));
  }

  function mapSnapshot(snapshot, ownerUid) {
    return snapshot.docs.map(document => {
      const data = document.data();
      return { ...data, id: document.id, ownedByCurrentUser: data.ownerUid === ownerUid };
    }).reverse();
  }

  function getAppData() {
    const user = currentUser();
    return Promise.all([
      database.collection("profiles").doc(user.uid).get(),
      database.collection("dives").get(),
      database.collection("questions").get(),
      database.collection("gear").get()
    ]).then(([profileSnapshot, diveSnapshot, questionSnapshot, gearSnapshot]) => ({
      profile: profileSnapshot.exists ? profileSnapshot.data() : null,
      dives: mapSnapshot(diveSnapshot, user.uid).map(dive => ({ ...dive, photos: Array.isArray(dive.photos) ? dive.photos : [], photo: (dive.photos || [])[0] || "", coords: null })),
      questions: mapSnapshot(questionSnapshot, user.uid).map(question => ({ ...question, answers: Number(question.answers) || 0, votes: Number(question.votes) || 0 })),
      products: mapSnapshot(gearSnapshot, user.uid).map(product => ({ ...product, images: Array.isArray(product.images) ? product.images : [], image: (product.images || [])[0] || "", category: `${product.condition || "Used"} · Community listing` }))
    }));
  }

  function subscribeAppData(onData, onError) {
    const user = currentUser();
    const data = { profile: null, dives: [], questions: [], products: [] };
    const ready = new Set();
    const publish = name => snapshot => {
      if (name === "profile") data.profile = snapshot.exists ? snapshot.data() : null;
      if (name === "dives") data.dives = mapSnapshot(snapshot, user.uid).map(dive => ({ ...dive, photos: Array.isArray(dive.photos) ? dive.photos : [], photo: (dive.photos || [])[0] || "", coords: null }));
      if (name === "questions") data.questions = mapSnapshot(snapshot, user.uid).map(question => ({ ...question, answers: Number(question.answers) || 0, votes: Number(question.votes) || 0 }));
      if (name === "gear") data.products = mapSnapshot(snapshot, user.uid).map(product => ({ ...product, images: Array.isArray(product.images) ? product.images : [], image: (product.images || [])[0] || "", category: `${product.condition || "Used"} · Community listing` }));
      ready.add(name);
      if (ready.size === 4) onData({ ...data });
    };
    return [
      database.collection("profiles").doc(user.uid).onSnapshot(publish("profile"), onError),
      database.collection("dives").onSnapshot(publish("dives"), onError),
      database.collection("questions").onSnapshot(publish("questions"), onError),
      database.collection("gear").onSnapshot(publish("gear"), onError)
    ];
  }

  function call(method, payload) {
    const user = currentUser();
    const value = payload || {};

    if (method === "getAppData") return getAppData();

    if (method === "saveProfile") {
      const username = clean(value.username, 32);
      if (!username) return Promise.reject(new Error("Enter a username for your profile."));
      const reference = database.collection("profiles").doc(user.uid);
      return reference.get().then(snapshot => {
        const existing = snapshot.exists ? snapshot.data() : {};
        const photoPromise = value.photo ? uploadImages([value.photo], `community/${user.uid}/profiles`).then(images => images[0]) : Promise.resolve(existing.photo || "");
        return photoPromise.then(photo => reference.set({ uid: user.uid, username, photo, updatedAt: serverTimestamp() }, { merge: true }).then(() => ({ username, photo })));
      });
    }

    if (method === "saveDive") {
      return requireProfile(user).then(profile => {
        const place = clean(value.place, 120);
        const country = clean(value.country, 80);
        if (!place || !country) throw new Error("Enter the dive site and country.");
        const reference = value.id ? database.collection("dives").doc(value.id) : database.collection("dives").doc();
        return reference.get().then(snapshot => {
          const existing = snapshot.exists ? snapshot.data() : null;
          if (existing && existing.ownerUid !== user.uid) throw new Error("This dive cannot be edited by the current account.");
          const replacePhotos = Boolean(value.replacePhotos);
          const photoPromise = replacePhotos
            ? removeFolder(`community/${user.uid}/dives/${reference.id}`).then(() => uploadImages(Array.isArray(value.photos) ? value.photos : [], `community/${user.uid}/dives/${reference.id}`))
            : Promise.resolve(existing && Array.isArray(existing.photos) ? existing.photos : []);
          return photoPromise.then(photos => {
            const dive = {
              id: reference.id, ownerUid: user.uid, createdAt: existing ? existing.createdAt : serverTimestamp(),
              date: clean(value.date, 20) || new Date().toISOString().slice(0, 10), diver: profile.username,
              place, country, flag: clean(value.flag, 8) || "🌊", depth: Number(value.depth) || "",
              highlight: clean(value.highlight, 1000), photos, photo: photos[0] || "", coords: null,
              ownedByCurrentUser: true
            };
            const storedDive = { ...dive };
            delete storedDive.id;
            delete storedDive.ownedByCurrentUser;
            return reference.set(storedDive).then(() => dive);
          });
        });
      });
    }

    if (method === "deleteDive") {
      const reference = database.collection("dives").doc(String(payload));
      return reference.get().then(snapshot => {
        if (!snapshot.exists || snapshot.data().ownerUid !== user.uid) throw new Error("This dive cannot be deleted by the current account.");
        return reference.delete().then(() => removeFolder(`community/${user.uid}/dives/${reference.id}`)).then(() => true);
      });
    }

    if (method === "saveQuestion") {
      return requireProfile(user).then(profile => {
        const title = clean(value.title, 200);
        if (!title) throw new Error("Add a question before posting.");
        const question = { ownerUid: user.uid, category: clean(value.category, 40), title, detail: clean(value.detail, 3000), author: profile.username, answers: 0, votes: 0, createdAt: serverTimestamp() };
        const reference = database.collection("questions").doc();
        return reference.set(question).then(() => ({ ...question, id: reference.id, createdAt: new Date().toISOString() }));
      });
    }

    if (method === "voteQuestion") {
      const reference = database.collection("questions").doc(String(payload));
      return reference.update({ votes: increment(1) }).then(() => reference.get()).then(snapshot => ({ id: snapshot.id, votes: Number(snapshot.data().votes) || 0 }));
    }

    if (method === "saveGearListing") {
      return requireProfile(user).then(profile => {
        const name = clean(value.name, 160);
        const price = Number(value.price);
        if (!name || !Number.isFinite(price) || price < 0) throw new Error("Enter an item name and a valid price.");
        const photoPayloads = Array.isArray(value.images) ? value.images : [];
        if (photoPayloads.length > 5) throw new Error("A gear listing can include up to 5 photos.");
        const reference = database.collection("gear").doc();
        return uploadImages(photoPayloads, `community/${user.uid}/gear/${reference.id}`).then(images => {
          const condition = clean(value.condition, 40) || "Used";
          const listing = { ownerUid: user.uid, owner: profile.username, name, price, condition, description: clean(value.description, 1500), images, createdAt: serverTimestamp() };
          return reference.set(listing).then(() => ({ ...listing, id: reference.id, image: images[0] || "", category: `${condition} · Community listing` }));
        });
      });
    }

    return Promise.reject(new Error("Unknown community action."));
  }

  window.DiveCompassFirebase = {
    enabled: true,
    onAuthStateChanged(callback) { auth.onAuthStateChanged(user => {
      if (!user) { callback(null, null); return; }
      database.collection("profiles").doc(user.uid).get()
        .then(snapshot => callback(user, snapshot.exists ? snapshot.data() : null))
        .catch(error => callback(user, null, error));
    }); },
    signIn() { const provider = new firebase.auth.GoogleAuthProvider(); return auth.signInWithPopup(provider); },
    signOut() { return auth.signOut(); },
    subscribeAppData,
    call
  };
})();
