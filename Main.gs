// API NDC directory constant
var API_NDC_Directory = "https://api.fda.gov/drug/ndc.json?search=";
// API search fields
var API_Brand = "brand_name:";
var API_Generic = "generic_name:";
var API_AppNum = "application_number:";
var API_Labeler = "labeler_name:";
var API_NDC = "product_ndc:";
// API finished
var API_Finished = "+AND+finished:";
// API limit/skip
var API_Limit = "&limit=";
var API_Skip = "&skip=";

function API_RequestByNDC(searchField) {
  var start = new Date();
  SpreadsheetApp.getActiveSpreadsheet().toast("Do not close out of Google Sheets", "Running openFDA API", 5);
  Logger.log("Running openFDA API");
  
  // Generate API string
  var strAPI = API_NDC_Directory+searchField+API_Finished+"true"+API_Limit+"100";
  
  // Declare spreadsheet variables and insert header
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  var sheetArray = [];
  sheetArray.push(["Brand Name","Package NDC","Strength","Dosage Form","Route","Application Number",
              "Labeler Name","Product NDC","Generic Name","Active Ingredients","Product Type",
              "Marketing Start Date","Listing Expiration Date","Marketing Category",
              "Package Description","Pharm Class"]);
  
  // Declare loop variables
  var total = 0;
  var skip = 0;
  
  // Loop through all results (can only retrieve a maximum of 100 results per request)
  while (skip < total || total == "0.0") {
    // Retrieve data using openFDA API
    try {
      var response = UrlFetchApp.fetch(strAPI+API_Skip+skip);
      //Logger.log(response.getContentText());
    } catch(err) {
      return ui.alert("Error",err.message,ui.ButtonSet.OK);
    }
    var data = JSON.parse(response.getContentText());
    total = data.meta.results.total;
    
    // Loop through JSON results
    for (i = 0; i < data.results.length; i++) {
      
      drugData = data.results[i];
      
      // Concatenate drug name and drug strength
      if (drugData.active_ingredients instanceof Object) {
        var IngrName = drugData.active_ingredients.map(function(a){return a.name}).join("; ");
        var IngrStrength = drugData.active_ingredients.map(function(a){return a.strength}).join(", ");
      } else {
        var IngrName = "N/A";
        var IngrStrength = "N/A";
      }
      // Determine if drug route exists
      if (drugData.route instanceof Object) {
        var Route = drugData.route[0];
      } else {
        var Route = "N/A";
      }
      // Concatenate pharm class
      if (drugData.pharm_class instanceof Object) {
        var PharmClass = drugData.pharm_class.map(function(a){return a}).join(", ");
      } else {
        var PharmClass= "N/A";
      }
      // Push data to sheetArray by packaging
      for(var j in drugData.packaging) {
        sheetArray.push([
          drugData.brand_name,
          drugData.packaging[j].package_ndc,
          IngrStrength,
          drugData.dosage_form,
          Route,
          drugData.application_number,
          drugData.labeler_name,
          drugData.product_ndc,
          drugData.generic_name,
          IngrName,
          drugData.product_type,
          drugData.marketing_start_date,
          drugData.listing_expiration_date,
          drugData.marketing_category,
          drugData.packaging[j].description,
          PharmClass]);
      }
    }
    // Increment while loop
    skip += 100;
  }
  var end = new Date();
  var Runtime = end-start;
  SpreadsheetApp.getActiveSpreadsheet().toast("Posting "+(sheetArray.length-1)+" row(s)", "openFDA API Finished", 5);
  Logger.log("API Runtime: "+Runtime/1000+" seconds");
  Logger.log("Posting "+(sheetArray.length-1)+" row(s)");
  
  // Export to active sheet and format sheet
  // Note: Some are commented out due to speed reduction issues
  start = new Date();
  ss.clear();
  ss.getRange(1,1,sheetArray.length,sheetArray[0].length).setValues(sheetArray);
  ss.setFrozenRows(1);
  //ss.getRange(1,1,1,sheetArray[0].length).setFontWeight("bold");
  //ss.autoResizeColumns(1,sheetArray[0].length);
  end = new Date();
  Runtime = end-start;
  SpreadsheetApp.getActiveSpreadsheet().toast("Posted "+(ss.getLastRow()-1)+" row(s)", "Finished", 10);
  Logger.log("Posting Runtime: "+Runtime/1000+" seconds");
  Logger.log("Posted: "+(ss.getLastRow()-1)+" row(s)");
}
