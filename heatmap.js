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
  for (let index = 0; index <= elements.length; index++) {
    var elementsToBeColorized = activeGwtFrame.querySelectorAll(
      `tbody tr [class='data'] [rel]`
    );
    var cellValues = extractValues(elementsToBeColorized);
    var palette = buildPalette(cellValues);
    colorize(elementsToBeColorized, cellValues, palette);
  }
}

function colHeatMap() {  
  for (let col = 0; col <= lastRel.col; col++) {
    var elementsToBeColorized = activeGwtFrame.querySelectorAll(
      `tbody tr [class='data'] [rel^='${col}:']`
    );
    var cellValues = extractValues(elementsToBeColorized);
    var palette = buildPalette(cellValues);
    colorize(elementsToBeColorized, cellValues, palette);
  }
}

function rowHeatMap() {  
  for (let row = 0; row <= lastRel.row; row++) {
    var elementsToBeColorized = activeGwtFrame.querySelectorAll(
      `tbody tr [class='data'] [rel$=':${row}']`
    );
    var cellValues = extractValues(elementsToBeColorized);
    var palette = buildPalette(cellValues);
    colorize(elementsToBeColorized, cellValues, palette);
  }
}

// To export colored excel file: https://github.com/SheetJS/sheetjs/issues/1795

function fetchDataElements() {
  activeGwtFrame = document.querySelector(
    'div[style="width: 100%; height: 100%; padding: 0px; margin: 0px; position: relative; left: 0px;"] .gwt-Frame'
  ).contentDocument;

  //var processingContainer = document.querySelector("processing_container");
  //var processingDialog = document.querySelector("processing");

  elements = activeGwtFrame.querySelectorAll("tbody tr [class='data'] [rel]");
  lastRel = getLastRel(elements);
}

function getLastRel(elements) {
  var lastElement = elements[elements.length - 1];
  lastElement.getAttribute("rel");
  var lastElementRel = lastElement.getAttribute("rel").split(":");
  return { col: lastElementRel[0], row: lastElementRel[1] };
}

function extractValues(elements) {
  var cellValues = new Array(length);

  for (var index = 0; index < elements.length; index++) {
    var unformattedCellValue = parseFloat(elements[index].getAttribute("alt"));
    cellValues[index] = unformattedCellValue;
  }

  return cellValues;
}

var minValue = (a, b) => (isNaN(b) || b > a ? a : b);
var maxValue = (a, b) => (isNaN(b) || b < a ? a : b);
var nearestValue = (arr, val) =>
  arr.reduce(
    (p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p),
    Infinity
  ) + val;

function colorize(elements, cellValues, palette) {
  for (var index = 0; index < elements.length; index++) {
    var near = nearestValue(palette, cellValues[index]);

    var colorIndex = 255 - palette.indexOf(near);

    elements[
      index
    ].parentElement.style = `background-color: rgb(255, ${colorIndex}, ${colorIndex}) !important`;
  }
}

function buildPalette(values) {
  var min = values.reduce(minValue, Number.MAX_VALUE);
  var max = values.reduce(maxValue, Number.MIN_VALUE);

  var difference = max - min;
  var bucketSize = Math.round(difference / 255);

  var palette = new Array(255);

  var index = 0,
    length = palette.length;

  for (; index < length; index++) {
    palette[index] = min + (index + 1) * bucketSize;
  }

  return palette;
}