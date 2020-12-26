var selectedColorScaleValue;

function loadHeatMapColorScales(selectValue) {
  const COLOR_SCALES_PER_ROW = 6;
  var colorScaleContainer = document.getElementById("heatMapColors");
  colorScaleContainer.innerHTML = "";

  for (let index = 0; index < DEFAULT_HEATMAP_COLORSCALES.length; index++) {
    const colorScale = DEFAULT_HEATMAP_COLORSCALES[index];

    if (index % COLOR_SCALES_PER_ROW == 0) {
      var colorScaleRow = document.createElement("div");
      colorScaleRow.className = "heatmap-colorscales-row";
      colorScaleContainer.appendChild(colorScaleRow);
    }

    const colorScaleElement = document.createElement("a");
    const activeClass =
      colorScale.value.join(",") === selectValue ? " active" : "";

    colorScaleElement.className = "heatmap-colorscales-item" + activeClass;
    colorScaleElement.style.backgroundImage = `url('img/28x28/${colorScale.id}.png')`;
    colorScaleElement.setAttribute("data-colorscale-value", colorScale.value);
    colorScaleElement.addEventListener(
      "click",
      heatMapColorScaleOnClickHandler
    );

    colorScaleRow.appendChild(colorScaleElement);
  }
}

function heatMapColorScaleOnClickHandler(e) {
  const activeColorScale = document.querySelector(
    ".heatmap-colorscales-item.active"
  );
  if (activeColorScale) activeColorScale.className = "heatmap-colorscales-item";

  selectedColorScaleValue = e.target.getAttribute("data-colorscale-value");
  e.target.className = "heatmap-colorscales-item active";

  saveOptions();
}

function openHelp() {
  chrome.tabs.create({ url: chrome.extension.getURL("help.html") });
}

function saveOptions() {
  var colors = selectedColorScaleValue;
  var invert = document.getElementById("heatMapInvert").checked;
  var contrastIndex = document.getElementById("heatMapContrast").value;
  var contrast = HEATMAP_CONTRAST_VALUES[contrastIndex];

  chrome.storage.sync.set(
    {
      heatMapColors: colors,
      heatMapInvert: invert,
      heatMapContrast: contrast,
    },
    refreshHeatMaps
  );

  restoreOptions();
}

function refreshHeatMaps() {
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, {});
    }
  });
}

function restoreOptions() {
  suspendInput();

  chrome.storage.sync.get(DEFAULT_HEATMAP_SETTINGS, (settings) => {
    loadHeatMapColorScales(settings.heatMapColors);

    selectedColorScaleValue = settings.heatMapColors;

    document.getElementById("heatMapInvert").checked = settings.heatMapInvert;
    document.getElementById("heatMapContrast").max =
      HEATMAP_CONTRAST_VALUES.length - 1;
    document.getElementById(
      "heatMapContrast"
    ).value = HEATMAP_CONTRAST_VALUES.indexOf(settings.heatMapContrast);

    resumeInput();
  });
}

function suspendInput() {
  document.getElementById("heatMapInvert").disabled = true;
  document.getElementById("heatMapContrast").disabled = true;

  document
    .querySelectorAll(".heatmap-colorscales-item")
    .forEach((button) =>
      button.removeEventListener("click", heatMapColorScaleOnClickHandler)
    );
}

function resumeInput() {
  document.getElementById("heatMapInvert").disabled = false;
  document.getElementById("heatMapContrast").disabled = false;

  document
    .querySelectorAll(".heatmap-colorscales-item")
    .forEach((button) =>
      button.addEventListener("click", heatMapColorScaleOnClickHandler)
    );
}

function onProcessingMessage(message) {
  if (message.processing === "") return;

  document.getElementById("loader-container").style.display = message.processing
    ? "block"
    : "none";

  if (message.processing) {
    suspendInput();
  } else {
    resumeInput();
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("heatMapInvert").addEventListener("input", saveOptions);
document
  .getElementById("heatMapContrast")
  .addEventListener("change", saveOptions);
document.getElementById("help").addEventListener("click", openHelp);

chrome.runtime.onMessage.addListener((message, _sender, _response) =>
  onProcessingMessage(message)
);
