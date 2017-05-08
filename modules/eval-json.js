const fs = require('fs')
const csvjson = require('csvjson')

let CritErrorCount = 0
let MinorErrorCount = 0
let MissingMandatory = 0
let NoDateCount = 0
let ModDateCount = 0
let NoTagsCount = 0

const mandatoryFields = [
  "Asset Name",
  "BrandSubbrand",
  "Path to Assets",
  "Archived"
]

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

    // Check Mandatory Fields

    mandatoryFields.forEach(function(cat) {
      if (obj[cat] == "" || obj[cat] == undefined) {
        obj[cat] = `!!!${cat} MISSING!!!`
        CritErrorCount++
        MissingMandatory++
        critErrObject = true
      }
    })

    // Non-Mandatory Field Checks

    if (obj.Created == "") {
      obj["No Date"] = "Date Missing!"
      MinorErrorCount++
      errObject = true

    } else if (obj.Created == "2012-01-01") {
      obj["No Date"] = "Set to Default Date: 2012-01-01"
      ModDateCount++
      MinorErrorCount++
      errObject = true
    }

    // Check for Tags

    tagCats.forEach(function(cat) {
      if (obj[cat] !== "" && obj[cat] !== undefined) {
        hasTag = true
      }
    })

    if (!hasTag) {
      obj["No Tags"] = "!!!No Tags Found!!!"
      MinorErrorCount++
      errObject = true
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
      "Path to Assets": errObj["Path to Assets"],
      "Asset Name": errObj["Asset Name"],
      "Date": errObj["No Date"],
      "Tags": errObj["No Tags"]
    }
    critErrObjectsFormatted.push(newErrObj)
  })

  if (CritErrorCount > 0) {
    console.log(`
      ========== WARNING: CRITICAL ERRORS FOUND ==========
      ${critErrObjects.length} files with ${CritErrorCount} total critical errors found
        ${MissingMandatory} mandatory field(s) missing.
        ${NoDateCount} files missing a date.

      These can cause major problems.
      Fix files and Re-run script before uploading to Bynder
      See Error log for details.
      `);
  } else if (MinorErrorCount > 0) {
    console.log(`
      ========== MINOR ERRORS FOUND ==========
      ${errObjects.length} files with ${MinorErrorCount} minor errors found
        ${NoTagsCount} files missing all tags.
        ${ModDateCount} files with date warnings.
        See Error log for details.
      `);
  } else {
    console.log('All good! No errors found.')
  }

  writeLog(errObjectsFormatted, "_MinorErrorLog")
  writeLog(critErrObjectsFormatted, "_CriticalErrorLog")

}

module.exports = evalJSON
