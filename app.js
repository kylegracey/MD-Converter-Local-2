const fs = require('fs')
const csvjson = require('csvjson')

// MODULES
// const findValues = require('./modules/find-values')
const trimExtension = require('./modules/trim-extension')
const getSetting = require('./modules/get-setting')
const groupSearch = require('./modules/group-search')
const sortKeywords = require('./modules/sort-keywords')
const getDescription = require('./modules/get-description')
const getCreateDate = require('./modules/get-create-date')

// Evaluate & Debug
const evalJSON = require('./modules/eval-json')
const evalTags = require('./modules/eval-tags')

// const inputPath = process.argv[2]
// const outputPath = process.argv[3]
const inputPath = './files/targetexport.json'
const outputPath = './files/output.csv'

const jsonData = require(inputPath)

let jsonOutput = []
let TagTracker = []

function writeCsvFile(data) {
  // Convert jsonOutput back to CSV
  const jsonToCsvOptions = {
      headers   : "key",
      delimiter   : ";"
  }
  const csvOutput = csvjson.toCSV(data, jsonToCsvOptions);

  // Write CSV to output file
  fs.writeFile(outputPath, csvOutput, function (err) {
    if (err) return console.log(err);
    console.log('Writing to csv/output.csv');
  });

}

const pushTags = function(objTags) {
  objTags.forEach(function(tag) {
    if (TagTracker.indexOf(tag) == -1) {
      TagTracker.push(tag)
    }
  })
}

const writeTxtFile = function(TagString) {
  fs.writeFile('./files/_All-Tags.txt', TagString, function(err) {
    if (err) return console.log(err)
  })
}

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
    console.log(obj.FileName)
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
      productgroup : groupSearch(obj.Keywords),
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
      assetstatus : "",
      market : [],
      platformrights : [],
      jobid : []
    };

    sortKeywords(obj, newObj)
    // Year fallback
    if (newObj.year.length == 0) {
      newObj.year.push(newObj.Created.substring(0,4))
    }

    //Push tags into TagTracker
    // pushTags(newObj.Tags)
    for (let i = 0; i < newObj.Tags.length; i++) {
      TagTracker.push(newObj.Tags[i])
    }

    // Join arrays and push output
    joinArrays(newObj)
    jsonOutput.push(newObj)

  })

  writeCsvFile(jsonOutput)
  evalJSON(jsonOutput)

  // // Write out all tags
  // writeTxtFile(TagTracker.join('\n'))
  evalTags(TagTracker)

}

parseMD(jsonData)
