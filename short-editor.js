function createCommunityShortEditor(file, duration) {
  const element = document.createElement("section");
  element.className = "short-editor";
  const title = document.createElement("strong");
  title.textContent = file.name;
  const video = document.createElement("video");
  const url = URL.createObjectURL(file);
  video.src = url;
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.setAttribute("aria-label", `Preview ${file.name}`);
  const controls = document.createElement("div");
  controls.className = "short-trim-controls";
  function timeControl(text) {
    const label = document.createElement("label");
    label.append(document.createTextNode(text));
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = String(duration);
    input.step = "0.1";
    input.setAttribute("aria-label", `${text} for ${file.name}`);
    label.append(input);
    controls.append(label);
    return input;
  }
  const start = timeControl("Start");
  const end = timeControl("End");
  const minimum = Math.min(0.1, duration);
  start.max = String(duration - minimum);
  if (duration < 0.1) start.step = end.step = "any";
  start.value = "0";
  end.value = String(Math.min(duration, 10));
  const summary = document.createElement("p");
  summary.className = "editor-note";
  summary.setAttribute("role", "status");
  const preview = document.createElement("button");
  preview.type = "button";
  preview.className = "text-button";
  preview.textContent = "Preview highlight";
  const message = document.createElement("p");
  message.className = "editor-note";
  message.setAttribute("role", "status");
  let previewing = false;
  let destroyed = false;
  const selection = () => ({ start: Number(start.value), end: Number(end.value) });
  function update(changed) {
    video.pause();
    previewing = false;
    let a = Number(start.value);
    let b = Number(end.value);
    if (changed === start) {
      a = Math.min(a, duration - minimum);
      b = Math.min(duration, Math.max(a + minimum, Math.min(b, a + 10)));
    } else if (changed === end) {
      b = Math.max(minimum, b);
      a = Math.max(0, Math.min(b - minimum, Math.max(a, b - 10)));
    }
    start.value = String(a);
    end.value = String(b);
    const range = selection();
    summary.textContent = `${range.start.toFixed(1)}s to ${range.end.toFixed(1)}s · ${(range.end - range.start).toFixed(1)} seconds selected (maximum 10s)`;
    start.setAttribute("aria-valuetext", `${range.start.toFixed(1)} seconds`);
    end.setAttribute("aria-valuetext", `${range.end.toFixed(1)} seconds`);
    if (video.readyState >= 1) video.currentTime = changed === end ? range.end : range.start;
  }
  start.addEventListener("input", () => update(start));
  end.addEventListener("input", () => update(end));
  preview.addEventListener("click", async () => {
    video.pause();
    video.currentTime = selection().start;
    previewing = true;
    message.textContent = "";
    try { await video.play(); }
    catch (error) { message.textContent = `Could not preview this clip: ${error.message}`; }
  });
  video.addEventListener("timeupdate", () => {
    if (previewing && video.currentTime >= selection().end) {
      video.pause();
      previewing = false;
    }
  });
  video.addEventListener("error", () => {
    if (!destroyed) message.textContent = "This browser could not play the selected video. Try an H.264 MP4 or a WebM file.";
  });
  element.append(title, video, controls, summary, preview, message);
  update();
  return {
    file, duration, element, selection,
    destroy() {
      destroyed = true;
      video.pause();
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(url);
      element.remove();
    },
    setDisabled(disabled) {
      element.querySelectorAll("input, button").forEach(control => { control.disabled = disabled; });
      if (disabled) video.pause();
    }
  };
}

async function exportCommunityShort(clip, onProgress) {
  const { start, end } = clip.selection();
  if (![start, end].every(Number.isFinite) || start < 0 || end > clip.duration || end <= start || end - start > 10.000001) {
    throw new Error("Choose a highlight longer than 0 and no longer than 10 seconds.");
  }
  if (start === 0 && end === clip.duration && clip.duration <= 10) return clip.file;
  if (!window.VideoEncoder || !window.VideoDecoder) {
    throw new Error("Video trimming is unavailable in this browser. Use a current Chrome, Edge, or Safari browser, or select an already trimmed clip.");
  }
  const media = await import("https://cdn.jsdelivr.net/npm/mediabunny@1.61.6/+esm");
  const input = new media.Input({ source: new media.BlobSource(clip.file), formats: media.ALL_FORMATS });
  let conversion;
  try {
    const mp4 = await media.canEncodeVideo("avc") && await media.canEncodeAudio("aac");
    const target = new media.BufferTarget();
    const output = new media.Output({
      format: mp4 ? new media.Mp4OutputFormat() : new media.WebMOutputFormat(),
      target
    });
    conversion = await media.Conversion.init({
      input, output,
      trim: { start, end },
      video: { codec: mp4 ? "avc" : "vp9", forceTranscode: true },
      audio: { codec: mp4 ? "aac" : "opus", forceTranscode: true }
    });
    if (!conversion.isValid || conversion.discardedTracks.length) {
      await conversion.cancel();
      throw new Error("This browser cannot export this video with all its tracks. Try a current Chrome or Edge browser, or trim the video in your device's editor first.");
    }
    conversion.onProgress = onProgress;
    await conversion.execute();
    if (!target.buffer) throw new Error("The browser did not produce a video file.");
    const type = mp4 ? "video/mp4" : "video/webm";
    const name = clip.file.name.replace(/\.[^.]+$/, "") + `-highlight.${mp4 ? "mp4" : "webm"}`;
    const file = new File([target.buffer], name, { type });
    await validateCommunityShort(file);
    return file;
  } catch (error) {
    throw new Error(`Could not prepare this highlight. The original video was not uploaded. Try a current Chrome or Edge browser, or trim it in your device's editor first. ${error.message}`);
  } finally {
    if (conversion && conversion.state !== "done") await conversion.cancel();
    input.dispose();
  }
}
