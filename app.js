const fs = require('fs')
// const mdConvert = require('./modules/md-converter.js')

// MODULES
// const findValues = require('./modules/find-values')
const trimExtension = require('./modules/trim-extension')
const getSetting = require('./modules/get-setting')
const getDescription = require('./modules/get-description')
const getCreateDate = require('./modules/get-create-date')

// const inputPath = process.argv[2]
const inputPath = './files/targetexport.json'
// const outputPath = process.argv[3]
const jsonData = require(inputPath)

let jsonOutput = []

const parseMD = function(data) {
  // Loop through each object in Data
  for (i=0; i<data.length; i++){
    // Get the object
    let obj = data[i]
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
      productgroup : "",
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

    jsonOutput.push(newObj)

  }
  console.log(jsonOutput)
}

parseMD(jsonData)
