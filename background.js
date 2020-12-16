chrome.contextMenus.onClicked.addListener(contextMenusOnClickHandler);

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Heat map by Row",
    contexts: ["frame"],
    id: "rowHeatMap",
  });
  chrome.contextMenus.create({
    title: "Heat map by Column",
    contexts: ["frame"],
    id: "colHeatMap",
  });
  chrome.contextMenus.create({
    title: "Heat map on Table",
    contexts: ["frame"],
    id: "tableHeatMap",
  });
  chrome.contextMenus.create({
    title: "Clear heat map",
    contexts: ["frame"],
    id: "clearHeatMap",
  });

  chrome.tabs.query({ url: "*://*/pentaho/Home*" }, function (tabs) {
    tabs.forEach((tab) => {
      chrome.tabs.reload(tab.id, { bypassCache: true });
    });
  });
});

function contextMenusOnClickHandler(info, tab) {
  chrome.tabs.sendMessage(tab.id, { operation: info.menuItemId });
}
