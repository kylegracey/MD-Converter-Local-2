const fs = require('fs')
const csvjson = require('csvjson')

let CritErrorCount = 0
let NoDateCount = 0
let NoTagsCount = 0

const tagCats = [
  "Tags",
  "campaign",
  "productgroup",
  "product",
  "productsize",
  "productsubtype",
  "productgender",
  "numberofpeople",
  "person",
  "teammarks",
  "gender",
  "shottype",
  "sport"
]

const writeLog = function(logData, fname) {

  // Convert jsonOutput back to CSV
  const jsonToCsvOptions = {
      headers   : "key",
      delimiter   : ";"
  }
  const csvOutput = csvjson.toCSV(logData, jsonToCsvOptions);

  fs.writeFile(`./files/${fname}.csv`, csvOutput, function (err) {
    if (err) return console.log(err);
  })
}

const evalJSON = function(jsonInput) {
  let errObjects = []
  let critErrObjects = []

  jsonInput.forEach(function(obj) {
    // console.log(`Checking ${obj["Asset Name"]}`)
    let errObject = false
    let critErrObject = false
    let hasTag = false

    if (obj.Created == "") {
      obj["No Date"] = "!!!DATE MISSING!!!"
      CritErrorCount++
      critErrObject = true
    } else if (obj.Created == "2012-01-01") {
      obj["No Date"] = "Set to Default Date: 2012-01-01"
      NoDateCount++
      errObject = true
    }

    tagCats.forEach(function(cat) {
      if (obj[cat] !== "" && obj[cat] !== undefined) {
        hasTag = true
      }
    })

    if (!hasTag) {
      obj["No Tags"] = "!!!No Tags Found!!!"
      CritErrorCount++
      critErrObject = true
      NoTagsCount++
    }

    if (errObject) { errObjects.push(obj) }
    if (critErrObject) { critErrObjects.push(obj) }

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

  let critErrObjectsFormatted = []
  critErrObjects.forEach(function(errObj){
    let newErrObj = {
      "Asset Name": errObj["Asset Name"],
      "Date": errObj["No Date"],
      "Tags": errObj["No Tags"],
      "Path to Assets": errObj["Path to Assets"]
    }
    critErrObjectsFormatted.push(newErrObj)
  })

  console.log(`
    ========== WARNING ==========
    ${CritErrorCount} Critical Errors
    ${NoTagsCount} files with missing all tags.
    ${NoDateCount} files with date warnings.
    See Error log for details.
    `);

  writeLog(errObjectsFormatted, "_MinorErrorLog")
  writeLog(critErrObjectsFormatted, "_CriticalErrorLog")

}

module.exports = evalJSON
