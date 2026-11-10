{
  let handled = null;

  function selectAll() {
    const path = location.pathname.replace(/\/$/, "");
    const handle = path.split("/")[1];
    if (handled !== handle) handled = null;
    if (handled || !document.documentElement.classList.contains("fixer-selectAll")) return;

    const tab = document.querySelector('[data-testid="primaryColumn"] [role="tablist"] a[aria-haspopup="menu"][aria-selected="true"]');
    if (!tab || tab.getAttribute("href").split("/")[1] !== handle) return;

    handled = handle;
    if (path !== "/" + handle) return;
    history.replaceState(history.state, "", path + "/all");
    dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
  }

  new MutationObserver(selectAll).observe(document.documentElement, { childList: true, subtree: true });
}
