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
    colorScaleElement.style.backgroundImage = `url('img/${colorScale.id}.png')`;
    colorScaleElement.setAttribute("data-colorscale-value", colorScale.value);
    colorScaleElement.addEventListener("click", heatMapColorScaleOnClickHandler);

    colorScaleRow.appendChild(colorScaleElement);
  }
}

function heatMapColorScaleOnClickHandler(e) {
  const activeColorScale = document.querySelector(".heatmap-colorscales-item.active");
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
  var steps = document.getElementById("heatMapSteps").value;

  if (steps > MAX_HEATMAP_STEPS) steps = MAX_HEATMAP_STEPS;

  var colorArray = colors.split(",");
  if (steps < colorArray.length) steps = colorArray.length;

  chrome.storage.sync.set(
    {
      heatMapColors: colors,
      heatMapInvert: invert,
      heatMapSteps: steps,
    },
    function () {
      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
          chrome.tabs.sendMessage(tabs[i].id, {});
        }
      });
    }
  );

  restoreOptions();
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      heatMapColors: DEFAULT_HEATMAP_COLORS,
      heatMapInvert: false,
      heatMapSteps: DEFAULT_HEATMAP_STEPS,
    },
    function (settings) {
      loadHeatMapColorScales(settings.heatMapColors);

      selectedColorScaleValue = settings.heatMapColors;

      document.getElementById("heatMapInvert").checked = settings.heatMapInvert;
      document.getElementById("heatMapSteps").value = settings.heatMapSteps;
      document.getElementById("heatMapStepsValue").innerText =
        settings.heatMapSteps;
    }
  );
}

function updateheatMapStepsValue() {
  document.getElementById(
    "heatMapStepsValue"
  ).innerText = document.getElementById("heatMapSteps").value;
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("heatMapInvert").addEventListener("input", saveOptions);
document
  .getElementById("heatMapSteps")
  .addEventListener("input", updateheatMapStepsValue);
document.getElementById("heatMapSteps").addEventListener("change", saveOptions);
document.getElementById("help").addEventListener("click", openHelp);
