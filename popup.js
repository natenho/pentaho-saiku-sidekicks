const loaderContainer = document.getElementById("loaderContainer");

const heatMapEnabled = document.getElementById("heatMapEnabled");
const heatMapGrouping = document.getElementById("heatMapGrouping");
const heatMapColorScale = document.getElementById("heatMapColors");
const heatMapInvert = document.getElementById("heatMapInvert");
const heatMapContrast = document.getElementById("heatMapContrast");
const formattingEnabledToggle = document.getElementById("formattingEnabled");
const forceNumberFormat = document.getElementById("forceNumberFormat");
const formatDecimalPlaces = document.getElementById("formatDecimalPlaces");

function loadToolbar(
  toolbarId,
  buttonClassName,
  toolbarItems,
  selectedItemValue
) {
  const toolbar = document.getElementById(toolbarId);
  toolbar.innerHTML = "";

  for (let index = 0; index < toolbarItems.length; index++) {
    const item = toolbarItems[index];
    const button = document.createElement("a");
    const activeClass =
      (Array.isArray(item.value) ? item.value.join(",") : item.value) ===
      selectedItemValue
        ? " active"
        : "";

    button.className = `${buttonClassName} toolbar-button` + activeClass;
    button.style.backgroundImage = `url('img/28x28/${buttonClassName}-${item.id}.png')`;
    button.setAttribute("title", item.id);
    button.setAttribute("data-value", item.value);
    button.addEventListener("click", toolbarClickHandler);

    toolbar.appendChild(button);
  }
}

function toolbarClickHandler(e) {
  const activeButton = e.target.parentElement.querySelector(".active");
  if (activeButton) activeButton.classList.remove("active");

  const selectedValue = e.target.getAttribute("data-value");
  e.target.parentElement.setAttribute("data-value", selectedValue);
  e.target.classList.add("active");

  saveOptions();
}

function saveOptions() {
  var enabled = heatMapEnabled.checked;
  var grouping = heatMapGrouping.getAttribute("data-value");
  var colors = heatMapColorScale.getAttribute("data-value");
  var invert = heatMapInvert.checked;
  var contrastIndex = heatMapContrast.value;
  var contrast = HEATMAP_CONTRAST_VALUES[contrastIndex];

  var formattingEnabled = formattingEnabledToggle.checked;
  var numberFormat = forceNumberFormat.value;
  var decimalPlaces = formatDecimalPlaces.value;

  chrome.storage.sync.set(
    {
      heatMap: {
        enabled: enabled,
        colors: colors,
        invert: invert,
        contrast: contrast,
        grouping: grouping,
      },
      formatting: {
        enabled: formattingEnabled,
        numberFormat: numberFormat,
        decimalPlaces: decimalPlaces
      },
    },
    () => notifyActiveTab(NOTIFICATION_TYPE_SETTING_CHANGED)
  );
}

function restoreOptions() {
  heatMapEnabled.disabled = true;
  disableHeatMapInput();

  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    loadToolbar(
      "heatMapGrouping",
      "heatmap-grouping",
      HEATMAP_GROUPINGS,
      settings.heatMap.grouping
    );

    loadToolbar(
      "heatMapColors",
      "heatmap-colorscale",
      HEATMAP_COLORSCALES,
      settings.heatMap.colors
    );

    heatMapEnabled.checked = settings.heatMap.enabled;
    heatMapGrouping.setAttribute("data-value", settings.heatMap.grouping);
    heatMapColorScale.setAttribute("data-value", settings.heatMap.colors);
    heatMapInvert.checked = settings.heatMap.invert;
    heatMapContrast.max = HEATMAP_CONTRAST_VALUES.length - 1;
    heatMapContrast.value = HEATMAP_CONTRAST_VALUES.indexOf(
      settings.heatMap.contrast
    );

    formattingEnabledToggle.checked = settings.formatting.enabled;
    forceNumberFormat.value = settings.formatting.numberFormat;
    formatDecimalPlaces.value = settings.formatting.decimalPlaces;

    if (settings.heatMap.enabled) {
      enableHeatMapInput();
    } else {
      disableHeatMapInput();
    }

    if (settings.formatting.enabled) {
      disableFormattingInput();
    } else {
      enableFormattingInput();
    }

    heatMapEnabled.disabled = false;
    formattingEnabledToggle.disabled = false;
  });
}

function disableHeatMapInput() {
  heatMapInvert.disabled = true;
  heatMapContrast.disabled = true;
  document.querySelector(".heatmap-invert.slider").classList.add("disabled");
  document.querySelectorAll(".toolbar-button").forEach((button) => {
    button.classList.add("disabled");
    button.removeEventListener("click", toolbarClickHandler);
  });
}

function disableFormattingInput() {
  forceNumberFormat.disabled = false;
  formatDecimalPlaces.disabled = false;
}

function enableHeatMapInput() {
  heatMapInvert.disabled = false;
  heatMapContrast.disabled = false;
  forceNumberFormat.disabled = false;
  document.querySelector(".heatmap-invert.slider").classList.remove("disabled");
  document.querySelectorAll(".toolbar-button").forEach((button) => {
    button.classList.remove("disabled");
    button.addEventListener("click", toolbarClickHandler);
  });
}

function enableFormattingInput() {
  forceNumberFormat.disabled = true;
  formatDecimalPlaces.disabled = true;
}

function openHelp() {
  chrome.tabs.create({ url: chrome.extension.getURL("help.html") });
}

function onProcessingMessage(messsage) {
  if (messsage.processing === "") return;

  loaderContainer.style.display = messsage.processing ? "block" : "none";

  if (messsage.processing) {
    disableHeatMapInput();
    disableFormattingInput()
  } else {
    restoreOptions();
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);

heatMapEnabled.addEventListener("input", saveOptions);
heatMapInvert.addEventListener("input", saveOptions);
heatMapContrast.addEventListener("change", saveOptions);

formattingEnabledToggle.addEventListener("change", saveOptions);
forceNumberFormat.addEventListener("change", saveOptions);
formatDecimalPlaces.addEventListener("change", saveOptions);

document.getElementById("help").addEventListener("click", openHelp);

chrome.runtime.onMessage.addListener((message, _sender, _response) =>
  onProcessingMessage(message)
);
