var lastOperation = DEFAULT_HEATMAP_OPERATION;

chrome.runtime.onMessage.addListener((request, _sender, _response) => {
  execute(request.operation);
});

function getActiveGwtFrame() {
  return document.querySelector(
    'div[style="width: 100%; height: 100%; padding: 0px; margin: 0px; position: relative; left: 0px;"] .gwt-Frame'
  )?.contentDocument;
}

function execute(operation) {
  if (!lastOperation) {
    lastOperation = DEFAULT_HEATMAP_OPERATION;
  }

  if (!operation) {
    operation = lastOperation;
  }

  showProcessing();

  activeGwtFrame = getActiveGwtFrame();

  if (!activeGwtFrame) {
    hideProcessing();
    return;
  }

  fetchDataElements();
  executeHeatMapOperation(operation);

  lastOperation = operation;
}

function showProcessing() {
  chrome.runtime.sendMessage({ processing: true });
}

// Select all data elements in pivot table
function fetchDataElements() {
  elements = activeGwtFrame.querySelectorAll("tbody tr [class='data'] [rel]");
  lastRel = getLastRel(elements);
}

// "rel" attribute contains the cell coordinate in pivot in the format "col:row"
function getLastRel(elements) {
  var lastElement = elements[elements.length - 1];
  lastElement.getAttribute("rel");
  var lastElementRel = lastElement.getAttribute("rel").split(":");
  return { col: lastElementRel[0], row: lastElementRel[1] };
}

function executeHeatMapOperation(operation) {
  chrome.storage.sync.get(DEFAULT_HEATMAP_SETTINGS, (settings) => {
    var heatMapColors = settings.heatMapColors.split(",");
    var colorsCount = settings.heatMapContrast;

    colorsCount = maxValueIgnoringNull(colorsCount, heatMapColors.length);

    if (settings.heatMapInvert) {
      heatMapColors = heatMapColors.reverse();
    }

    var colors = chroma.scale(heatMapColors).mode("lab").colors(colorsCount);

    window[operation](colors);

    hideProcessing();
  });
}

function hideProcessing() {
  chrome.runtime.sendMessage({ processing: false });
}

function clearHeatMap() {
  for (var index = 0; index < elements.length; index++) {
    elements[index].parentElement.style = "";
  }
}

function tableHeatMap(colors) {
  var elementsToBeColorized = activeGwtFrame.querySelectorAll(
    `tbody tr [class='data'] [rel]`
  );
  heatMap(elementsToBeColorized, colors);
}

function colHeatMap(colors) {
  for (let col = 0; col <= lastRel.col; col++) {
    var elementsToBeColorized = activeGwtFrame.querySelectorAll(
      `tbody tr [class='data'] [rel^='${col}:']`
    );
    heatMap(elementsToBeColorized, colors);
  }
}

function rowHeatMap(colors) {
  for (let row = 0; row <= lastRel.row; row++) {
    var elementsToBeColorized = activeGwtFrame.querySelectorAll(
      `tbody tr [class='data'] [rel$=':${row}']`
    );
    heatMap(elementsToBeColorized, colors);
  }
}

function heatMap(elementsToBeColorized, colors) {
  var cellValues = extractValues(elementsToBeColorized);
  colorize(elementsToBeColorized, colors, cellValues);
}

// Generate an array of the values contained in the "alt" attribute of the elements
function extractValues(elements) {
  var cellValues = new Array(length);

  for (var index = 0; index < elements.length; index++) {
    var unformattedCellValue = parseFloat(elements[index].getAttribute("alt"));
    cellValues[index] = unformattedCellValue;
  }

  return cellValues;
}

var normalize = (v, min, max) => (v - min) / (max - min);
var minValueIgnoringNull = (a, b) => (isNaN(b) || b > a ? a : b);
var maxValueIgnoringNull = (a, b) => (isNaN(b) || b < a ? a : b);

// Change the element style based on the relative index in the pallette
function colorize(elements, colors, values) {
  var min = values.reduce(minValueIgnoringNull, Number.MAX_VALUE);
  var max = values.reduce(maxValueIgnoringNull, Number.MIN_VALUE);

  for (var index = 0; index < elements.length; index++) {
    var colorIndex = Math.round(
      normalize(values[index], min, max) * (colors.length - 1)
    );
    elements[
      index
    ].parentElement.style = `background-color: ${colors[colorIndex]}`;
  }
}
