const fs = require('fs')
const csvjson = require('csvjson')

let CritErrorCount = 0
let MinorErrorCount = 0
let MissingMandatory = 0
let YearErrCount = 0
let HiddenFileCount = 0

let NoDateCount = 0
let NoTagsCount = 0

const mandatoryFields = [
  "Asset Name",
  "BrandSubbrand",
  "Path to Assets",
  "Archived",
  "assettype"
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
    let errObjectExists = false
    let CritErrObjectExists = false
    let hasTag = false

    let critErrObject = {
      "Asset Name": obj["Asset Name"],
      "Mandatory Fields Missing": [],
      "year": [],
      "Hidden Files": [],
      "Path to Assets": obj["Path to Assets"]
    }

    let errObject = {
      "Asset Name": obj["Asset Name"],
      "Date": [],
      "Tags": [],
    }

    // Check Mandatory Fields
    mandatoryFields.forEach(function(cat) {
      if (obj[cat] == "" || obj[cat] == undefined) {
        critErrObject["Mandatory Fields Missing"].push(cat)
        CritErrorCount++
        MissingMandatory++
        CritErrObjectExists = true
      }
    })

      // Check for Hidden files
    if (obj["Asset Name"].indexOf(".") == 0) {
      critErrObject["Hidden Files"].push("Hidden File Found!")
      CritErrorCount++
      HiddenFileCount++
      CritErrObjectExists = true
    }

      // Date Formats
    if (obj.year !== undefined && obj.year !== "" && obj.year.match(/^[0-9]+$/) == null) {
      CritErrorCount++
      YearErrCount++
      CritErrObjectExists = true
      critErrObject.year.push("Year set to: " + obj.year)
    }

    // Non-Mandatory Field Checks

    if (obj.Created == "" || obj.Created == undefined) {
      errObject.Date.push("Date Missing")
      MinorErrorCount++
      NoDateCount++
      errObjectExists = true
    }

    // Check for Tags
    tagCats.forEach(function(cat) {
      if (obj[cat] !== "" && obj[cat] !== undefined) {
        hasTag = true
      }
    })

    if (!hasTag) {
      errObject.Tags.push("No Tags Found!")
      MinorErrorCount++
      NoTagsCount++
      errObjectExists = true
    }

    if (errObjectExists) { errObjects.push(errObject) }
    if (CritErrObjectExists) { critErrObjects.push(critErrObject) }

  })

  if (CritErrorCount > 0) {
    console.log(`
      ========== WARNING: CRITICAL ERRORS FOUND ==========
      ${critErrObjects.length} files with ${CritErrorCount} total critical errors found
          ${MissingMandatory} mandatory field(s) missing.
          ${YearErrCount} files with incorrectly formatted year.
          ${HiddenFileCount} hidden files found.

      These can cause major problems.
      Fix files and Re-run script before uploading to Bynder
      See Error log for details.
      `);
  }

  if (MinorErrorCount > 0) {
    console.log(`
      ========== MINOR ERRORS FOUND ==========
      ${errObjects.length} files with ${MinorErrorCount} minor errors found
          ${NoTagsCount} files missing all tags.
          ${NoDateCount} files with date warnings.
      See Error log for details.
      `);
  } else {
    console.log('All good! No errors found.')
  }

  writeLog(errObjects, "_MinorErrorLog")
  writeLog(critErrObjects, "_CriticalErrorLog")

}

module.exports = evalJSON
