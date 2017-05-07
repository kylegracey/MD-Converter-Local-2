const fs = require('fs')
const csvjson = require('csvjson')

// MODULES
// const findValues = require('./modules/find-values')
const trimExtension = require('./modules/trim-extension')
const getSetting = require('./modules/get-setting')
const groupSearch = require('./modules/group-search')
const getDescription = require('./modules/get-description')
const getCreateDate = require('./modules/get-create-date')

// const inputPath = process.argv[2]
// const outputPath = process.argv[3]
const inputPath = './files/targetexport.json'
const outputPath = './files/output.csv'

const jsonData = require(inputPath)

let jsonOutput = []

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

const parseMD = function(data) {
  // Loop through each object in Data
  data.forEach(function(obj) {
    // Get the object
    // let obj = data[i]
    let newObj = {
      "Asset Name" : trimExtension(obj),
      "Asset Description" : getDescription(obj),
      BrandSubbrand : getSetting("BrandSubBrand"),
      Created : getCreateDate(obj),
      Copyright : "",
      Tags : "",
      "Path to Assets" : obj.SourceFile,
      Archived : "0",
      "New Filename" : obj.FileName,
      fileextension: "",
      group : getSetting("Group"),
      clientteam : getSetting("Client Team"),
      assettype : "",
      assetsubtype : "",
      year : "",
      campaign : "",
      productgroup : groupSearch(obj.Keywords),
      product : "",
      productsize : "",
      productsubtype : "",
      productgender : "",
      numberofpeople : "",
      person : "",
      teammarks : "",
      gender : "",
      shottype : "",
      sport : "",
      assetstatus : "",
      market : "",
      platformrights : "",
      jobid : ""
    };

    newObj.year = newObj.Created.substring(0,4)

    jsonOutput.push(newObj)

  })
  writeCsvFile(jsonOutput)
}

parseMD(jsonData)
