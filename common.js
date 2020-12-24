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

const DEFAULT_HEATMAP_COLOR_RED = "#F8696B";
const DEFAULT_HEATMAP_COLOR_YELLOW = "#FFEB84";
const DEFAULT_HEATMAP_COLOR_YELLOW2 = "#FFEF9C";
const DEFAULT_HEATMAP_COLOR_GREEN = "#63BE7B";
const DEFAULT_HEATMAP_COLOR_WHITE = "#FCFCFF";
const DEFAULT_HEATMAP_COLOR_BLUE = "#5A8AC6";

const DEFAULT_HEATMAP_COLORSCALES = [
  {
    id: "red-yellow-green",
    value: [
      DEFAULT_HEATMAP_COLOR_RED,
      DEFAULT_HEATMAP_COLOR_YELLOW,
      DEFAULT_HEATMAP_COLOR_GREEN
    ],
  },
  {
    id: "green-white-red",
    value: [
      DEFAULT_HEATMAP_COLOR_GREEN,
      DEFAULT_HEATMAP_COLOR_WHITE,
      DEFAULT_HEATMAP_COLOR_RED
    ],
  },
  {
    id: "red-white-blue",
    value: [
      DEFAULT_HEATMAP_COLOR_RED,      
      DEFAULT_HEATMAP_COLOR_WHITE,
      DEFAULT_HEATMAP_COLOR_BLUE
    ],
  },
  {
    id: "white-red",
    value: [DEFAULT_HEATMAP_COLOR_WHITE, DEFAULT_HEATMAP_COLOR_RED],
  },
  {
    id: "white-green",
    value: [DEFAULT_HEATMAP_COLOR_WHITE, DEFAULT_HEATMAP_COLOR_GREEN],
  },
  {
    id: "yellow-green",
    value: [DEFAULT_HEATMAP_COLOR_YELLOW2, DEFAULT_HEATMAP_COLOR_GREEN],
  },
];

const DEFAULT_HEATMAP_COLORS = `${DEFAULT_HEATMAP_COLOR_RED},${DEFAULT_HEATMAP_COLOR_YELLOW},${DEFAULT_HEATMAP_COLOR_GREEN}`;
const DEFAULT_HEATMAP_OPERATION = "rowHeatMap";
