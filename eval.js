const fs = require('fs')
const csvjson = require('csvjson')

const CsvPath = './files/gatorade.csv'
const CsvData = require(CsvPath)

const CsvToJsonOptions = {
    // headers   : "key",
    delimiter   : ";"
}

const ConvertToJSON = function(data) {
  let jsonConvertInput = csvjson.toObject(data, CsvToJsonOptions);
  // evalJSON(jsonConvertInput)
  console.log(jsonConvertInput)
}

ConvertToJSON(CsvData)
