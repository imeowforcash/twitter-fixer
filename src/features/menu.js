document.addEventListener(
  "contextmenu",
  (e) => {
    if (document.documentElement.classList.contains("fixer-defaultMenu") && e.target.closest('[data-testid="tweetPhoto"]')) e.stopPropagation();
  },
  true,
);
