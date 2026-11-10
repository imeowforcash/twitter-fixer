document.addEventListener("fixer-download", (e) => chrome.runtime.sendMessage({ download: JSON.parse(e.detail) }));
