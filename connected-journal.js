(() => {
  const storyGrid = document.querySelector(".story-grid");
  const destinationCards = document.querySelector("#destinations .cards");
  const countryTabs = document.querySelector('#destinations .tabs');
  const atlas = document.querySelector(".world-panel svg");
  const animals = document.getElementById("reef-nudibranchs");
  const animalTemplates = [...animals.children].map(animal => animal.cloneNode(true));
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
  const countryPositions = {
    egypt:[30,26], maldives:[73,4], indonesia:[118,-2], malta:[14.4,35.9],
    thailand:[101,15], philippines:[122,12], malaysia:[110,4],
    australia:[134,-25], mexico:[-102,24], belize:[-88,17],
    palau:[134,7], fiji:[178,-18], japan:[138,37],
    spain:[-4,40], portugal:[-8,39], italy:[12,43], france:[2,46],
    croatia:[16,45], cyprus:[33,35], iceland:[-19,65], norway:[9,62],
    "united kingdom":[-3,55], "south africa":[25,-29], mozambique:[35,-18],
    tanzania:[35,-6], seychelles:[55,-5], mauritius:[57,-20],
    ecuador:[-79,-2], "costa rica":[-84,10], honduras:[-87,15],
    bonaire:[-68,12], curaçao:[-69,12], oman:[57,21],
    "new zealand":[173,-41], "united states":[-100,39], usa:[-100,39],
    sudan:[30,16], jordan:[36,31], "saudi arabia":[45,24]
  };
  const countryKey = country => country.trim().toLocaleLowerCase("en");
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
  oldNote.textContent = "Country flags indicate approximate country locations, not exact dive sites. Countries without a mapped position remain available in the filters.";
  const caption = document.querySelector(".map-caption");
  caption.lastChild.textContent = " public-domain boundaries. Small islands may be omitted. Flags show approximate country positions, not verified dive sites.";
  document.getElementById("atlas-description").textContent = "World map with selectable dive flags for mapped community countries. The country buttons offer all recorded destinations.";
  garden.querySelector("svg desc").textContent = "Artistic nudibranch illustrations among corals and rocks. The displayed count follows community dives, up to the illustration limit. Not a species-identification diagram.";
  document.querySelector(".preview").textContent = "OneAD diving community · Share generously. Respect the ocean.";

  function showStory(dive) {
    activeStoryId = dive.id;
    document.getElementById("story-title").textContent = dive.place;
    document.getElementById("story-copy").textContent =
      [dive.country, dive.diver, dive.date].filter(Boolean).join(" · ") + "\n\n" + (dive.highlight || "No story added yet.");
    dialog.showModal();
  }
  featuredLive.addEventListener("click", () => {
    const dive = records.find(record => record.photos && record.photos.length) || records[0];
    if (dive) showStory(dive);
  });
  function makeCard(dive, homepage) {
    const article = document.createElement("article");
    article.className = homepage ? "card" : "destination-card";
    if (dive.photo) {
      const image = document.createElement("img");
      image.src = dive.photo;
      image.alt = `${dive.place} · Main dive photo`;
      image.loading = "lazy";
      if (!homepage) image.className = "live-dive-photo";
      article.append(image);
    }
    const body = document.createElement("div");
    body.className = "card-body";
    body.append(text("div", dive.country, "eyebrow"));
    const heading = document.createElement("h3");
    const button = text("button", dive.place, "story-link");
    button.addEventListener("click", () => showStory(dive));
    heading.append(button);
    body.append(heading, text("p", (dive.highlight || "A dive worth remembering.").slice(0, 180)),
      text("div", [dive.diver, dive.date, `${(dive.photos || []).length} photos`].filter(Boolean).join(" · "), "meta"));
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
  function update(data) {
    records = data ? data.dives : [];
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
    if (dialog.open && (!data || !records.some(dive => dive.id === activeStoryId))) dialog.close();
    if (!data) {
      document.getElementById("story-title").textContent = "";
      document.getElementById("story-copy").textContent = "";
      activeStoryId = null;
    }
    const countries = new Map();
    records.forEach(dive => countries.set(countryKey(dive.country), dive.country.trim()));
    if (!countries.has(selectedCountry)) selectedCountry = "";
    const counts = data ? [records.length, countries.size, records.reduce((sum, dive) => sum + (dive.photos || []).length, 0)] : ["—", "—", "—"];
    document.querySelectorAll(".stats strong").forEach((node, index) => { node.textContent = counts[index]; });
    const featuredRecords = [...records.filter(dive => dive.photo), ...records.filter(dive => !dive.photo)].slice(0, 3);
    storyGrid.replaceChildren(...featuredRecords.map(dive => makeCard(dive, true)));
    if (!featuredRecords.length) storyGrid.append(text("p", data ? "Your first community story starts with a logged dive." : "Sign in to explore community dive stories.", "editor-note"));
    featuredLive.disabled = !records.length;
    activities.forEach((activity, index) => {
      const dive = records[index];
      activity.replaceChildren();
      activity.hidden = !dive;
      if (dive) activity.append(text("span", (dive.diver || "?").charAt(0).toUpperCase(), "avatar"),
        text("p", `${dive.diver} logged ${dive.place}, ${dive.country}.`));
    });
    document.querySelector(".destination p").textContent = data ? `Explore our dives across ${countries.size} destinations.` : "Sign in to explore our community destinations.";
    countryTabs.replaceChildren();
    atlas.querySelectorAll('[data-country-marker],[data-live-country]').forEach(marker => marker.remove());
    [["", "All destinations"], ...[...countries].sort((a,b) => a[1].localeCompare(b[1]))].forEach(([key, label]) => {
      const button = text("button", label);
      button.dataset.liveCountry = key;
      button.addEventListener("click", () => { selectedCountry = key; destinationPage = 0; filterDestinations(); });
      countryTabs.append(button);
      const position = countryPositions[key];
      if (!position) return;
      const [longitude, latitude] = position;
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
    animals.replaceChildren(...animalTemplates.slice(0, Math.min(records.length, animalTemplates.length)).map(node => node.cloneNode(true)));
    garden.querySelector(".track span").style.width = `${Math.min(records.length, 100)}%`;
    const progress = garden.querySelector("small");
    progress.classList.add("garden-progress");
    progress.textContent = data
      ? `${records.length} / 100 dives logged · ${records.length >= 100 ? "Goal reached!" : `${100 - records.length} to go!`}`
      : "Our goal: 100 community dives · Sign in to see our progress.";
    garden.querySelector("p").textContent = "Our reef grows with every shared dive. Add yours and help us reach our community goal.";
    filterDestinations();
    if (!data) document.getElementById("destination-count").textContent = "Sign in to view community destinations.";
  }
  window.addEventListener("community-data", event => update(event.detail));
  update(null);
})();
