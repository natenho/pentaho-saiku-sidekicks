chrome.contextMenus.onClicked.addListener(contextMenusOnClickHandler);

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "By Row",
    contexts: ["frame"],
    id: "rowHeatMap",
  });
  chrome.contextMenus.create({
    title: "By Column",
    contexts: ["frame"],
    id: "colHeatMap",
  });
  chrome.contextMenus.create({
    title: "By Table",
    contexts: ["frame"],
    id: "tableHeatMap",
  });
  chrome.contextMenus.create({
    title: "Clear",
    contexts: ["frame"],
    id: "clearHeatMap",
  });
});

function contextMenusOnClickHandler(info, tab) {
  chrome.tabs.sendMessage(tab.id, { operation: info.menuItemId });
}
