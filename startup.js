chrome.runtime.onInstalled.addListener(function (details) {
  ReloadPentahoTabs();

  if (details.reason === "install") OpenHelpPage();
  if (details.reason === "update") ResetSettings();
});

function ReloadPentahoTabs() {
  chrome.tabs.query({ url: "*://*/pentaho/Home*" }, (tabs) =>
    tabs.forEach((tab) => chrome.tabs.reload(tab.id, { bypassCache: true }))
  );
}

function OpenHelpPage() {
  chrome.tabs.create({ url: chrome.extension.getURL("help.html") });
}

function ResetSettings() {
  chrome.storage.sync.clear();
}
