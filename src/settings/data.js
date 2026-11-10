const settings = {
  hideDrawers: true,
  hidePremium: true,
  hideGrokButtons: false,
  selectAll: false,
  fixAlignment: false,
  viewQuotes: true,
  pinRightArea: true,
  solidHeader: false,
};

function apply() {
  for (const [key, on] of Object.entries(settings)) document.documentElement.classList.toggle("fixer-" + key, on);
}

function save(key, on) {
  settings[key] = on;
  apply();
  chrome.storage.local.set({ settings });
}

apply();
chrome.storage.local.get("settings").then((r) => {
  Object.assign(settings, r.settings);
  apply();
});
chrome.storage.onChanged.addListener((changes) => {
  if (!changes.settings) return;
  Object.assign(settings, changes.settings.newValue);
  apply();
});

// this is for things features will need, currently its used for stuff like meaasurments so they apply instantly on load
const featureData = {};
const featureDataReady = chrome.storage.local.get("featureData").then((r) => {
  for (const key in r.featureData) featureData[key] ??= r.featureData[key];
});

function saveFeatureData() {
  featureDataReady.then(() => chrome.storage.local.set({ featureData }));
}
