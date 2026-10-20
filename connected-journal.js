(() => {
  const storyGrid = document.querySelector(".story-grid");
  const destinationCards = document.querySelector("#destinations .cards");
  const countryTabs = document.querySelector('#destinations .tabs');
  const atlas = document.querySelector(".world-panel svg");
  const animals = document.getElementById("reef-nudibranchs");
  const animalTemplates = [...animals.children].map(animal => animal.cloneNode(true));
  const celebration = document.getElementById("dive-celebration-dialog");
  const nudiDialog = document.getElementById("garden-nudi-dialog");
  let plantedDives = [];
  let activeNudiId = null;
  let onlyMyNudis = false;
  let collectionPage = 0;
  const collectionPageSize = 6;
  const collectionPager = document.getElementById("nudi-collection-pagination");
  collectionPager.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    collectionPage += Number(button.dataset.direction);
    renderCollection();
    document.getElementById("nudi-collection-heading").focus();
  }));
  const myNudiButton = document.querySelector('[data-nudi-filter="mine"]');
  function filterGarden() {
    animals.querySelectorAll("[data-dive-id]").forEach(button => {
      const mine = button.dataset.owned === "true";
      button.classList.toggle("nudi-dimmed", onlyMyNudis && !mine);
      button.classList.toggle("nudi-mine", onlyMyNudis && mine);
    });
    document.querySelectorAll("[data-nudi-filter]").forEach(button => {
      button.setAttribute("aria-pressed", String((button.dataset.nudiFilter === "mine") === onlyMyNudis));
    });
    const status = document.getElementById("garden-mine-status");
    status.hidden = !onlyMyNudis;
    const visible = plantedDives.slice(0, animalTemplates.length).filter(dive => dive.ownedByCurrentUser).length;
    status.textContent = `${visible} of your nudis ${visible === 1 ? "is" : "are"} in the shared garden. Your full collection includes every dive you've planted.`;
  }
  document.querySelectorAll("[data-nudi-filter]").forEach(button => button.addEventListener("click", () => {
    onlyMyNudis = button.dataset.nudiFilter === "mine";
    filterGarden();
  }));
  document.getElementById("open-nudi-collection").addEventListener("click", () => {
    collectionPage = 0;
    renderCollection();
    showPage("logbook");
    document.getElementById("nudi-collection-heading").scrollIntoView({ block:"start" });
  });
  function openNudi(dive, index) {
    activeNudiId = dive.id;
    renderNudiDetails(dive, index);
    nudiDialog.showModal();
  }
  document.getElementById("nudi-view-dive").addEventListener("click", () => {
    const dive = records.find(record => record.id === activeNudiId);
    if (!dive) return;
    nudiDialog.close();
    showStory(dive);
  });
  const plantingOrder = dives => [...dives].sort((a, b) =>
    (a.created_at || "").localeCompare(b.created_at || "") || a.id.localeCompare(b.id));
  function nudiName(dive) {
    const latinStem = value => {
      const letters = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "");
      if (letters) return letters;
      // Keep names deterministic for sites written entirely in non-Latin scripts.
      let hash = 0;
      for (const character of value) hash = (Math.imul(hash, 31) + character.codePointAt(0)) >>> 0;
      return "thalass" + Array.from({ length: 5 }, () => {
        const letter = String.fromCharCode(97 + hash % 26);
        hash = Math.floor(hash / 26);
        return letter;
      }).join("");
    };
    const country = latinStem(dive.country).slice(0, 6);
    const genus = country + (/[aeiou]$/.test(country) ? "doris" : "odoris");
    const species = latinStem(dive.place).slice(0, 20) + "ensis";
    return `${genus[0].toUpperCase()}${genus.slice(1)} ${species}`;
  }
  function renderNudiDetails(dive, index) {
    const portrait = animalTemplates[index % animalTemplates.length].cloneNode(true);
    portrait.setAttribute("transform", "translate(120 78) scale(2.5)");
    document.getElementById("garden-nudi-portrait").replaceChildren(portrait);
    document.getElementById("garden-nudi-name").textContent = nudiName(dive);
    document.getElementById("garden-nudi-origin").textContent = `Inspired by a dive at ${dive.place}, ${dive.country}.`;
    document.getElementById("garden-nudi-planter").replaceChildren(
      createMemberAvatar(dive.diver, dive.authorPhoto), document.createTextNode(`Planted by ${dive.diver}.`));
  }
  window.addEventListener("dive-created", event => {
    const count = event.detail.count;
    const plantedIndex = plantedDives.findIndex(dive => dive.id === event.detail.id);
    const animal = animalTemplates[(plantedIndex >= 0 ? plantedIndex : count - 1) % animalTemplates.length].cloneNode(true);
    animal.setAttribute("transform", "translate(120 78) scale(2.5)");
    document.getElementById("celebration-nudi").replaceChildren(animal);
    const remaining = Math.max(0, 100 - count);
    document.getElementById("dive-celebration-progress").textContent = remaining
      ? `${remaining} more ${remaining === 1 ? "dive" : "dives"} to go until we reach 100 dives together!`
      : `We did it! ${count} dives together. Our 100-dive garden is full - let's keep sharing our adventures!`;
    celebration.showModal();
  });
  const garden = animals.closest(".garden");
  const activities = [...document.querySelectorAll(".journal-row .activity")];
  const featured = document.querySelector(".hero [data-story]");
  const dialog = document.getElementById("story-dialog");
  let records = [];
  let selectedCountry = "";
  let selectedDiver = "";
  const diverKey = dive => dive.owner_id || dive.ownerUid || dive.diver;
  const diverLabel = document.createElement("label");
  diverLabel.className = "destination-diver-filter";
  diverLabel.textContent = "Diver";
  const diverSelect = document.createElement("select");
  diverSelect.id = "destination-diver";
  diverLabel.append(diverSelect);
  countryTabs.after(diverLabel);
  countryTabs.setAttribute("aria-label", "Filter dives by country");
  diverSelect.addEventListener("change", () => {
    selectedDiver = diverSelect.value;
    destinationPage = 0;
    filterDestinations();
  });
  let destinationPage = 0;
  const destinationPageSize = 6;
  const wheel = document.querySelector(".wheel-panel");
  document.querySelector("#destinations .world-panel").before(wheel);
  wheel.style.margin = "0 0 30px";
  const pager = document.createElement("nav");
  pager.className = "community-pagination";
  pager.setAttribute("aria-label", "Destination story pages");
  const previousPage = document.createElement("button");
  previousPage.className = "button";
  previousPage.textContent = "Previous";
  const pageLabel = document.createElement("span");
  pageLabel.setAttribute("role", "status");
  const nextPage = document.createElement("button");
  nextPage.className = "button";
  nextPage.textContent = "Next";
  pager.append(previousPage, pageLabel, nextPage);
  destinationCards.after(pager);
  previousPage.addEventListener("click", () => { destinationPage--; filterDestinations(); document.getElementById("destination-title").focus(); });
  nextPage.addEventListener("click", () => { destinationPage++; filterDestinations(); document.getElementById("destination-title").focus(); });
  document.getElementById("destination-title").tabIndex = -1;
  let activeStoryId = null;
  let storyPhotoIndex = 0;
  const storyGallery = document.getElementById("story-gallery");
  dialog.addEventListener("close", () => {
    storyGallery.replaceChildren();
    storyGallery.hidden = true;
    activeStoryId = null;
    storyPhotoIndex = 0;
  });
  const countryKey = country => country.trim().toLocaleLowerCase("en");
  const countryPositions = new Map(window.DiveCompassCountries.map(country => [countryKey(country.name), country]));
  const countryAliases = {
    usa: "United States", "united states of america": "United States",
    uk: "United Kingdom", "cape verde": "Cabo Verde",
    curacao: "Cura\u00e7ao", reunion: "R\u00e9union",
    "czech republic": "Czechia", swaziland: "Eswatini",
    "east timor": "Timor-Leste", "t\u00fcrkiye": "Turkey"
  };
  Object.entries(countryAliases).forEach(([alias, name]) => {
    countryPositions.set(alias, countryPositions.get(countryKey(name)));
  });
  const text = (tag, value, className) => {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  };
  document.querySelector(".stats").setAttribute("aria-label", "Community statistics");
  const logbookLink = document.querySelector('.heading [data-demo="The full logbook would open here."]');
  const liveLink = logbookLink.cloneNode(true);
  liveLink.removeAttribute("data-demo");
  liveLink.addEventListener("click", () => showPage("logbook"));
  logbookLink.replaceWith(liveLink);
  const featuredLive = featured.cloneNode(true);
  featuredLive.removeAttribute("data-story");
  featured.replaceWith(featuredLive);
  dialog.querySelector(".eyebrow").textContent = "From our community dive journal";
  dialog.querySelector(".editor-note").textContent = "Member-submitted dive story.";
  document.getElementById("story-copy").style.whiteSpace = "pre-wrap";
  const oldNote = document.querySelector("#destinations > .editor-note");
  const mapNote = "Country flags indicate approximate country or territory locations, not exact dive sites. Small islands may be absent from the map background.";
  oldNote.textContent = mapNote;
  const caption = document.querySelector(".map-caption");
  caption.lastChild.textContent = " public-domain boundaries. Small islands may be omitted. Flags show approximate country positions, not verified dive sites.";
  document.getElementById("atlas-description").textContent = "World map with selectable dive flags for mapped community countries. The country buttons offer all recorded destinations.";
  garden.querySelector("svg desc").textContent = "Artistic nudibranch illustrations scattered on branching corals among rocks. One nudi per community dive, with space for 100. Not a species-identification diagram.";
  document.querySelector(".preview").textContent = "OneAD diving community · Share generously. Respect the ocean.";

  function showStory(dive) {
    activeStoryId = dive.id;
    storyPhotoIndex = 0;
    renderStory(dive);
    dialog.showModal();
  }
  function renderStory(dive) {
    const byline = dialog.querySelector(".editor-note");
    byline.classList.add("member-byline");
    byline.replaceChildren(createMemberAvatar(dive.diver, dive.authorPhoto), document.createTextNode(dive.diver || "Community member"));
    document.getElementById("story-title").textContent = dive.place;
    document.getElementById("story-copy").textContent =
      [dive.country, dive.diver, dive.date].filter(Boolean).join(" · ") + "\n\n" + (dive.highlight || "No story added yet.");
    const photos = dive.photos && dive.photos.length ? dive.photos : dive.photo ? [dive.photo] : [];
    const media = [
      ...photos.map(url => ({ type: "photo", url })),
      ...(dive.videos || []).map(url => ({ type: "video", url }))
    ];
    storyGallery.replaceChildren();
    storyGallery.hidden = !media.length;
    if (!media.length) { storyPhotoIndex = 0; return; }
    storyPhotoIndex = Math.min(storyPhotoIndex, media.length - 1);
    const counter = text("span", "");
    counter.setAttribute("role", "status");
    const displayPhoto = () => {
      const item = media[storyPhotoIndex];
      const element = document.createElement(item.type === "video" ? "video" : "img");
      element.src = item.url;
      if (item.type === "video") {
        element.controls = true;
        element.playsInline = true;
        element.preload = "metadata";
        element.setAttribute("aria-label", `${dive.place} · Short ${storyPhotoIndex + 1} of ${media.length}`);
      } else {
        element.alt = `${dive.place} · Photo ${storyPhotoIndex + 1} of ${media.length}`;
      }
      storyGallery.querySelector("img, video")?.remove();
      storyGallery.prepend(element);
      counter.textContent = `${storyPhotoIndex + 1} / ${media.length} · ${item.type === "video" ? "Short" : "Photo"}`;
    };
    if (media.length > 1) {
      const controls = document.createElement("div");
      controls.className = "dive-gallery-controls";
      const buttons = [-1, 1].map(direction => {
        const button = text("button", direction < 0 ? "‹" : "›");
        button.type = "button";
        button.setAttribute("aria-label", `${direction < 0 ? "Previous" : "Next"} dive photo`);
        button.addEventListener("click", () => {
          storyPhotoIndex = (storyPhotoIndex + direction + media.length) % media.length;
          displayPhoto();
        });
        return button;
      });
      controls.append(buttons[0], counter, buttons[1]);
      storyGallery.append(controls);
    }
    displayPhoto();
  }
  featuredLive.addEventListener("click", () => {
    const dive = records.find(record => record.photos && record.photos.length) || records[0];
    if (dive) showStory(dive);
  });
  function makeCard(dive, homepage) {
    const article = document.createElement("article");
    article.className = homepage ? "card" : "destination-card";
    const photos = dive.photos && dive.photos.length ? dive.photos : dive.photo ? [dive.photo] : [];
    const media = [
      ...photos.map(url => ({ type: "photo", url })),
      ...(dive.videos || []).map(url => ({ type: "video", url }))
    ];
    if (media.length) {
      let photoIndex = 0;
      const gallery = document.createElement("div");
      gallery.className = "card-gallery";
      const displayMedia = () => {
        const item = media[photoIndex];
        const element = document.createElement(item.type === "video" ? "video" : "img");
        element.src = item.url;
        if (item.type === "video") {
          element.controls = true;
          element.playsInline = true;
          element.preload = "metadata";
          element.setAttribute("aria-label", `${dive.place} · Short ${photoIndex + 1} of ${media.length}`);
        } else {
          element.loading = "lazy";
          element.alt = `${dive.place} · Photo ${photoIndex + 1} of ${media.length}`;
          if (!homepage) element.className = "live-dive-photo";
        }
        gallery.querySelector("img, video")?.remove();
        gallery.prepend(element);
      };
      const counter = text("span", "", "card-photo-count");
      counter.setAttribute("role", "status");
      const displayPhoto = () => {
        displayMedia();
        counter.textContent = `${photoIndex + 1} / ${media.length}`;
      };
      if (media.length > 1) {
        [-1, 1].forEach(direction => {
          const button = text("button", direction < 0 ? "‹" : "›", `card-photo-arrow ${direction < 0 ? "previous" : "next"}`);
          button.type = "button";
          button.setAttribute("aria-label", `${direction < 0 ? "Previous" : "Next"} dive media of ${dive.place}`);
          button.addEventListener("click", () => {
            photoIndex = (photoIndex + direction + media.length) % media.length;
            displayPhoto();
          });
          gallery.append(button);
        });
        gallery.append(counter);
      }
      displayPhoto();
      article.append(gallery);
    }
    const body = document.createElement("div");
    body.className = "card-body";
    body.append(text("div", dive.country, "eyebrow"));
    const heading = document.createElement("h3");
    const button = text("button", dive.place, "story-link");
    button.addEventListener("click", () => showStory(dive));
    heading.append(button);
    body.append(heading, text("p", (dive.highlight || "A dive worth remembering.").slice(0, 180)),
      text("div", [dive.diver, dive.date, `${photos.length} photos`, `${(dive.videos || []).length} shorts`].filter(Boolean).join(" · "), "meta"));
    const byline = body.lastElementChild;
    byline.classList.add("member-byline");
    byline.prepend(createMemberAvatar(dive.diver, dive.authorPhoto));
    article.append(body);
    return article;
  }
  function filterDestinations() {
    const filtered = records.filter(dive =>
      (!selectedCountry || countryKey(dive.country) === selectedCountry) &&
      (!selectedDiver || diverKey(dive) === selectedDiver));
    const pageCount = Math.max(1, Math.ceil(filtered.length / destinationPageSize));
    destinationPage = Math.min(destinationPage, pageCount - 1);
    destinationCards.replaceChildren(...filtered.slice(destinationPage * destinationPageSize, (destinationPage + 1) * destinationPageSize).map(dive => makeCard(dive, false)));
    if (!filtered.length && records.length) destinationCards.append(text("p", "No dives match this country and diver. Try another filter.", "editor-note"));
    pageLabel.textContent = `Page ${destinationPage + 1} of ${pageCount}`;
    previousPage.disabled = destinationPage === 0;
    nextPage.disabled = destinationPage >= pageCount - 1;
    pager.hidden = filtered.length <= destinationPageSize;
    const label = records.find(dive => countryKey(dive.country) === selectedCountry);
    document.getElementById("destination-title").textContent = label ? `Field notes from ${label.country}.` : "Across our blue planet.";
    const diver = records.find(dive => diverKey(dive) === selectedDiver);
    document.getElementById("destination-count").textContent = `${filtered.length} dive entries${diver ? ` · ${diver.diver}` : ""}`;
    countryTabs.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.liveCountry === selectedCountry)));
    atlas.querySelectorAll("[data-live-country]").forEach(marker => marker.setAttribute("aria-pressed", String(marker.dataset.liveCountry === selectedCountry)));
  }
  function renderCollection() {
    const mine = plantedDives.map((dive, index) => ({ dive, index })).filter(({ dive }) => dive.ownedByCurrentUser);
    const pages = Math.max(1, Math.ceil(mine.length / collectionPageSize));
    collectionPage = Math.max(0, Math.min(collectionPage, pages - 1));
    collectionPager.hidden = mine.length <= collectionPageSize;
    collectionPager.querySelector("span").textContent = `Page ${collectionPage + 1} of ${pages}`;
    collectionPager.querySelector('[data-direction="-1"]').disabled = collectionPage === 0;
    collectionPager.querySelector('[data-direction="1"]').disabled = collectionPage === pages - 1;
    document.getElementById("nudi-collection-grid").replaceChildren(...mine
      .slice(collectionPage * collectionPageSize, (collectionPage + 1) * collectionPageSize)
      .map(({ dive, index }) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "nudi-collection-card";
        card.dataset.diveId = dive.id;
        card.setAttribute("aria-haspopup", "dialog");
        const portrait = document.createElementNS(animals.namespaceURI, "svg");
        portrait.classList.add("celebration-nudi");
        portrait.setAttribute("viewBox", "0 0 240 150");
        portrait.setAttribute("aria-hidden", "true");
        const animal = animalTemplates[index % animalTemplates.length].cloneNode(true);
        animal.setAttribute("transform", "translate(120 78) scale(2.5)");
        portrait.append(animal);
        card.append(portrait, text("strong", nudiName(dive)),
          text("span", `${dive.place} · ${dive.country}`), text("span", dive.date || ""),
          text("span", "Meet this nudi ↗"));
        card.addEventListener("click", () => openNudi(dive, index));
        return card;
      }));
  }
  function update(data) {
    records = data ? data.dives : [];
    plantedDives = plantingOrder(records);
    const activeNudiIndex = plantedDives.findIndex(dive => dive.id === activeNudiId);
    if (activeNudiIndex >= 0) {
      if (nudiDialog.open) renderNudiDetails(plantedDives[activeNudiIndex], activeNudiIndex);
    } else {
      nudiDialog.close();
      activeNudiId = null;
      document.getElementById("garden-nudi-portrait").replaceChildren();
      for (const id of ["garden-nudi-name", "garden-nudi-origin", "garden-nudi-planter"]) document.getElementById(id).replaceChildren();
    }
    const mine = plantedDives.map((dive, index) => ({ dive, index })).filter(({ dive }) => dive.ownedByCurrentUser);
    if (!data) onlyMyNudis = false;
    myNudiButton.disabled = !data;
    myNudiButton.textContent = `My nudis · ${mine.length}`;
    document.getElementById("nudi-collection-status").textContent = !data
      ? "Sign in to discover your planted nudis."
      : mine.length ? `You've planted ${mine.length} ${mine.length === 1 ? "nudi" : "nudis"}. One little creature for every dive memory.`
        : "Your collection starts with your first logged dive. Plant a nudi and bring our reef to life!";
    if (!data) collectionPage = 0;
    renderCollection();
    const divers = new Map();
    records.forEach(dive => divers.set(diverKey(dive), dive.diver));
    if (!divers.has(selectedDiver)) {
      selectedDiver = "";
      destinationPage = 0;
    }
    diverSelect.replaceChildren(new Option("All divers", ""),
      ...[...divers].sort((a, b) => a[1].localeCompare(b[1])).map(([id, name]) => new Option(name, id)));
    diverSelect.value = selectedDiver;
    diverSelect.disabled = !data || !records.length;
    if (dialog.open) {
      const story = records.find(dive => dive.id === activeStoryId);
      if (story) renderStory(story);
      else {
        storyGallery.replaceChildren();
        storyGallery.hidden = true;
        dialog.close();
      }
    }
    if (!data) {
      document.getElementById("story-title").textContent = "";
      document.getElementById("story-copy").textContent = "";
      dialog.querySelector(".editor-note").textContent = "Member-submitted dive story.";
      activeStoryId = null;
    }
    const countries = new Map();
    records.forEach(dive => countries.set(countryKey(dive.country), dive.country.trim()));
    if (!countries.has(selectedCountry)) selectedCountry = "";
    const counts = data ? [records.length, countries.size, records.reduce((sum, dive) => sum + (dive.photos || []).length, 0)] : ["—", "—", "—"];
    document.querySelectorAll(".stats strong").forEach((node, index) => { node.textContent = counts[index]; });
    const featuredRecords = [...records.filter(dive => dive.photo || (dive.videos || []).length), ...records.filter(dive => !dive.photo && !(dive.videos || []).length)].slice(0, 3);
    storyGrid.replaceChildren(...featuredRecords.map(dive => makeCard(dive, true)));
    if (!featuredRecords.length) storyGrid.append(text("p", data ? "Your first community story starts with a logged dive." : "Sign in to explore community dive stories.", "editor-note"));
    featuredLive.disabled = !records.length;
    activities.forEach((activity, index) => {
      const dive = records[index];
      activity.replaceChildren();
      activity.hidden = !dive;
      if (dive) activity.append(createMemberAvatar(dive.diver, dive.authorPhoto),
        text("p", `${dive.diver} logged ${dive.place}, ${dive.country}.`));
    });
    countryTabs.replaceChildren();
    atlas.querySelectorAll('[data-country-marker],[data-live-country]').forEach(marker => marker.remove());
    const unmappedCountries = [];
    [["", "All destinations"], ...[...countries].sort((a,b) => a[1].localeCompare(b[1]))].forEach(([key, label]) => {
      const button = text("button", label);
      button.dataset.liveCountry = key;
      button.addEventListener("click", () => { selectedCountry = key; destinationPage = 0; filterDestinations(); });
      countryTabs.append(button);
      if (!key) return;
      const position = countryPositions.get(key);
      if (!position) {
        unmappedCountries.push(label);
        return;
      }
      const { longitude, latitude } = position;
      const x = (longitude + 180) / 360 * 960;
      const y = (90 - latitude) / 180 * 480;
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
      marker.dataset.liveCountry = key;
      marker.setAttribute("role", "button");
      marker.setAttribute("tabindex", "0");
      marker.setAttribute("aria-label", `Explore ${label} dives`);
      const flag = document.createElementNS(marker.namespaceURI, "use");
      flag.setAttribute("href", "#dive-flag");
      flag.setAttribute("x", x);
      flag.setAttribute("y", y);
      const title = document.createElementNS(marker.namespaceURI, "title");
      title.textContent = label;
      marker.append(flag, title);
      const choose = () => { selectedCountry = key; destinationPage = 0; filterDestinations(); };
      marker.addEventListener("click", choose);
      marker.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(); }
      });
      atlas.append(marker);
    });
    oldNote.textContent = mapNote + (unmappedCountries.length
      ? ` No map position found for: ${unmappedCountries.join(", ")}. These entries remain available in the country filters; edit their country to use the dropdown.`
      : "");
    animals.replaceChildren(...plantedDives.slice(0, animalTemplates.length).map((dive, index) => {
      const animal = animalTemplates[index].cloneNode(true);
      const button = document.createElementNS(animals.namespaceURI, "g");
      button.setAttribute("transform", animal.getAttribute("transform"));
      animal.removeAttribute("transform");
      button.dataset.diveId = dive.id;
      button.dataset.owned = String(dive.ownedByCurrentUser === true);
      button.setAttribute("role", "button");
      button.setAttribute("tabindex", "0");
      button.setAttribute("aria-label", `Meet ${nudiName(dive)}, planted by ${dive.diver}`);
      button.setAttribute("aria-haspopup", "dialog");
      const hitArea = document.createElementNS(animals.namespaceURI, "ellipse");
      hitArea.classList.add("nudi-hit-area");
      hitArea.setAttribute("rx", "39");
      hitArea.setAttribute("ry", "30");
      hitArea.setAttribute("fill", "transparent");
      button.append(hitArea, animal);
      const open = () => openNudi(dive, index);
      button.addEventListener("click", open);
      button.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
      });
      return button;
    }));
    filterGarden();
    garden.querySelector(".track span").style.width = `${Math.min(records.length, 100)}%`;
    const progress = garden.querySelector("small");
    progress.classList.add("garden-progress");
    progress.textContent = data
      ? `${records.length} / 100 dives logged · ${records.length >= 100 ? "Goal reached!" : `${100 - records.length} to go!`}`
      : "Our goal: 100 community dives · Sign in to see our progress.";
    garden.querySelector("p").textContent = "More dives. More nudis. Log yours and bring our reef to life.";
    filterDestinations();
    if (!data) document.getElementById("destination-count").textContent = "Sign in to view community destinations.";
  }
  window.addEventListener("community-data", event => update(event.detail));
  update(null);
})();
