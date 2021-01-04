chrome.runtime.onMessage.addListener((request, _sender, _response) => {
  console.log(request, _sender);

  switch (request.type) {
    case NOTIFICATION_TYPE_REPORT_LOAD_FINISHED:
    case NOTIFICATION_TYPE_SETTING_CHANGED:
      heatMap();
      break;
  }
});

function refreshActiveReportElements() {
  activeReportFrame = document.querySelector(
    'div[style="width: 100%; height: 100%; padding: 0px; margin: 0px; position: relative; left: 0px;"] .gwt-Frame'
  );
  activeReportDocument = activeReportFrame?.contentDocument;
}

function heatMap() {
  notifyHeatMapOperationStarting();

  refreshActiveReportElements();

  if (!activeReportDocument) {
    notifyHeatMapOperationFinished();
    return;
  }

  fetchDataElements();

  if (elements.length == 0) {
    notifyHeatMapOperationFinished();
    return;
  }

  prepareHeatMap();
}

function notifyHeatMapOperationStarting() {
  chrome.runtime.sendMessage({ processing: true });
}

// Select all data elements in pivot table
function fetchDataElements() {
  elements = activeReportDocument.querySelectorAll(
    "tbody tr [class='data'] [rel]"
  );

  if (elements.length == 0) return;

  lastRel = getLastRel(elements);
}

// "rel" attribute contains the cell coordinate in pivot in the format "col:row"
function getLastRel(elements) {
  var lastElement = elements[elements.length - 1];
  lastElement.getAttribute("rel");
  var lastElementRel = lastElement.getAttribute("rel").split(":");
  return { col: lastElementRel[0], row: lastElementRel[1] };
}

function prepareHeatMap() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    if (settings.heatMap.enabled) {
      var heatMapColors = settings.heatMap.colors.split(",");
      var colorsCount = settings.heatMap.contrast;

      colorsCount = maxValueIgnoringNull(colorsCount, heatMapColors.length);

      if (settings.heatMap.invert) {
        heatMapColors = heatMapColors.reverse();
      }

      var colors = chroma.scale(heatMapColors).mode("lab").colors(colorsCount);

      switch (settings.heatMap.grouping) {
        case HEATMAP_GROUPING_COLUMN:
          columnHeatMap(colors);
          break;
        case HEATMAP_GROUPING_ROW:
          rowHeatMap(colors);
          break;
        case HEATMAP_GROUPING_TABLE:
          tableHeatMap(colors);
          break;
        default:
          clearHeatMap();
          break;
      }
    } else {
      clearHeatMap();
    }

    notifyHeatMapOperationFinished();
  });
}

function notifyHeatMapOperationFinished() {
  chrome.runtime.sendMessage({ processing: false });
}

function clearHeatMap() {
  for (var index = 0; index < elements.length; index++) {
    elements[index].parentElement.style = "";
  }
}

function tableHeatMap(colors) {
  var elementsToBeColorized = activeReportDocument.querySelectorAll(
    `tbody tr [class='data'] [rel]`
  );
  buildHeatMap(elementsToBeColorized, colors);
}

function columnHeatMap(colors) {
  for (let col = 0; col <= lastRel.col; col++) {
    var elementsToBeColorized = activeReportDocument.querySelectorAll(
      `tbody tr [class='data'] [rel^='${col}:']`
    );
    buildHeatMap(elementsToBeColorized, colors);
  }
}

function rowHeatMap(colors) {
  for (let row = 0; row <= lastRel.row; row++) {
    var elementsToBeColorized = activeReportDocument.querySelectorAll(
      `tbody tr [class='data'] [rel$=':${row}']`
    );
    buildHeatMap(elementsToBeColorized, colors);
  }
}

function buildHeatMap(elementsToBeColorized, colors) {
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
