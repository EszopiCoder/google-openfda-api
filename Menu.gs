function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('openFDA')
    .addSubMenu(ui.createMenu("Run API")
      .addItem("By Brand Name", "runBrand")
      .addItem("By Generic Name", "runGeneric")
      .addItem("By Application Number", "runAppNum")
      .addItem("By Manufacturer", "runLabeler")
      .addItem("By Product NDC", "runNDC")
     )
    .addItem("Clear active sheet", "clearActiveSheet")
  .addToUi();
}

function runBrand() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt("Run API by Brand Name","Enter the brand name of a drug.\nNote: Does not support partial spelling of drug names.",ui.ButtonSet.OK);
  if (response.getSelectedButton() == ui.Button.OK) {
    Logger.log("Response: "+response.getResponseText());
    API_RequestByNDC(API_Brand+response.getResponseText());
  }
}

function runGeneric() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt("Run API by Generic Name","Enter the generic name of a drug.\nNote: Does not support partial spelling of drug names.",ui.ButtonSet.OK);
  if (response.getSelectedButton() == ui.Button.OK) {
    Logger.log("Response: "+response.getResponseText());
    API_RequestByNDC(API_Generic+response.getResponseText());
  }
}

function runAppNum() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt("Run API by Application Number","Enter the application number of a drug.",ui.ButtonSet.OK);
  if (response.getSelectedButton() == ui.Button.OK) {
    Logger.log("Response: "+response.getResponseText());
    API_RequestByNDC(API_AppNum+response.getResponseText());
  }
}

function runLabeler() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt("Run API by Manufacturer","Enter the manufacturer of a drug.\nNote: Does not support partial spelling of manufacturers.",ui.ButtonSet.OK);
  if (response.getSelectedButton() == ui.Button.OK) {
    Logger.log("Response: "+response.getResponseText());
    API_RequestByNDC(API_Labeler+response.getResponseText());
  }
}

function runNDC() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt("Run API by Product NDC","Enter the product NDC of a drug.\nNote: Do not include 2 digit package code.",ui.ButtonSet.OK);
  if (response.getSelectedButton() == ui.Button.OK) {
    Logger.log("Response: "+response.getResponseText());
    API_RequestByNDC(API_NDC+response.getResponseText());
  }
}

function clearActiveSheet() {
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().clear(); 
}
