const background = document.createElement("style");

function copyBackground() {
  const color = document.body.style.backgroundColor;
  if (!color) return;
  const css = `:root { --fixer-page-bg: ${color}; }`;
  if (background.textContent !== css) background.textContent = css;
  if (!background.isConnected) document.documentElement.append(background);
}

function watchBody() {
  copyBackground();
  new MutationObserver(copyBackground).observe(document.body, { attributes: true, attributeFilter: ["style"] });
}

if (document.body) watchBody();
else document.addEventListener("DOMContentLoaded", watchBody);
