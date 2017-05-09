const fs = require('fs')
const csvjson = require('csvjson')

// MODULES
const trimExtension = require('./modules/trim-extension')
const getSetting = require('./modules/get-setting')
const groupSearch = require('./modules/group-search')
const sortKeywords = require('./modules/sort-keywords')
const getDescription = require('./modules/get-description')
const getCreateDate = require('./modules/get-create-date')
const writeCsvFile = require('./modules/write-csv')

// Evaluate & Debug
const evalJSON = require('./modules/eval-json')
const evalTags = require('./modules/eval-tags')

// Input and Output Options
// const inputPath = process.argv[2]
// const outputPath = process.argv[3]
const inputPath = './files/gatorade-5-9v2.json'
const outputPath = './files/gatorade.csv'
const jsonData = require(inputPath)

// Brand Settings
const brandfile = require('./config/brandfile')
const brandID = brandfile.VML

// Output Variables
let jsonOutput = []
let TagTracker = []

// function writeCsvFile(data) {
//   // Convert jsonOutput back to CSV
//   const jsonToCsvOptions = {
//       headers   : "key",
//       delimiter   : ";"
//   }
//   const csvOutput = csvjson.toCSV(data, jsonToCsvOptions);
//
//   // Write CSV to output file
//   fs.writeFile(outputPath, csvOutput, function (err) {
//     if (err) return console.log(err);
//     console.log('Writing to csv/output.csv');
//   });
//
// }

const joinArrays = function(obj) {
  //Find all arrays in new object and join them into a string for csv output
  for (var key in obj) {
      if (obj.hasOwnProperty(key) && Array.isArray(obj[key])) {
         obj[key] = obj[key].join(',');
      }
  }
}

const parseMD = function(data) {
  // Loop through each object in Data
  data.forEach(function(obj) {
    // Get the object
    // let obj = data[i]
    // console.log(obj.FileName)
    let newObj = {
      "Asset Name" : trimExtension(obj),
      "Asset Description" : getDescription(obj),
      BrandSubbrand : getSetting("BrandSubBrand"),
      Created : getCreateDate(obj),
      Copyright : "",
      Tags : [],
      "Path to Assets" : obj.SourceFile,
      Archived : "0",
      "New Filename" : obj.FileName,
      fileextension: "",
      group : getSetting("Group"),
      clientteam : getSetting("Client Team"),
      assettype : [],
      assetsubtype : [],
      year : [],
      campaign : [],
      productgroup : [],
      product : [],
      productsize : [],
      productsubtype : [],
      productgender : [],
      numberofpeople : [],
      person : [],
      teammarks : [],
      gender : [],
      shottype : [],
      sport : [],
      assetstatus : [],
      market : [],
      platformrights : [],
      jobid : [],
    };

    sortKeywords(obj, newObj)
    groupSearch(newObj)
    // Year fallback
    if (newObj.Created !== undefined && newObj.year.length == 0) {
      newObj.year.push(newObj.Created.substring(0,4))
    }

    //Push tags into TagTracker
    for (let i = 0; i < newObj.Tags.length; i++) {
      TagTracker.push(newObj.Tags[i])
    }

    // Join arrays and push output
    joinArrays(newObj)
    jsonOutput.push(newObj)

  })

  writeCsvFile(jsonOutput, outputPath)
  evalJSON(jsonOutput)
  evalTags(TagTracker)

}

parseMD(jsonData)
