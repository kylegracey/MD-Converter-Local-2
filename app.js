const mdConvert = require('./modules/md-converter.js')

const inputPath = process.argv[2]
const outputPath = process.argv[3]

let logFile = function(data) {
    console.log(data)
}

jsonData = mdConvert(inputPath)
