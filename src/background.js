chrome.runtime.onMessage.addListener((message) => {
  if (message.download) chrome.downloads.download(message.download);
});
