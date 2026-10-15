let replySessionVersion = 0;
window.addEventListener("community-data", event => {
  if (!event.detail) replySessionVersion++;
});

function createReplyThread(kind, parentId) {
  const thread = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = kind === "gear" ? "Ask about this item / View replies" : "Reply / View discussion";
  const list = document.createElement("div");
  const status = document.createElement("p");
  status.className = "editor-note";
  status.setAttribute("role", "status");
  const form = document.createElement("form");
  form.className = "community-form";
  const label = document.createElement("label");
  label.textContent = "Your reply (visible to signed-in community members)";
  const input = document.createElement("textarea");
  input.required = true;
  input.maxLength = 2000;
  label.append(input);
  const submit = document.createElement("button");
  submit.className = "button";
  submit.type = "submit";
  submit.textContent = "Post reply";
  form.append(label, submit);
  thread.append(summary, list, form, status);
  const session = replySessionVersion;
  let loading = false;
  const current = () => session === replySessionVersion && thread.isConnected;
  function report(error) {
    status.textContent = ["42P01", "PGRST205"].includes(error.code)
      ? "Replies need the database update. Ask the site administrator to run supabase-replies.sql in the Supabase SQL Editor."
      : `Reply action failed: ${error.message}`;
  }
  async function load() {
    if (loading) return;
    loading = true;
    submit.disabled = true;
    status.textContent = "Loading replies…";
    try {
      const rows = await window.DiveCompassSupabase.call("getReplies", { kind, parentId });
      if (!current()) return;
      list.replaceChildren();
      rows.forEach(reply => {
        const article = document.createElement("div");
        article.className = "sample-reply";
        const author = document.createElement("p");
        author.textContent = `${reply.author} · ${new Date(reply.created_at).toLocaleString()}`;
        author.className = "member-byline";
        author.prepend(createMemberAvatar(reply.author, reply.authorPhoto));
        const body = document.createElement("p");
        body.style.whiteSpace = "pre-wrap";
        body.textContent = reply.body;
        article.append(author, body);
        if (reply.ownedByCurrentUser) {
          const edit = document.createElement("button");
          edit.type = "button";
          edit.className = "text-button";
          edit.textContent = "Edit reply";
          const remove = document.createElement("button");
          remove.type = "button";
          remove.className = "text-button";
          remove.textContent = "Delete reply";
          edit.addEventListener("click", () => {
            edit.disabled = true;
            const editForm = document.createElement("form");
            editForm.className = "community-form";
            const editLabel = document.createElement("label");
            editLabel.textContent = "Edit your reply";
            const field = document.createElement("textarea");
            field.value = reply.body;
            field.required = true;
            field.maxLength = 2000;
            editLabel.append(field);
            const save = document.createElement("button");
            save.type = "submit";
            save.textContent = "Save changes";
            const cancel = document.createElement("button");
            cancel.type = "button";
            cancel.textContent = "Cancel";
            cancel.addEventListener("click", () => { editForm.remove(); edit.disabled = false; });
            editForm.append(editLabel, save, cancel);
            article.append(editForm);
            field.focus();
            editForm.addEventListener("submit", async event => {
              event.preventDefault();
              if (!field.value.trim()) { status.textContent = "Enter a reply, not just spaces."; return; }
              save.disabled = cancel.disabled = remove.disabled = true;
              let saved = false;
              try {
                await window.DiveCompassSupabase.call("updateReply", { id: reply.id, body: field.value });
                saved = true;
                if (!current()) return;
                await load();
              } catch (error) {
                if (current()) report(error);
              } finally {
                save.disabled = cancel.disabled = remove.disabled = false;
                if (saved) { editForm.remove(); edit.disabled = false; }
              }
            });
          });
          remove.addEventListener("click", async () => {
            if (!window.confirm("Permanently delete your reply?")) return;
            remove.disabled = edit.disabled = true;
            try {
              await window.DiveCompassSupabase.call("deleteReply", { id: reply.id });
              if (current()) await load();
            } catch (error) {
              if (current()) report(error);
            } finally {
              remove.disabled = edit.disabled = false;
            }
          });
          article.append(edit, remove);
        }
        list.append(article);
      });
      status.textContent = rows.length ? `${rows.length} replies` : "No replies yet. Start the conversation.";
    } catch (error) {
      if (current()) report(error);
    } finally {
      loading = false;
      submit.disabled = false;
    }
  }
  thread.addEventListener("toggle", () => { if (thread.open) load(); });
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!input.value.trim()) { status.textContent = "Enter a reply, not just spaces."; return; }
    submit.disabled = true;
    status.textContent = "Posting reply…";
    let saved = false;
    try {
      await window.DiveCompassSupabase.call("saveReply", { kind, parentId, body: input.value });
      saved = true;
      if (!current()) return;
      input.value = "";
      await load();
    } catch (error) {
      if (current()) {
        report(error);
        if (saved) status.textContent = "Reply saved, but refresh failed. Reopen the thread before posting again.";
      }
    } finally {
      submit.disabled = false;
    }
  });
  return thread;
}
