chrome.runtime.onMessage.addListener((request, _sender, _response) => {
  console.time(request.menuFunction);
  fetchDataElements();
  window[request.menuFunction]();
  console.timeEnd(request.menuFunction);
});

function clearHeatMap() {
  for (var index = 0; index < elements.length; index++) {
    elements[index].parentElement.style = "";
  }
}

function tableHeatMap() {
  var elementsToBeColorized = activeGwtFrame.querySelectorAll(
    `tbody tr [class='data'] [rel]`
  );
  heatMap(elementsToBeColorized);
}

function colHeatMap() {
  for (let col = 0; col <= lastRel.col; col++) {
    var elementsToBeColorized = activeGwtFrame.querySelectorAll(
      `tbody tr [class='data'] [rel^='${col}:']`
    );
    heatMap(elementsToBeColorized);
  }
}

function rowHeatMap() {
  for (let row = 0; row <= lastRel.row; row++) {
    var elementsToBeColorized = activeGwtFrame.querySelectorAll(
      `tbody tr [class='data'] [rel$=':${row}']`
    );
    heatMap(elementsToBeColorized);
  }
}

function heatMap(elementsToBeColorized) {
  var cellValues = extractValues(elementsToBeColorized);
  colorize(elementsToBeColorized, cellValues);
}

// To export colored excel file: https://github.com/SheetJS/sheetjs/issues/1795

// Select all data elements in the pivot (elements with the class "data" containing a "rel" attribute)
function fetchDataElements() {
  activeGwtFrame = document.querySelector(
    'div[style="width: 100%; height: 100%; padding: 0px; margin: 0px; position: relative; left: 0px;"] .gwt-Frame'
  ).contentDocument;

  //var processingContainer = document.querySelector("processing_container");
  //var processingDialog = document.querySelector("processing");

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
function colorize(elements, values) {
  const PALETTE_SIZE = 255;

  var colors = chroma
    .scale(["lightgreen", "yellow", "red"])
    .mode("lab")
    .colors(PALETTE_SIZE);

  var min = values.reduce(minValueIgnoringNull, Number.MAX_VALUE);
  var max = values.reduce(maxValueIgnoringNull, Number.MIN_VALUE);

  for (var index = 0; index < elements.length; index++) {
    var colorIndex = Math.round(normalize(values[index], min, max) * (PALETTE_SIZE - 1));
    elements[
      index
    ].parentElement.style = `background-color: ${colors[colorIndex]} !important`;
  }
}
