const CONTEXT_MENU_HEATMAP_ROW = "heatmap-row";
const CONTEXT_MENU_HEATMAP_COLUMN = "heatmap-column";
const CONTEXT_MENU_HEATMAP_TABLE = "heatmap-table";
const CONTEXT_MENU_HEATMAP_CLEAR = "heatmap-clear";
const CONTEXT_MENU_COPY_TABLE = "copy-table";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Heat map by Row",
    contexts: ["frame"],
    id: CONTEXT_MENU_HEATMAP_ROW,
  });

  chrome.contextMenus.create({
    title: "Heat map by Column",
    contexts: ["frame"],
    id: CONTEXT_MENU_HEATMAP_COLUMN,
  });

  chrome.contextMenus.create({
    title: "Heat map on Table",
    contexts: ["frame"],
    id: CONTEXT_MENU_HEATMAP_TABLE,
  });

  chrome.contextMenus.create({
    title: "Clear heat map",
    contexts: ["frame"],
    id: CONTEXT_MENU_HEATMAP_CLEAR,
  });

  chrome.contextMenus.create({
    title: "Copy Table",
    contexts: ["frame"],
    id: CONTEXT_MENU_COPY_TABLE,
  });
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    
    if(info.menuItemId === CONTEXT_MENU_COPY_TABLE) {
      notifyActiveTab(NOTIFICATION_TYPE_COPY_TABLE);
    }
    else {
      settings.heatMap.enabled = true;

      switch (info.menuItemId) {
        case CONTEXT_MENU_HEATMAP_ROW:
          settings.heatMap.grouping = HEATMAP_GROUPING_ROW;
          break;
        case CONTEXT_MENU_HEATMAP_COLUMN:
          settings.heatMap.grouping = HEATMAP_GROUPING_COLUMN;
          break;
        case CONTEXT_MENU_HEATMAP_TABLE:
          settings.heatMap.grouping = HEATMAP_GROUPING_TABLE;
          break;
        case CONTEXT_MENU_HEATMAP_CLEAR:
          settings.heatMap.enabled = false;
          break;
      }
      chrome.storage.sync.set(settings, () => notifyActiveTab(MESSAGE_HEATMAP_SETTING_CHANGED));
    }
  });
});
