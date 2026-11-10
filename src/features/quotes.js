{
  let status;

  document.addEventListener(
    "click",
    (e) => {
      const button = e.target.closest('[data-testid="retweet"], [data-testid="unretweet"]');
      if (button) status = button.closest('[data-testid="tweet"]')?.querySelector('a[href*="/status/"] time')?.closest("a")?.getAttribute("href");
    },
    true,
  );

  function findHistory(el) {
    const key = Object.keys(el).find((k) => k.startsWith("__reactFiber$"));
    for (let fiber = el[key]; fiber; fiber = fiber.return) if (typeof fiber.memoizedProps?.history?.push === "function") return fiber.memoizedProps.history;
  }

  function addViewQuotes() {
    if (!status || !document.documentElement.classList.contains("fixer-viewQuotes")) return;
    const quote = document.querySelector('[role="menu"] a[role="menuitem"][href="/compose/post"]');
    if (!quote) return;

    const existing = quote.closest('[role="menu"]').querySelector("[data-fixer-quotes]");
    if (existing) {
      if (quote.nextElementSibling !== existing) quote.after(existing);
      return;
    }

    const item = quote.cloneNode(true);
    item.dataset.fixerQuotes = "";
    item.setAttribute("href", status + "/quotes");

    item.querySelector("svg").dataset.fixerIcon = "textAlignStart";
    item.querySelector("span").textContent = "View quotes";

    item.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      findHistory(item.parentElement)?.push(item.getAttribute("href"));
    });
    quote.after(item);
  }

  new MutationObserver(addViewQuotes).observe(document.documentElement, { childList: true, subtree: true });
}
