const NOTIFICATION_TYPE_REPORT_LOAD_STARTED = "reportLoadStarted";
const NOTIFICATION_TYPE_REPORT_LOAD_FINISHED = "reportLoadFinished";
const NOTIFICATION_TYPE_SETTING_CHANGED = "settingChanged";
const NOTIFICATION_TYPE_COPY_TABLE = "copyTable";

const MAX_HEATMAP_COLORS = 144;
const DEFAULT_HEATMAP_CONTRAST = 55;

// Just a semi exponential sequence (less colors = higher/perceptual contrast)
const HEATMAP_CONTRAST_VALUES = [
  MAX_HEATMAP_COLORS,
  89,
  DEFAULT_HEATMAP_CONTRAST,
  34,
  21,
  16,
  15,
  10,
  9,
  8,
  7,
  6,
  5,
  4,
  3,
];

const HEATMAP_COLOR_RED = "#F8696B";
const HEATMAP_COLOR_YELLOW = "#FFEB84";
const HEATMAP_COLOR_YELLOW2 = "#FFEF9C";
const HEATMAP_COLOR_GREEN = "#63BE7B";
const HEATMAP_COLOR_WHITE = "#FCFCFF";
const HEATMAP_COLOR_BLUE = "#5A8AC6";

const NUMBER_FORMAT_DO_NOT_CHANGE = "doNotChange";
const NUMBER_FORMAT_COMMA_THOUSANDS_DOT_DECIMAL = "commaThousandsDotDecimal";
const NUMBER_FORMAT_DOT_THOUSANDS_COMMA_DECIMAL = "dotThousandsCommaDecimal";

const HEATMAP_COLORSCALES = [
  {
    id: "red-yellow-green",
    value: [HEATMAP_COLOR_RED, HEATMAP_COLOR_YELLOW, HEATMAP_COLOR_GREEN],
  },
  {
    id: "green-white-red",
    value: [HEATMAP_COLOR_GREEN, HEATMAP_COLOR_WHITE, HEATMAP_COLOR_RED],
  },
  {
    id: "red-white-blue",
    value: [HEATMAP_COLOR_RED, HEATMAP_COLOR_WHITE, HEATMAP_COLOR_BLUE],
  },
  {
    id: "white-red",
    value: [HEATMAP_COLOR_WHITE, HEATMAP_COLOR_RED],
  },
  {
    id: "white-green",
    value: [HEATMAP_COLOR_WHITE, HEATMAP_COLOR_GREEN],
  },
  {
    id: "yellow-green",
    value: [HEATMAP_COLOR_YELLOW2, HEATMAP_COLOR_GREEN],
  },
];

const DEFAULT_HEATMAP_COLORS = `${HEATMAP_COLOR_RED},${HEATMAP_COLOR_YELLOW},${HEATMAP_COLOR_GREEN}`;
const DEFAULT_HEATMAP_OPERATION = "rowHeatMap";

const HEATMAP_GROUPING_ROW = "by-row";
const HEATMAP_GROUPING_COLUMN = "by-column";
const HEATMAP_GROUPING_TABLE = "by-table";
const TABLE_ELEMENT_ID = 'table_123'

const HEATMAP_GROUPINGS = [
  {
    id: HEATMAP_GROUPING_ROW,
    value: HEATMAP_GROUPING_ROW,
  },
  {
    id: HEATMAP_GROUPING_COLUMN,
    value: HEATMAP_GROUPING_COLUMN,
  },
  {
    id: HEATMAP_GROUPING_TABLE,
    value: HEATMAP_GROUPING_TABLE,
  },
];

const DEFAULT_HEATMAP_GROUPING = HEATMAP_GROUPING_ROW;

const DEFAULT_SETTINGS = {
  heatMap: {
    enabled: false,
    colors: DEFAULT_HEATMAP_COLORS,
    invert: false,
    contrast: DEFAULT_HEATMAP_CONTRAST,
    grouping: DEFAULT_HEATMAP_GROUPING,
  },
  formatting: {
    numberFormat: NUMBER_FORMAT_DO_NOT_CHANGE
  }
};

function notifyActiveTab(notificationType) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    tabs.forEach((tab) =>
      chrome.tabs.sendMessage(tab.id, { type: notificationType })
    )
  );
}
