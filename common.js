// TODO: Export colored excel file: https://github.com/SheetJS/sheetjs/issues/1795
const DEFAULT_HEATMAP_STEPS = 256;
const MAX_HEATMAP_STEPS = 256;

const DEFAULT_HEATMAP_COLOR_RED = "#F8696B";
const DEFAULT_HEATMAP_COLOR_YELLOW = "#FFEB84";
const DEFAULT_HEATMAP_COLOR_YELLOW2 = "#FFEF9C";
const DEFAULT_HEATMAP_COLOR_GREEN = "#63BE7B";
const DEFAULT_HEATMAP_COLOR_WHITE = "#FCFCFF";
const DEFAULT_HEATMAP_COLOR_BLUE = "#5A8AC6";

const DEFAULT_HEATMAP_PALETTES = [
  {
    id: "white-red",
    value: [DEFAULT_HEATMAP_COLOR_WHITE, DEFAULT_HEATMAP_COLOR_RED],
  },
  {
    id: "red-white",
    value: [DEFAULT_HEATMAP_COLOR_RED, DEFAULT_HEATMAP_COLOR_WHITE],
  },
  {
    id: "red-yellow-green",
    value: [
      DEFAULT_HEATMAP_COLOR_RED,
      DEFAULT_HEATMAP_COLOR_YELLOW,
      DEFAULT_HEATMAP_COLOR_GREEN,
    ],
  },
  {
    id: "green-yellow-red",
    value: [
      DEFAULT_HEATMAP_COLOR_GREEN,
      DEFAULT_HEATMAP_COLOR_YELLOW,
      DEFAULT_HEATMAP_COLOR_RED,
    ],
  },
  {
    id: "blue-white-red",
    value: [
      DEFAULT_HEATMAP_COLOR_BLUE,
      DEFAULT_HEATMAP_COLOR_WHITE,
      DEFAULT_HEATMAP_COLOR_RED,
    ],
  },
  {
    id: "red-white-blue",
    value: [
      DEFAULT_HEATMAP_COLOR_RED,
      DEFAULT_HEATMAP_COLOR_WHITE,
      DEFAULT_HEATMAP_COLOR_BLUE,
    ],
  },
  {
    id: "white-green",
    value: [DEFAULT_HEATMAP_COLOR_WHITE, DEFAULT_HEATMAP_COLOR_GREEN],
  },
  {
    id: "green-white",
    value: [DEFAULT_HEATMAP_COLOR_GREEN, DEFAULT_HEATMAP_COLOR_WHITE],
  },
  {
    id: "yellow-green",
    value: [DEFAULT_HEATMAP_COLOR_YELLOW2, DEFAULT_HEATMAP_COLOR_GREEN],
  },
  {
    id: "green-yellow",
    value: [DEFAULT_HEATMAP_COLOR_GREEN, DEFAULT_HEATMAP_COLOR_YELLOW2],
  },
];

const DEFAULT_HEATMAP_COLORS = `${DEFAULT_HEATMAP_COLOR_GREEN},${DEFAULT_HEATMAP_COLOR_YELLOW},${DEFAULT_HEATMAP_COLOR_RED}`;
const DEFAULT_HEATMAP_OPERATION = "rowHeatMap";
