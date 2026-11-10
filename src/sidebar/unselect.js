{
  const props = (el) => el[Object.keys(el).find((k) => k.startsWith("__reactProps$"))];

  function outline(a) {
    let f = a[Object.keys(a).find((k) => k.startsWith("__reactFiber$"))];
    while (f && !f.memoizedProps?.renderIcon) f = f.return;
    const icon = f?.memoizedProps.renderIcon(false)?.type;
    return typeof icon === "function" ? [...icon.toString().matchAll(/\bd:"([^"]+)"/g)].map((m) => m[1]) : [];
  }

  const swapped = new Set();

  // each sidebar buttons icons path has "d" which seem to be just instructions on how to draw lines so just replacing d works
  // im not sure how reliable this is, i dont think they would change this a lot but if they do then the instructions have to be found some other way
  function swap() {
    if (!document.documentElement.classList.contains("fixer-open")) {
      for (const p of swapped) if (p.isConnected) p.setAttribute("d", props(p).d);
      swapped.clear();
      return;
    }

    for (const a of document.querySelectorAll('nav[aria-label="Primary"] > a')) {
      const paths = a.querySelectorAll("svg path");
      const ds = outline(a);
      if (ds.length !== paths.length) continue;
      paths.forEach((p, i) => {
        if (p.getAttribute("d") === ds[i]) return;
        p.setAttribute("d", ds[i]);
        swapped.add(p);
      });
    }
  }

  new MutationObserver(swap).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
}
