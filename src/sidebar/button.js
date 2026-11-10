function build(more) {
  const btn = more.cloneNode(true);
  btn.removeAttribute("aria-expanded");
  btn.removeAttribute("aria-haspopup");
  btn.setAttribute("aria-label", "Fixer");
  btn.dataset.testid = "fixer-button";
  btn.style.setProperty("--fixer-fg", getComputedStyle(more.querySelector("svg")).color);

  drawIcon(btn.querySelector("svg"), "wrench");

  const label = btn.querySelector("span");
  if (label) label.textContent = "Fixer";

  btn.addEventListener("click", () => toggle(true));
  return btn;
}

const ro = new ResizeObserver(makeSpace);
let box;

// detect if the fixer button makes the sidebar too long and hide the useless premium button to make space for us
function makeSpace() {
  const fixer = box?.querySelector('[data-testid="fixer-button"]');
  if (!fixer) return;
  const root = document.documentElement;
  const c = getComputedStyle(box);
  let used = parseFloat(c.paddingTop) + parseFloat(c.paddingBottom);
  for (const el of box.children) {
    const s = getComputedStyle(el);
    used += el.offsetHeight + parseFloat(s.marginTop) + parseFloat(s.marginBottom);
  }
  if (root.classList.contains("fixer-tight")) used += fixer.offsetHeight;
  root.classList.toggle("fixer-tight", used > box.clientHeight);
}

function sync() {
  const more = document.querySelector('nav[aria-label="Primary"] [data-testid="AppTabBar_More_Menu"]');
  if (!more) return;

  if (!box?.contains(more)) {
    box = more.parentElement;
    while (box && getComputedStyle(box).overflowY !== "auto") box = box.parentElement;
    ro.disconnect();
    if (box) for (const el of [box, ...box.children]) ro.observe(el);
  }

  const old = document.querySelector('[data-testid="fixer-button"]');
  if (old && old.nextElementSibling === more && old.className === more.className) return;
  old?.remove();
  more.before(build(more));
}

new MutationObserver(sync).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
sync();
