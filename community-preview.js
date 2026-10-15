(() => {
  const questionForm = document.getElementById("question-preview-form");
  const gearForm = document.getElementById("gear-preview-form");
  let data = null;
  let version = 0;
  let selected = [];
  let photoUrls = [];
  let busy = false;
  const pages = { questions: 0, gear: 0 };
  const element = (tag, value, className) => {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
  };
  const community = document.getElementById("community");
  community.querySelector(".explorer-heading .eyebrow").textContent = "The surface interval / Our community";
  community.querySelector(".explorer-heading p").textContent = "Ask a question, find your next dive buddy, or give well-loved gear a new chapter.";
  community.querySelector(":scope > .editor-note").textContent = "Questions and listings are shared with signed-in members and saved to your existing community.";
  document.getElementById("community-gear").previousElementSibling.textContent = "Member listings. Verify condition and suitability with the owner; this site does not process payments or reservations.";
  const note = community.querySelector(".community-note p:last-child");
  note.textContent = "Vote once per question. Replies are visible to all signed-in members, not private messages. Never publish sensitive contact or medical information.";
  community.querySelectorAll(".editor-note").forEach(node => {
    if (node.textContent.startsWith("For a future live exchange:")) node.textContent = node.textContent.replace("For a future live exchange:", "Before exchanging gear:");
  });

  function renderPhotos() {
    photoUrls.forEach(url => URL.revokeObjectURL(url));
    photoUrls = [];
    const list = document.getElementById("gear-selected-photos");
    list.replaceChildren();
    selected.forEach((file, index) => {
      const row = element("div", "", "selected-photo-row");
      const image = document.createElement("img");
      image.src = URL.createObjectURL(file);
      photoUrls.push(image.src);
      image.alt = "";
      const remove = element("button", "Remove", "text-button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Remove ${file.name}`);
      remove.addEventListener("click", () => {
        if (busy) return;
        selected.splice(index, 1);
        renderPhotos();
      });
      row.append(image, element("span", file.name), remove);
      list.append(row);
    });
  }
  gearForm.elements.photos.addEventListener("change", () => {
    const files = [...gearForm.elements.photos.files];
    gearForm.elements.photos.value = "";
    if (busy) return;
    const status = document.getElementById("gear-photo-status");
    if (selected.length + files.length > 5 || files.some(file => !["image/jpeg","image/png","image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024)) {
      status.textContent = "No photos added. Choose up to five JPEG, PNG, or WebP images, no larger than 10 MB each.";
      return;
    }
    selected.push(...files);
    renderPhotos();
    status.textContent = `${selected.length} / 5 photos selected.`;
  });

  function renderList(kind) {
    const isGear = kind === "gear";
    const items = data ? (isGear ? data.products : data.questions) : [];
    const size = isGear ? 3 : 4;
    const list = document.getElementById(isGear ? "community-gear" : "community-questions");
    const pager = document.getElementById(isGear ? "gear-pagination" : "question-pagination");
    const total = Math.max(1, Math.ceil(items.length / size));
    pages[kind] = Math.min(pages[kind], total - 1);
    list.replaceChildren();
    items.slice(pages[kind] * size, (pages[kind] + 1) * size).forEach(item => {
      const card = element("article", "", isGear ? "gear-card" : "community-thread");
      card.append(element("div", isGear ? item.condition : item.category, "eyebrow"),
        element("h3", isGear ? item.name : item.title),
        element("p", isGear ? `${item.owner} · CHF ${Number(item.price).toFixed(2)}` : item.author),
        element("p", isGear ? item.description : item.detail));
      const byline = card.children[2];
      byline.classList.add("member-byline");
      byline.prepend(createMemberAvatar(isGear ? item.owner : item.author, item.authorPhoto));
      if (isGear) {
        (item.images || []).forEach((url, index) => {
          const link = document.createElement("a");
          link.href = url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          const image = document.createElement("img");
          image.src = url;
          image.className = "live-dive-photo";
          image.alt = `${item.name} · Photo ${index + 1}`;
          image.loading = "lazy";
          link.append(image);
          card.append(link);
        });
      } else {
        const vote = element("button", `↑ Helpful · ${item.votes}`, "button");
        const status = element("p", "", "editor-note");
        status.setAttribute("role", "status");
        vote.addEventListener("click", async () => {
          const generation = version;
          vote.disabled = true;
          try {
            const saved = await window.DiveCompassSupabase.call("voteQuestion", item.id);
            if (generation !== version) return;
            item.votes = saved.votes;
            vote.textContent = `↑ Helpful · ${saved.votes}`;
            status.textContent = "Vote recorded. Each account can vote once.";
          } catch (error) {
            status.textContent = error.message;
            vote.disabled = false;
          }
        });
        card.append(vote, status);
      }
      card.append(createReplyThread(isGear ? "gear" : "question", item.id));
      list.append(card);
    });
    if (!items.length) list.append(element("p", data ? (isGear ? "No gear listings yet. Be the first to share one." : "No questions yet. Start a conversation.") : "Sign in to view community posts.", "editor-note"));
    pager.querySelector("span").textContent = `Page ${pages[kind] + 1} of ${total} · ${items.length} ${isGear ? "listings" : "questions"}`;
    pager.querySelector('[data-direction="-1"]').disabled = pages[kind] === 0;
    pager.querySelector('[data-direction="1"]').disabled = pages[kind] >= total - 1;
  }
  ["gear", "questions"].forEach(kind => {
    const pager = document.getElementById(kind === "gear" ? "gear-pagination" : "question-pagination");
    pager.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
      pages[kind] += Number(button.dataset.direction);
      renderList(kind);
      document.getElementById(kind === "gear" ? "gear-heading" : "discussion-heading").focus();
    }));
  });
  [questionForm, gearForm].forEach(form => form.addEventListener("submit", async event => {
    event.preventDefault();
    if (busy) return;
    const isGear = form === gearForm;
    const status = document.getElementById(isGear ? "gear-preview-status" : "question-preview-status");
    if (!data || !data.profile) {
      status.textContent = "Sign in and create your profile using the account button before posting.";
      return;
    }
    if (!form.elements.title.value.trim() || !form.elements.body.value.trim()) {
      status.textContent = "Enter a title and description, not just spaces.";
      return;
    }
    const generation = version;
    const values = new FormData(form);
    const files = [...selected];
    busy = true;
    [questionForm, gearForm].forEach(entry => entry.querySelector('button[type="submit"]').disabled = true);
    status.textContent = "Saving to the community…";
    let committed = false;
    try {
      let payload;
      if (isGear) {
        const images = [];
        for (const file of files) images.push(await prepareCommunityPhoto(file, 1600));
        payload = {
          name: values.get("title"), price: values.get("price"), condition: values.get("condition"),
          description: `[${values.get("category")}]\n${String(values.get("body")).trim()}`, images
        };
      } else payload = { title: values.get("title"), category: values.get("category"), detail: values.get("body") };
      if (generation !== version) throw new Error("Your session changed. Sign in and try again.");
      const saved = await window.DiveCompassSupabase.call(isGear ? "saveGearListing" : "saveQuestion", payload);
      committed = true;
      if (generation !== version) return;
      (isGear ? data.products : data.questions).unshift(saved);
      pages[isGear ? "gear" : "questions"] = 0;
      renderList(isGear ? "gear" : "questions");
      form.reset();
      if (isGear) { selected = []; renderPhotos(); document.getElementById("gear-photo-status").textContent = ""; }
      form.closest("details").open = false;
      status.textContent = isGear ? "Gear listing published." : "Question posted.";
    } catch (error) {
      status.textContent = committed ? `Saved, but display update failed. Refresh before retrying. ${error.message}` : error.message;
    } finally {
      busy = false;
      [questionForm, gearForm].forEach(entry => entry.querySelector('button[type="submit"]').disabled = false);
    }
  }));
  window.addEventListener("community-data", event => {
    if (event.detail && data &&
      JSON.stringify(event.detail.questions) === JSON.stringify(data.questions) &&
      JSON.stringify(event.detail.products) === JSON.stringify(data.products)) {
      data.profile = event.detail.profile;
      return;
    }
    if (!event.detail) {
      version++;
      data = null;
      pages.gear = pages.questions = 0;
      selected = [];
      renderPhotos();
      questionForm.reset();
      gearForm.reset();
      ["gear-preview-status", "question-preview-status", "gear-photo-status"].forEach(id => { document.getElementById(id).textContent = ""; });
    } else data = { ...event.detail, products: [...event.detail.products], questions: [...event.detail.questions] };
    renderList("gear");
    renderList("questions");
  });
  renderList("gear");
  renderList("questions");
})();
