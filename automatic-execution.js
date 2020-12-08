//http://pentaho-rs.blogspot.com/2014/09/automatic-execution-no-saiku.html

var automaticExecutionButton = document.querySelector(
  "[href='#automatic_execution']"
);

if (automaticExecutionButton) {
  automaticExecutionButton.click();
  console.log("Automatic execution was disabled");
}
