const sizes = document.createElement("style");

const measured = new Set();

function remember(key, value) {
  featureData[key] = value;
  measured.add(key);
  saveFeatureData();
}

function inkRight(svg) {
  const box = svg.getBoundingClientRect();
  const path = svg.querySelector("path").getBBox();
  return box.left + (path.x + path.width) * (box.width / svg.viewBox.baseVal.width);
}

function measureAlignment() {
  if (!measured.has("backShift")) {
    const path = document.querySelector('[data-testid="app-bar-back"] svg path');
    const svg = path?.closest("svg");
    const width = svg?.getBoundingClientRect().width;
    if (width) remember("backShift", -path.getBBox().x * (width / svg.viewBox.baseVal.width));
  }

  if (!measured.has("indent")) {
    const tweet = document.querySelector('[data-testid="tweet"]');
    const avatar = tweet?.querySelector('[data-testid="Tweet-User-Avatar"]');
    const name = tweet?.querySelector('[data-testid="User-Name"]');
    if (avatar && name) remember("indent", name.getBoundingClientRect().left - avatar.getBoundingClientRect().left);
  }

  // fixes alignment for todays news close button
  if (!measured.has("closeShift")) {
    const close = document.querySelector('[data-testid="sidebarColumn"] h2 button svg');
    const dots = document.querySelector('[data-testid="sidebarColumn"] [data-testid="caret"] svg');
    if (close && dots) {
      const applied = parseFloat(getComputedStyle(close.closest("button")).translate) || 0;
      remember("closeShift", inkRight(dots) - inkRight(close) + applied);
    }
  }

  // fixes alignment for notification icons like likes and reposts
  for (const svg of document.querySelectorAll('article[data-testid="notification"] > div > div:first-child > svg')) {
    const width = svg.getBoundingClientRect().width;
    if (!width) continue;
    const path = svg.querySelector("path").getBBox();
    const center = width / 2 - (path.x + path.width / 2) * (width / svg.viewBox.baseVal.width) + "px";
    if (svg.style.getPropertyValue("--fixer-icon-shift") !== center) svg.style.setProperty("--fixer-icon-shift", center);
  }

  const vars = { "--fixer-back-shift": featureData.backShift, "--fixer-indent": featureData.indent, "--fixer-close-shift": featureData.closeShift };
  const css = `:root { ${Object.entries(vars).map(([k, v]) => (v === undefined ? "" : `${k}: ${v}px;`)).join(" ")} }`;
  if (sizes.textContent !== css) sizes.textContent = css;
  if (!sizes.isConnected) document.documentElement.append(sizes);
}

new MutationObserver(measureAlignment).observe(document.documentElement, { childList: true, subtree: true });
featureDataReady.then(measureAlignment);
