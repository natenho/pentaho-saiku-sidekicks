const TOP_OFFSET = 106;

function freezeColHeaders() {
  activeGwtFrame = document.querySelector(
    'div[style="width: 100%; height: 100%; padding: 0px; margin: 0px; position: relative; left: 0px;"] .gwt-Frame'
  )?.contentDocument;

  var rowHeaderElements = activeGwtFrame.querySelectorAll(".row_header");

  const TOP_ROWHEADER_OFFSET = 4;

  rowHeaderElements.forEach((rowHeaderElement) => {
    rowHeaderElement.style.position = "sticky";
    rowHeaderElement.style.zIndex = "80";
    rowHeaderElement.style.top = `${
      rowHeaderElement.getBoundingClientRect().top -
      TOP_OFFSET +
      TOP_ROWHEADER_OFFSET
    }px`;
  });

  var firstColumnRel = rowHeaderElements.length;
  var firstColHeaders = activeGwtFrame.querySelectorAll(
    `thead [class='col'] [rel$=':${firstColumnRel}']`
  );

  for (let headerRel = 0; headerRel < firstColHeaders.length; headerRel++) {
    const topStick =
      firstColHeaders[headerRel].getBoundingClientRect().top - TOP_OFFSET;

    var elements = activeGwtFrame.querySelectorAll(
      `thead th[class='col'] [rel^='${headerRel}:']`
    );

    for (let index = 0; index < elements.length; index++) {
      const element = elements[index].parentElement;
      element.style.position = "sticky";
      element.style.zIndex = "80";
      element.style.top = `${topStick}px`;
    }
  }

  //var topLeftCell = activeGwtFrame.querySelector('.all_null');
  //topLeftCell.style.backgroundColor = 'white'; // Avoid row headers leaking under the top left cell
}

function freezeRowHeaders() {
  activeGwtFrame = document.querySelector(
    'div[style="width: 100%; height: 100%; padding: 0px; margin: 0px; position: relative; left: 0px;"] .gwt-Frame'
  )?.contentDocument;

  var rowHeaderElementRect = activeGwtFrame
    .querySelector(".row_header")
    .getBoundingClientRect();

  var topStick =
    rowHeaderElementRect.top + rowHeaderElementRect.height - TOP_OFFSET;

  var elements = activeGwtFrame.querySelectorAll(
    "tbody tr th, .all_null, .row_header"
  );

  elements.forEach((element) => {
    element.style.position = "sticky";
    element.style.zIndex = "90";
    element.style.left = "0px";
    if (element.style.top == "") {
      // Avoid messing up with frozen col headers
      element.style.top = `${topStick}px`;
    }
  });
}
