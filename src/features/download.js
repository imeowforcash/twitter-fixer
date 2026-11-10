{
  function findVideo(player) {
    let el = player.querySelector("video");
    let key;
    while (el && !(key = Object.keys(el).find((k) => k.startsWith("__reactFiber$")))) el = el.parentElement;

    let source;
    for (let fiber = el?.[key]; fiber; fiber = fiber.return) {
      const props = fiber.memoizedProps;
      if (!source && props?.source?.variants) source = props.source;
      if (source && props?.tweet?.user) return { source, name: props.tweet.user.name };
    }
    return source && { source };
  }

  function download(player) {
    const video = findVideo(player);
    const best = video?.source.variants.filter((v) => v.content_type === "video/mp4").sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))[0];
    if (!best) return;

    // chrome refuses the whole download if the name has any of these
    const name = video.name?.replace(/[\\/:*?"<>|\x00-\x1f]/g, "").trim();
    const filename = (name ? `${name} (${video.source.contentId})` : video.source.contentId) + ".mp4";
    document.dispatchEvent(new CustomEvent("fixer-download", { detail: JSON.stringify({ url: best.url, filename }) }));
  }

  function addDownloadButton() {
    for (const path of document.querySelectorAll('[data-testid="videoPlayer"] button path[d^="M3.457 2.04L9 7.59"]')) {
      const pip = path.closest("button");
      const wrapper = pip.parentElement;
      if (wrapper.nextElementSibling?.hasAttribute("data-fixer-download")) continue;

      const item = wrapper.cloneNode(true);
      item.dataset.fixerDownload = "";
      item.style.setProperty("--fixer-fg", getComputedStyle(pip.firstElementChild).color);
      const button = item.querySelector("button");
      button.setAttribute("aria-label", "Download");
      button.querySelector("svg").dataset.fixerIcon = "download";
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        download(button.closest('[data-testid="videoPlayer"]'));
      });
      wrapper.after(item);
    }
  }

  new MutationObserver(addDownloadButton).observe(document.documentElement, { childList: true, subtree: true });
}
