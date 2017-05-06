const fs = require('fs')
// const mdConvert = require('./modules/md-converter.js')

// MODULES
const findValues = require('./modules/find-values')
const trimExtension = require('./modules/trim-extension')

// const inputPath = process.argv[2]
const inputPath = './files/targetexport.json'
// const outputPath = process.argv[3]
const jsonData = require(inputPath)

let outputJSON = []

const parseMD = function(data) {
  // Loop through each object in Data
  for (i=0; i<2; i++){
    // Get the object
    let obj = data[i]
    let newObj = {
      "Asset Name" : trimExtension(obj),
      "Asset Description" : obj.Description,
      BrandSubbrand : getSetting("BrandSubBrand"),
      Created : formatDate(obj),
      Copyright : "",
      "Tags" : "",
      "Path to Assets" : obj.SourceFile,
      Archived : "0",
      "New Filename" : obj.FileName,
      fileextension: "",
      group : getSetting("Group"),
      clientteam : getSetting("Client Team"),
      assettype : "",
      assetsubtype : "",
      year : obj.CreateDate.substring(0,4),
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

    // console.log('obj name is now ' + obj["SourceFile"])
    // let newObj = findValues(obj)
    // console.log('newObj is now ' + newObj["Asset Name"])
    // console.log("Pushing " + bObj + 'into outputJSON')
    outputJSON.push(newObj)
    // console.log('Pushed newObj into outputJSON')
  }
  console.log(outputJSON)
}

parseMD(jsonData)
