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

    drawIcon(item.querySelector("svg"), "textAlignStart");
    item.querySelector("span").textContent = "View quotes";

    item.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      history.pushState({}, "", item.getAttribute("href"));
      dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
    });
    quote.after(item);
  }

  new MutationObserver(addViewQuotes).observe(document.documentElement, { childList: true, subtree: true });
}
