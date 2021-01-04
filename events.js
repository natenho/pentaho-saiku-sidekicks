const DEFAULT_MUTATION_OBSERVER_INIT = { childList: true, subtree: true };

//Waits #applicationShell and observe it
var documentObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (
      mutation.addedNodes.length > 0 &&
      mutation.addedNodes[0]?.id === "applicationShell"
    ) {
      applicationShellObserver.observe(
        mutation.addedNodes[0],
        DEFAULT_MUTATION_OBSERVER_INIT
      );

      documentObserver.disconnect();
    }
  });
});

//Waits a report to be created and listen to its load event
var applicationShellObserver = new MutationObserver((mutations) => {
  for (let index = 0; index < mutations.length; index++) {
    const mutation = mutations[index];

    if (mutation.addedNodes[0]?.nodeName !== "DIV") continue;

    refreshActiveReportElements();

    if (!activeReportFrame) continue;

    activeReportFrame.addEventListener(
      "load",
      () => {
        refreshActiveReportElements();
        reportObserver.observe(
          activeReportDocument,
          DEFAULT_MUTATION_OBSERVER_INIT
        );
      },
      true
    );

    break;
  }
});

//Observe report to detect relevant events
var reportObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    //When the pivot table is removed, the report is being reloaded
    if (
      mutation.removedNodes[0]?.nodeName === "TABLE" ||
      mutation.addedNodes[0]?.nodeValue === "Loading datasources...."
    ) {
      notifyReportLoadStarting();
    }

    //When the thead and tbody elements were added to the table, it's done
    if (mutation.addedNodes[0]?.nodeName === "THEAD") {
      notifyReportLoadFinished();
      heatMap(); //TODO Move to a centralized feature runner
    }
  });
});

function notifyReportLoadStarting() {
  chrome.runtime.sendMessage({ type: NOTIFICATION_TYPE_REPORT_LOAD_STARTED });
}

function notifyReportLoadFinished() {
  chrome.runtime.sendMessage({ type: NOTIFICATION_TYPE_REPORT_LOAD_FINISHED });
}

documentObserver.observe(this.document, DEFAULT_MUTATION_OBSERVER_INIT);
