function createMemberAvatar(name, photo) {
  const avatar = document.createElement("span");
  avatar.className = "member-avatar";
  avatar.textContent = (name || "?").charAt(0).toUpperCase();
  avatar.setAttribute("aria-hidden", "true");
  if (photo) {
    const image = document.createElement("img");
    image.src = photo;
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      console.warn("A member profile picture could not load.");
    }, { once: true });
    avatar.append(image);
  }
  return avatar;
}
