function saveOptions() {
  var colors = document.getElementById("heatMapColors").value;
  var invert = document.getElementById("heatMapInvert").checked;
  chrome.storage.sync.set(
    {
      heatMapColors: colors,
      heatMapInvert: invert      
    },
    function () {
      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
          chrome.tabs.sendMessage(tabs[i].id, {});
        }
      });
    }
  );
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      heatMapColors: "white,red",
      heatMapInvert: false,
    },
    function (settings) {      
      document.getElementById("heatMapColors").value = settings.heatMapColors;
      document.getElementById("heatMapInvert").checked = settings.heatMapInvert;
    }
  );
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document
  .getElementById("heatMapColors")
  .addEventListener("change", saveOptions);
document.getElementById("heatMapInvert").addEventListener("input", saveOptions);
