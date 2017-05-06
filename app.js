const fs = require('fs')
// const mdConvert = require('./modules/md-converter.js')

// MODULES
const trimExtension = require('./modules/trim-extension')

// SETTINGS
// const inputPath = process.argv[2]
const inputPath = './files/targetexport.json'
// const outputPath = process.argv[3]
const jsonData = require(inputPath)
const propStructure = require('./config/propstructure.json')

const logFile = function(err, data) {
    console.log(data)
}

const parseMD = function(data) {
  console.log(data.length)
}
