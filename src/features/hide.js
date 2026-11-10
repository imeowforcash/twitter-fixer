function wrapper(el) {
  while (el.parentElement?.children.length === 1) el = el.parentElement;
  return el;
}

function markForHiding() {
  // premium profile + right area
  for (const a of document.querySelectorAll('a[href="/i/premium_sign_up"]:not([data-testid="premium-signup-tab"])')) {
    let el = a.closest("aside");
    if (!el) {
      el = a;
      while (el && !el.querySelector("button")) el = el.parentElement;
    }
    if (el && el !== document.body) wrapper(el).dataset.fixer = "premium";
  }

  // grok buttons on posts + replies + profiles
  for (const logo of document.querySelectorAll('button path[d^="M12.745 20.54"]')) {
    wrapper(logo.closest("button")).dataset.fixer = "grok";
  }
}

new MutationObserver(markForHiding).observe(document.documentElement, { childList: true, subtree: true });
markForHiding();
