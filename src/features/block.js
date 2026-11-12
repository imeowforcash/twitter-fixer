{
  function findBlock(caret) {
    const key = Object.keys(caret).find((k) => k.startsWith("__reactFiber$"));
    for (let fiber = caret[key]; fiber; fiber = fiber.return) {
      const menu = fiber.stateNode;
      if (typeof menu?._getActionItems === "function") return menu._getActionItems()[0]?.find((item) => item.testID === "block");
    }
  }

  // twitter reopens the 3 dots menu when u cancel the confirm so we close it again
  function block(caret) {
    let asked = false;
    const watch = new MutationObserver(() => {
      const menu = document.querySelector('[role="menu"]');
      if (document.querySelector('[data-testid="confirmationSheetDialog"]')) asked = true;
      else if (asked || menu) {
        const item = !asked && menu.querySelector('[data-testid="block"]');
        if (item) return item.click();
        watch.disconnect();
        if (menu) caret.click();
      }
    });
    watch.observe(document.body, { childList: true, subtree: true });
    caret.click();
  }

  function addBlockButton() {
    if (!document.documentElement.classList.contains("fixer-blockButton")) return;

    // grok buttons can show up after us and twitter puts them right before the 3 dots
    for (const item of document.querySelectorAll("[data-fixer-block]")) {
      const slot = item.parentElement.querySelector(':scope > :has([data-testid="caret"])');
      if (slot && item.nextElementSibling !== slot) slot.before(item);
    }

    for (const caret of document.querySelectorAll('[data-testid="tweet"] [data-testid="caret"]:not([data-fixer-checked])')) {
      caret.dataset.fixerChecked = "";
      const found = findBlock(caret);
      const d = found?.Icon.toString().match(/d:"([^"]+)"/)?.[1];
      if (!d) continue;

      const item = caret.parentElement.cloneNode(true);
      item.dataset.fixerBlock = "";
      const button = item.querySelector("button");
      button.removeAttribute("data-testid");
      button.removeAttribute("aria-haspopup");
      button.removeAttribute("aria-expanded");
      button.setAttribute("aria-label", found.text);
      button.querySelector("path").setAttribute("d", d);
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        block(caret);
      });
      caret.parentElement.parentElement.parentElement.before(item);
    }
  }

  new MutationObserver(addBlockButton).observe(document.documentElement, { childList: true, subtree: true });
}
