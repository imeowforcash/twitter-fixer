const page = document.createElement("div");
page.id = "fixer-page";
page.innerHTML = '<div class="fixer-header"><h2>Fixer</h2></div><div class="fixer-section"></div>';

const options = [
  { key: "hideDrawers", label: "Hide Grok and Chat buttons on the bottom right" },
  { key: "hidePremium", label: "Remove ADs for Premium" },
  { key: "hideGrokButtons", label: "Remove Grok buttons" },
  { key: "selectAll", label: "Show All instead of Posts on profiles" },
  { key: "fixAlignment", label: "Fix alignment" },
  { key: "viewQuotes", label: "Show View quotes in the repost menu" },
  { key: "pinRightArea", label: "Stop the right area from scrolling with the timeline" },
  { key: "solidHeader", label: "Remove blur from the header" },
  { key: "defaultMenu", label: "Use default context menu for post media" },
  { key: "downloadVideos", label: "Add a download button to video's miniplayer" },
  { key: "blockButton", label: "Add a block button to posts" },
];

for (const { key, label } of options) {
  const row = document.createElement("label");
  row.className = "fixer-row";
  row.innerHTML =
    '<span></span><span class="fixer-check"><input type="checkbox"><span class="fixer-box"><svg viewBox="0 0 24 24"><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"/></svg></span></span>';
  row.firstChild.textContent = label;
  const box = row.querySelector("input");
  box.dataset.key = key;
  box.addEventListener("change", () => save(key, box.checked));
  page.lastChild.append(row);
}

let open = false;
let url;
let scroll = 0;

function toggle(on) {
  if (on === open) return;
  if (on && !page.isConnected) return;
  open = on;
  if (on) {
    url = location.href;
    scroll = scrollY;
    page.style.setProperty("--fixer-fg", getComputedStyle(document.querySelector('nav[aria-label="Primary"] svg')).color);
    page.style.setProperty("--fixer-bg", getComputedStyle(document.body).backgroundColor);
    page.style.setProperty("--fixer-line", getComputedStyle(page.parentElement).borderRightColor);

    const search = document.querySelector('[role="search"]');
    if (search) {
      page.style.setProperty("--fixer-accent", getComputedStyle(search.querySelector("input")).caretColor);
      page.style.setProperty("--fixer-dim", getComputedStyle(search.querySelector("svg")).color);
    }

    for (const box of page.querySelectorAll("input[data-key]")) box.checked = settings[box.dataset.key];
  }
  document.documentElement.classList.toggle("fixer-open", on);
  if (on) scrollTo(0, 0);
  else if (location.href === url) scrollTo(0, scroll);
}

document.addEventListener(
  "click",
  (e) => {
    const link = e.target.closest("a[href]");
    if (!open || !link || page.contains(link)) return;
    toggle(false);
    // twitter just scrolls u up if u click on a page ur already on so just hiding the click fixes that
    if (new URL(link.href).pathname === location.pathname && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  },
  true,
);

function mount() {
  if (open && location.href !== url) toggle(false);

  const col = document.querySelector('[data-testid="primaryColumn"]');
  if (col && page.parentElement !== col) col.append(page);
}

new MutationObserver(mount).observe(document.documentElement, { childList: true, subtree: true });
mount();
