const fs = require('fs')
const csvjson = require('csvjson')

let CritErrorCount = 0
let NoDateCount = 0
let NoTagsCount = 0

const writeLog = function(logData) {

  // Convert jsonOutput back to CSV
  const jsonToCsvOptions = {
      headers   : "key",
      delimiter   : ";"
  }
  const csvOutput = csvjson.toCSV(logData, jsonToCsvOptions);

  fs.writeFile("./files/ErrorLog.csv", csvOutput, function (err) {
    if (err) return console.log(err);
    console.log(`
      ========== WARNING ==========
      ${CritErrorCount} Critical Errors
      ${NoDateCount} files with date warnings.
      See Error log for details.
      `);

  })
}

const evalJSON = function(jsonInput) {
  let errObjects = []

  jsonInput.forEach(function(obj) {

    if (obj.Created == "") {
      obj["No Date"] = "!!!DATE MISSING!!!"
      CritErrorCount
    } else if (obj.Created == "2012-01-01") {
      obj["No Date"] = "Set to Default Date: 2012-01-01"
      NoDateCount++
    }

    if (obj.Tags == "") {
      obj["No Tags"] = "!!!No Tags Found!!!"
      CritErrorCount++
      NoTagsCount++
    }
    
    errObjects.push(obj)

  })

  // Reformat errObjects for log
  let errObjectsFormatted = []
  errObjects.forEach(function(errObj){
    let newErrObj = {
      "Asset Name": errObj["Asset Name"],
      "Date": errObj["No Date"],
      "Tags": errObj["No Tags"],
      "Path to Assets": errObj["Path to Assets"]
    }
    errObjectsFormatted.push(newErrObj)
  })

  writeLog(errObjectsFormatted)

}

module.exports = evalJSON
