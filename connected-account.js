(() => {
  const backend = window.DiveCompassSupabase;
  const connection = document.getElementById("connection-status");
  const account = document.getElementById("account-button");
  const signout = document.getElementById("signout-button");
  const authDialog = document.getElementById("account-dialog");
  const profileDialog = document.getElementById("connected-profile-dialog");
  const authForm = document.getElementById("connected-auth");
  const profileForm = document.getElementById("connected-profile");
  const logbookStatus = document.getElementById("logbook-status");
  const dives = document.getElementById("live-dives");
  let currentUser = null;
  let profile = null;
  let unsubscribers = [];
  let authVersion = 0;
  const diveDialog = document.getElementById("connected-dive-dialog");
  const diveForm = document.getElementById("connected-dive-form");
  const diveMessage = document.getElementById("dive-save-status");
  const deleteDialog = document.getElementById("delete-dive-dialog");
  let editingDive = null;
  let deletingDive = null;
  let writingDive = false;
  let photoPreviewUrl = "";
  let selectedPhotos = [];
  let thumbnailUrls = [];
  let dataVersion = 0;
  const countrySelect = diveForm.elements.country;
  const countries = window.DiveCompassCountries.map(country => country.name);
  countrySelect.append(...countries.map(country => new Option(country, country)));

  function showProfile(value) {
    profile = value;
    account.replaceChildren();
    if (value && value.photo) {
      const image = document.createElement("img");
      image.className = "account-avatar";
      image.src = value.photo;
      image.alt = "Your profile picture";
      account.append(image);
    }
    account.append(document.createTextNode(currentUser ? (value ? value.username : "Create profile") : "Sign in"));
    if (!profileDialog.open) profileForm.elements.username.value = value ? value.username : "";
  }

  function renderData(data) {
    window.dispatchEvent(new CustomEvent("community-data", { detail: data }));
    showProfile(data.profile);
    dives.replaceChildren();
    logbookStatus.textContent = `${data.dives.length} community dives`;
    if (!data.dives.length) logbookStatus.textContent = "No dives have been logged yet.";
    data.dives.forEach(dive => {
      const article = document.createElement("article");
      article.className = "live-dive";
      const title = document.createElement("h2");
      title.textContent = dive.place;
      const meta = document.createElement("p");
      meta.textContent = [dive.country, dive.date, dive.diver, dive.depth == null ? "" : `${dive.depth} m`].filter(Boolean).join(" · ");
      meta.className = "member-byline";
      meta.prepend(createMemberAvatar(dive.diver, dive.authorPhoto));
      const body = document.createElement("p");
      body.textContent = dive.highlight || "";
      article.append(title, meta, body);
      if (dive.ownedByCurrentUser) {
        const actions = document.createElement("div");
        actions.className = "account-actions";
        const edit = document.createElement("button");
        edit.className = "button";
        edit.textContent = "Edit dive";
        edit.addEventListener("click", () => openDive(dive));
        const remove = document.createElement("button");
        remove.className = "text-button";
        remove.textContent = "Delete dive";
        remove.addEventListener("click", () => {
          deletingDive = dive;
          document.getElementById("delete-dive-description").textContent = `${dive.place} · ${dive.date}`;
          document.getElementById("delete-dive-status").textContent = "";
          deleteDialog.showModal();
        });
        actions.append(edit, remove);
        article.append(actions);
      }
      if (dive.photos && dive.photos.length) {
        let photos = [...dive.photos];
        let paths = [...dive.photo_paths];
        let index = 0;
        const version = authVersion;
        const link = document.createElement("a");
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        const image = document.createElement("img");
        image.className = "live-dive-photo";
        image.loading = "lazy";
        link.append(image);
        article.append(link);
        const controls = document.createElement("div");
        controls.className = "dive-gallery-controls";
        const previous = document.createElement("button");
        previous.type = "button";
        previous.textContent = "←";
        previous.setAttribute("aria-label", `Previous photo of ${dive.place}`);
        const next = document.createElement("button");
        next.type = "button";
        next.textContent = "→";
        next.setAttribute("aria-label", `Next photo of ${dive.place}`);
        const counter = document.createElement("span");
        counter.setAttribute("role", "status");
        const main = document.createElement("button");
        main.type = "button";
        main.className = "button";
        const message = document.createElement("p");
        message.className = "editor-note";
        message.setAttribute("role", "status");
        function displayPhoto() {
          image.src = photos[index];
          image.alt = `${dive.place} · Photo ${index + 1} of ${photos.length}`;
          link.href = photos[index];
          counter.textContent = `${index + 1} / ${photos.length}${index === 0 ? " · Main photo" : ""}`;
          main.textContent = index === 0 ? "Main photo" : "Make main photo";
          main.disabled = index === 0;
        }
        previous.addEventListener("click", () => { index = (index + photos.length - 1) % photos.length; displayPhoto(); });
        next.addEventListener("click", () => { index = (index + 1) % photos.length; displayPhoto(); });
        controls.append(previous, counter, next);
        previous.hidden = next.hidden = photos.length === 1;
        article.append(controls);
        if (dive.ownedByCurrentUser && photos.length > 1) article.append(main, message);
        main.addEventListener("click", async () => {
          main.disabled = previous.disabled = next.disabled = true;
          message.textContent = "Saving main photo…";
          try {
            const saved = await backend.call("setDiveMainPhoto", { id: dive.id, photoPath: paths[index] });
            if (version !== authVersion) return;
            photos = saved.photos;
            paths = saved.photo_paths;
            index = 0;
            displayPhoto();
            message.textContent = "Main photo saved.";
          } catch (error) {
            message.textContent = `Could not save main photo: ${error.message}`;
          } finally {
            previous.disabled = next.disabled = false;
            main.disabled = index === 0;
          }
        });
        displayPhoto();
      }
      dives.append(article);
    });
    connection.textContent = `Signed in${data.profile ? ` as ${data.profile.username}` : " · Create your profile to contribute"}.`;
  }

  if (!backend) {
    connection.textContent = "Account service failed to load. Check your connection and reload; no local fallback is used.";
    account.disabled = true;
    document.querySelectorAll("[data-log-dive]").forEach(button => { button.disabled = true; });
    logbookStatus.textContent = "Unable to connect to Supabase.";
    return;
  }
  account.addEventListener("click", () => {
    if (currentUser) {
      document.getElementById("profile-status").textContent = "";
      profileDialog.showModal();
    } else authDialog.showModal();
  });
  document.getElementById("show-auth-password").addEventListener("change", event => {
    authForm.elements.password.type = event.target.checked ? "text" : "password";
  });
  authForm.addEventListener("submit", async event => {
    event.preventDefault();
    const message = document.getElementById("auth-status");
    const action = event.submitter ? event.submitter.value : "signin";
    const email = authForm.elements.email.value.trim();
    const password = authForm.elements.password.value;
    authForm.querySelectorAll("button").forEach(button => { button.disabled = true; });
    message.textContent = "Connecting…";
    try {
      if (action === "signup") await backend.signUp(email, password);
      else await backend.signIn(email, password);
      authForm.reset();
      authForm.elements.password.type = "password";
      authDialog.close();
      message.textContent = "";
    } catch (error) {
      message.textContent = error.message;
    } finally {
      authForm.querySelectorAll("button").forEach(button => { button.disabled = false; });
    }
  });
  signout.addEventListener("click", async () => {
    signout.disabled = true;
    try {
      await backend.signOut();
    } catch (error) {
      connection.textContent = `Sign out failed: ${error.message}`;
    } finally {
      signout.disabled = false;
    }
  });

  async function preparePhoto(file, maximumDimension = 800) {
    return prepareCommunityPhoto(file, maximumDimension);
  }
    function updatePhotoPreview() {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      photoPreviewUrl = "";
      const file = selectedPhotos[Number(diveForm.elements.mainPhoto.value)];
      const preview = document.getElementById("dive-photo-preview");
      preview.hidden = !file;
      preview.removeAttribute("src");
      if (file) {
        photoPreviewUrl = URL.createObjectURL(file);
        preview.src = photoPreviewUrl;
      }
    }
      function renderSelectedPhotos(mainFile = selectedPhotos[Number(diveForm.elements.mainPhoto.value)]) {
        thumbnailUrls.forEach(url => URL.revokeObjectURL(url));
        thumbnailUrls = [];
        const list = document.getElementById("selected-dive-photos");
        list.replaceChildren();
        selectedPhotos.forEach(file => {
          const row = document.createElement("div");
          row.className = "selected-photo-row";
          const image = document.createElement("img");
          const url = URL.createObjectURL(file);
          thumbnailUrls.push(url);
          image.src = url;
          image.alt = "";
          const name = document.createElement("span");
          name.textContent = file.name;
          const remove = document.createElement("button");
          remove.type = "button";
          remove.className = "text-button";
          remove.textContent = "Remove";
          remove.setAttribute("aria-label", `Remove ${file.name}`);
          remove.addEventListener("click", () => {
            if (writingDive) return;
            const currentMain = selectedPhotos[Number(diveForm.elements.mainPhoto.value)];
            selectedPhotos = selectedPhotos.filter(photo => photo !== file);
            renderSelectedPhotos(currentMain);
            document.getElementById("selected-photo-status").textContent = `${file.name} removed. ${selectedPhotos.length} photos selected.`;
            diveForm.elements.photos.focus();
          });
          row.append(image, name, remove);
          list.append(row);
        });
        diveForm.elements.mainPhoto.replaceChildren(...(selectedPhotos.length
          ? selectedPhotos.map((file, index) => new Option(`${index + 1}. ${file.name}`, String(index)))
          : [new Option("Select photos first", "0")]));
        diveForm.elements.mainPhoto.value = String(Math.max(0, selectedPhotos.indexOf(mainFile)));
        diveForm.elements.mainPhoto.disabled = !selectedPhotos.length;
        document.getElementById("clear-dive-photos").hidden = !selectedPhotos.length;
        updatePhotoPreview();
      }
    function openDive(dive = null) {
      if (!currentUser) { authDialog.showModal(); return; }
      if (!profile) { profileDialog.showModal(); return; }
      editingDive = dive;
      diveForm.reset();
      selectedPhotos = [];
      renderSelectedPhotos();
      document.getElementById("selected-photo-status").textContent = "";
      diveForm.elements.photos.setCustomValidity("");
      diveForm.elements.mainPhoto.replaceChildren(new Option("Select photos first", "0"));
      diveForm.elements.mainPhoto.disabled = true;
      countrySelect.querySelectorAll("[data-existing-country]").forEach(option => option.remove());
      if (dive && dive.country && !countries.includes(dive.country)) {
        const existingCountry = new Option(dive.country, dive.country);
        existingCountry.dataset.existingCountry = "";
        countrySelect.append(existingCountry);
      }
      for (const field of ["place", "country", "date", "depth", "highlight"]) {
        diveForm.elements[field].value = dive ? (dive[field] == null ? "" : dive[field]) : "";
      }
      if (!dive) {
        const today = new Date();
        diveForm.elements.date.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      }
      document.getElementById("connected-dive-heading").textContent = dive ? "Edit your dive." : "Log a dive.";
      document.getElementById("dive-photo-help").textContent = dive
        ? "Leave photos empty to keep all current pictures. Selecting new photos replaces all current pictures after confirmation. You can change the current main photo with the gallery controls."
        : "Choose up to 10 photos, then select the main photo.";
      diveMessage.textContent = "";
      updatePhotoPreview();
      diveDialog.showModal();
    }
    document.querySelectorAll("[data-log-dive]").forEach(button => {
      button.addEventListener("click", () => openDive());
    });
    document.getElementById("close-dive-dialog").addEventListener("click", () => diveDialog.close());
    diveDialog.addEventListener("cancel", event => { if (writingDive) event.preventDefault(); });
    diveDialog.addEventListener("close", () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      photoPreviewUrl = "";
      thumbnailUrls.forEach(url => URL.revokeObjectURL(url));
      thumbnailUrls = [];
      selectedPhotos = [];
      document.getElementById("selected-dive-photos").replaceChildren();
      diveForm.elements.photos.value = "";
    });
    diveForm.elements.photos.addEventListener("change", () => {
      const files = [...diveForm.elements.photos.files];
      diveForm.elements.photos.value = "";
      if (writingDive) return;
      const message = document.getElementById("selected-photo-status");
      if (selectedPhotos.length + files.length > 10) {
        message.textContent = "No photos added: the limit is 10. Remove a selected photo before adding more.";
        return;
      }
      if (files.some(file => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024)) {
        message.textContent = "No photos added: choose JPEG, PNG, or WebP files no larger than 10 MB each.";
        return;
      }
      const main = selectedPhotos[Number(diveForm.elements.mainPhoto.value)];
      selectedPhotos.push(...files);
      renderSelectedPhotos(main);
      message.textContent = `${selectedPhotos.length} / 10 photos selected.`;
    });
    document.getElementById("clear-dive-photos").addEventListener("click", () => {
      if (writingDive) return;
      selectedPhotos = [];
      renderSelectedPhotos();
      document.getElementById("selected-photo-status").textContent = "Selection cleared. Existing saved photos are unchanged.";
    });
    diveForm.elements.mainPhoto.addEventListener("change", updatePhotoPreview);
    async function refreshDives(version) {
      const requestVersion = ++dataVersion;
      const data = await backend.call("getAppData");
      if (version === authVersion && requestVersion === dataVersion) renderData(data);
    }
    diveForm.addEventListener("submit", async event => {
      event.preventDefault();
      if (writingDive) return;
      const version = authVersion;
      const files = [...selectedPhotos];
      const place = diveForm.elements.place.value.trim();
      const country = diveForm.elements.country.value.trim();
      if (!place || !country || files.length > 10) {
        diveMessage.textContent = "Enter a dive site and country, and choose no more than 10 photos.";
        return;
      }
      if (editingDive && files.length && !window.confirm("Replace all existing photos for this dive? The previous photos will be deleted.")) return;
      const payload = {
        id: editingDive ? editingDive.id : undefined, place, country,
        date: diveForm.elements.date.value, depth: diveForm.elements.depth.value,
        highlight: diveForm.elements.highlight.value, flag: editingDive ? editingDive.flag : "",
        replacePhotos: files.length > 0, photos: []
      };
      const mainIndex = Number(diveForm.elements.mainPhoto.value);
      writingDive = true;
      diveForm.querySelector('button[type="submit"]').disabled = true;
      document.getElementById("close-dive-dialog").disabled = true;
      diveMessage.textContent = "Processing photos and saving dive…";
      let saved = false;
      try {
        const ordered = files.length ? [files[mainIndex], ...files.filter((_, index) => index !== mainIndex)] : [];
        for (const file of ordered) payload.photos.push(await preparePhoto(file, 1600));
        if (version !== authVersion || !currentUser) throw new Error("Your session changed. Sign in and try again.");
        await backend.call("saveDive", payload);
        saved = true;
        if (version !== authVersion) return;
        await refreshDives(version);
        diveDialog.close();
        showPage("logbook");
        logbookStatus.textContent += " · Dive saved.";
      } catch (error) {
        diveMessage.textContent = saved ? `Dive was saved, but refresh failed. Do not resubmit; reload the page. ${error.message}` : error.message;
      } finally {
        writingDive = false;
        diveForm.querySelector('button[type="submit"]').disabled = false;
        document.getElementById("close-dive-dialog").disabled = false;
      }
    });
    document.getElementById("cancel-delete-dive").addEventListener("click", () => deleteDialog.close());
    deleteDialog.addEventListener("cancel", event => { if (writingDive) event.preventDefault(); });
    document.getElementById("confirm-delete-dive").addEventListener("click", async () => {
      if (writingDive || !deletingDive) return;
      const version = authVersion;
      writingDive = true;
      deleteDialog.querySelectorAll("button").forEach(button => { button.disabled = true; });
      const message = document.getElementById("delete-dive-status");
      message.textContent = "Deleting…";
      let deleted = false;
      try {
        await backend.call("deleteDive", deletingDive.id);
        deleted = true;
        if (version !== authVersion) return;
        await refreshDives(version);
        deleteDialog.close();
        logbookStatus.textContent += " · Dive deleted.";
      } catch (error) {
        message.textContent = deleted ? `Dive deleted, but refresh failed. Reload the page. ${error.message}` : error.message;
      } finally {
        writingDive = false;
        deleteDialog.querySelectorAll("button").forEach(button => { button.disabled = false; });
      }
    });
  profileForm.addEventListener("submit", async event => {
    event.preventDefault();
    const message = document.getElementById("profile-status");
    const version = authVersion;
    const username = profileForm.elements.username.value.trim();
    if (!username) {
      message.textContent = "Enter a username, not just spaces.";
      return;
    }
    profileForm.querySelector("button").disabled = true;
    message.textContent = "Saving profile…";
    try {
      const file = profileForm.elements.photo.files[0];
      const photo = file ? await preparePhoto(file) : "";
      if (version !== authVersion || !currentUser) throw new Error("Your session changed. Reopen your profile and try again.");
      const saved = await backend.call("saveProfile", { username, photo });
      if (version !== authVersion) return;
      showProfile(saved);
      profileForm.elements.photo.value = "";
      message.textContent = "Profile saved to your existing Supabase account.";
      connection.textContent = `Signed in as ${saved.username}. Profile saved.`;
    } catch (error) {
      message.textContent = `Profile could not be saved: ${error.message}`;
    } finally {
      profileForm.querySelector("button").disabled = false;
    }
  });

  backend.onAuthStateChanged((user, savedProfile, error) => {
    // Supabase can re-emit sign-in on tab focus or token renewal.
    if (user && currentUser && user.id === currentUser.id) {
      currentUser = user;
      if (error) connection.textContent = `Profile loading failed: ${error.message}`;
      return;
    }
    authVersion++;
    dataVersion++;
    unsubscribers.forEach(unsubscribe => unsubscribe());
    unsubscribers = [];
    currentUser = user;
    dives.replaceChildren();
    showProfile(savedProfile);
    window.dispatchEvent(new CustomEvent("community-data", { detail: null }));
    signout.hidden = !user;
    if (profileDialog.open) profileDialog.close();
    if (diveDialog.open) diveDialog.close();
    if (deleteDialog.open) deleteDialog.close();
    profileForm.elements.username.value = savedProfile ? savedProfile.username : "";
    profileForm.elements.photo.value = "";
    if (!user) {
      connection.textContent = error ? error.message : "Sign in to view private community dives and manage your profile.";
      logbookStatus.textContent = "Sign in using your existing account. No private records are shown while signed out.";
      return;
    }
    connection.textContent = error ? `Profile loading failed: ${error.message}` : "Loading your existing community records…";
    const version = authVersion;
    unsubscribers = backend.subscribeAppData(data => {
      if (version === authVersion && !writingDive) renderData(data);
    }, failure => {
      if (version !== authVersion) return;
      connection.textContent = `Community refresh failed: ${failure.message}`;
      logbookStatus.textContent = "Could not refresh dives. Previously loaded records may be out of date; reload to retry.";
    });
  });
})();
