(function () {
  const config = window.DIVE_COMPASS_SUPABASE_CONFIG;
  if (!config || !window.supabase) throw new Error("Supabase could not load. Check the configuration and reload.");
  const client = window.supabase.createClient(config.url, config.publishableKey);
  const bucket = client.storage.from("community-photos");
  const redirectError = new URLSearchParams(window.location.hash.slice(1)).get("error_description");
  const clean = (value, limit) => String(value == null ? "" : value).trim().slice(0, limit);

  async function result(request) {
    const { data, error } = await request;
    if (error) throw error;
    return data;
  }

  async function currentUser() {
    const { user } = await result(client.auth.getUser());
    if (!user) throw new Error("Sign in before using the community.");
    return user;
  }

  async function profileFor(user) {
    const profile = await result(client.from("profiles").select("*").eq("id", user.id).maybeSingle());
    if (!profile) throw new Error("Create your profile before posting to the community.");
    return profile;
  }

  async function imageUrls(paths) {
    if (!paths.length) return [];
    const signed = await result(bucket.createSignedUrls(paths, 3600));
    return signed.map(item => {
      if (item.error || !item.signedUrl) throw new Error(item.error || "Could not load a private photo.");
      return item.signedUrl;
    });
  }

  async function mapProfile(profile) {
    return profile ? { username: profile.username, photo: (await imageUrls(profile.photo_path ? [profile.photo_path] : []))[0] || "" } : null;
  }

  async function mapRow(table, row, user) {
    const base = { ...row, ownerUid: row.owner_id, ownedByCurrentUser: row.owner_id === user.id };
    if (table === "dives") {
      const photos = await imageUrls(row.photo_paths);
      return { ...base, photos, photo: photos[0] || "", coords: null };
    }
    if (table === "gear") {
      const images = await imageUrls(row.photo_paths);
      return { ...base, images, image: images[0] || "", category: `${row.condition} · Community listing` };
    }
    return base;
  }

  async function getAppData() {
    const user = await currentUser();
    const [profile, dives, questions, gear] = await Promise.all([
      result(client.from("profiles").select("*").eq("id", user.id).maybeSingle()),
      result(client.from("dives").select("*").order("created_at", { ascending: false })),
      result(client.from("questions").select("*").order("created_at", { ascending: false })),
      result(client.from("gear").select("*").order("created_at", { ascending: false }))
    ]);
    return {
      profile: await mapProfile(profile),
      dives: await Promise.all(dives.map(row => mapRow("dives", row, user))),
      questions,
      products: await Promise.all(gear.map(row => mapRow("gear", row, user)))
    };
  }

  async function uploadImages(images, prefix, maximum, staged) {
    if (!Array.isArray(images) || images.length > maximum) throw new Error(`Choose up to ${maximum} photos.`);
    const paths = [];
    for (const image of images) {
      if (typeof image !== "string" || !image.startsWith("data:image/jpeg;base64,")) throw new Error("Photos must be processed as JPEG images.");
      const blob = await (await fetch(image)).blob();
      if (blob.size > 5 * 1024 * 1024) throw new Error("Each photo must be 5 MB or smaller.");
      const path = `${prefix}/${crypto.randomUUID()}.jpg`;
      await result(bucket.upload(path, blob, { contentType: "image/jpeg", upsert: false }));
      staged.push(path);
      paths.push(path);
    }
    return paths;
  }

  async function removeImages(paths) {
    if (paths.length) await result(bucket.remove(paths));
  }

  async function call(method, payload) {
    if (method === "getAppData") return getAppData();
    const user = await currentUser();
    const value = payload || {};
    const staged = [];
    let committed = false;
    try {
      if (method === "saveProfile") {
        const username = clean(value.username, 32);
        if (!username) throw new Error("Enter a username for your profile.");
        const existing = await result(client.from("profiles").select("*").eq("id", user.id).maybeSingle());
        const photoPath = value.photo
          ? (await uploadImages([value.photo], `${user.id}/profiles`, 1, staged))[0]
          : existing ? existing.photo_path : null;
        const saved = await result(client.from("profiles").upsert({ id: user.id, username, photo_path: photoPath }).select().single());
        committed = true;
        if (value.photo && existing && existing.photo_path) await removeImages([existing.photo_path]);
        return mapProfile(saved);
      }
      if (method === "deleteDive") {
        const removed = await result(client.from("dives").delete().eq("id", String(payload)).eq("owner_id", user.id).select().single());
        committed = true;
        await removeImages(removed.photo_paths);
        return true;
      }
      if (method === "voteQuestion") return result(client.rpc("vote_question", { question_id: String(payload) }));
      const profile = await profileFor(user);
      if (method === "saveQuestion") {
        const title = clean(value.title, 200);
        if (!title) throw new Error("Add a question before posting.");
        return result(client.from("questions").insert({
          owner_id: user.id, author: profile.username, category: clean(value.category, 40),
          title, detail: clean(value.detail, 3000)
        }).select().single());
      }
      if (method === "saveDive") {
        const place = clean(value.place, 120);
        const country = clean(value.country, 80);
        const depth = value.depth === "" || value.depth == null ? null : Number(value.depth);
        if (!place || !country) throw new Error("Enter the dive site and country.");
        if (depth !== null && (!Number.isFinite(depth) || depth < 0)) throw new Error("Enter a valid depth.");
        const existing = value.id
          ? await result(client.from("dives").select("*").eq("id", value.id).eq("owner_id", user.id).single())
          : null;
        const id = existing ? existing.id : crypto.randomUUID();
        const photoPaths = value.replacePhotos
          ? await uploadImages(value.photos, `${user.id}/dives/${id}`, 10, staged)
          : existing ? existing.photo_paths : [];
        const row = {
          owner_id: user.id, diver: profile.username, place, country, depth,
          flag: clean(value.flag, 8), date: clean(value.date, 10) || new Date().toISOString().slice(0, 10),
          highlight: clean(value.highlight, 1000), photo_paths: photoPaths
        };
        const request = existing
          ? client.from("dives").update(row).eq("id", id).eq("owner_id", user.id)
          : client.from("dives").insert({ ...row, id });
        const saved = await result(request.select().single());
        committed = true;
        if (existing && value.replacePhotos) await removeImages(existing.photo_paths);
        return mapRow("dives", saved, user);
      }
      if (method === "saveGearListing") {
        const name = clean(value.name, 160);
        const price = Number(value.price);
        if (!name || !Number.isFinite(price) || price < 0) throw new Error("Enter an item name and a valid price.");
        const id = crypto.randomUUID();
        const paths = await uploadImages(value.images || [], `${user.id}/gear/${id}`, 5, staged);
        const saved = await result(client.from("gear").insert({
          id, owner_id: user.id, owner: profile.username, name, price,
          condition: clean(value.condition, 40) || "Used", description: clean(value.description, 1500), photo_paths: paths
        }).select().single());
        committed = true;
        return mapRow("gear", saved, user);
      }
      throw new Error("Unknown community action.");
    } catch (error) {
      if (committed) throw new Error(`Your change was saved, but photo processing failed. Refresh before retrying. ${error.message}`);
      try {
        await removeImages(staged);
      } catch (cleanupError) {
        throw new Error(`${error.message} Uploaded photo cleanup also failed: ${cleanupError.message}`);
      }
      throw error;
    }
  }

  window.DiveCompassSupabase = {
    enabled: true,
    call,
    async signIn(email) {
      await result(client.auth.signInWithOtp({
        email, options: { shouldCreateUser: false, emailRedirectTo: config.redirectUrl }
      }));
    },
    async signOut() { await result(client.auth.signOut()); },
    onAuthStateChanged(callback) {
      let generation = 0;
      // Leave the auth callback before making additional Supabase requests.
      client.auth.onAuthStateChange((_event, session) => {
        const version = ++generation;
        setTimeout(async () => {
          const user = session ? session.user : null;
          try {
            const profile = user ? await mapProfile(await result(client.from("profiles").select("*").eq("id", user.id).maybeSingle())) : null;
            if (version === generation) callback(user, profile, redirectError ? new Error(redirectError) : null);
          } catch (error) {
            if (version === generation) callback(user, null, error);
          }
        }, 0);
      });
    },
    subscribeAppData(onData, onError) {
      let active = true;
      let loading = false;
      const refresh = async () => {
        if (!active || loading) return;
        loading = true;
        try {
          const data = await getAppData();
          if (active) onData(data);
        } catch (error) {
          if (active) onError(error);
        } finally { loading = false; }
      };
      refresh();
      const interval = setInterval(refresh, 60000);
      window.addEventListener("focus", refresh);
      return [() => {
        active = false;
        clearInterval(interval);
        window.removeEventListener("focus", refresh);
      }];
    }
  };
})();
