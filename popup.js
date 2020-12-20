function loadHeatMapColors() {
  var select = document.getElementById("heatMapColors");

  DEFAULT_HEATMAP_PALETTES.forEach((palette) => {
    var option = document.createElement("option");
    option.textContent = palette.id;
    option.value = palette.value.join(",");
    select.appendChild(option);
  });
}

function openHelp() {
  chrome.tabs.create({ url: chrome.extension.getURL("help.html") });
}

function saveOptions() {
  var colors = document.getElementById("heatMapColors").value;
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
      document.getElementById("heatMapColors").value = settings.heatMapColors;
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

loadHeatMapColors();

document.addEventListener("DOMContentLoaded", restoreOptions);
document
  .getElementById("heatMapColors")
  .addEventListener("change", saveOptions);
document.getElementById("heatMapInvert").addEventListener("input", saveOptions);
document
  .getElementById("heatMapSteps")
  .addEventListener("input", updateheatMapStepsValue);
document.getElementById("heatMapSteps").addEventListener("change", saveOptions);
document.getElementById("help").addEventListener("click", openHelp);
