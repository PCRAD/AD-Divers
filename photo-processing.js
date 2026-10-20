async function prepareCommunityPhoto(file, maximumDimension = 800) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
    throw new Error("Choose a JPEG, PNG, or WebP image no larger than 10 MB.");
  }
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maximumDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const drawing = canvas.getContext("2d");
    if (!drawing) throw new Error("Image processing is unavailable in this browser.");
    drawing.fillStyle = "#fff";
    drawing.fillRect(0, 0, canvas.width, canvas.height);
    drawing.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    bitmap.close();
  }
}

function validateCommunityShort(file, maximumDuration = 10) {
  if (!["video/mp4", "video/webm"].includes(file.type) || file.size > 50 * 1024 * 1024) {
    return Promise.reject(new Error("Choose an MP4 or WebM short no larger than 50 MB."));
  }
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    let finished = false;
    const finish = error => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      video.onloadedmetadata = null;
      video.onerror = null;
      video.removeAttribute("src");
      video.load();
      if (error) reject(error);
      else resolve(videoDuration);
    };
    let videoDuration;
    const timeout = setTimeout(() => finish(new Error(`Could not read ${file.name} in time. Try another video or reload the page.`)), 30000);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      videoDuration = video.duration;
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        finish(new Error("Could not read the short's duration."));
      } else if (video.duration > maximumDuration) {
        finish(new Error(`Each short must be ${maximumDuration} seconds or shorter.`));
      } else {
        finish();
      }
    };
    video.onerror = () => finish(new Error(`Could not read ${file.name}. Choose a playable MP4 or WebM video.`));
    video.src = url;
  });
}
