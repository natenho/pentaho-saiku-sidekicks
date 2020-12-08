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
});

function contextMenusOnClickHandler(info, tab) {
  chrome.tabs.sendMessage(tab.id, { operation: info.menuItemId });
}
