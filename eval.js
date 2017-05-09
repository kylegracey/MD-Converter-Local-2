const CsvPath = process.argv[2].toString()

const ConvertToJSON = function(data) {
  let jsonConvertInput = csvjson.toObject(data, CsvToJsonOptions);
  // evalJSON(jsonConvertInput)
  console.log(jsonConvertInput)
}

const CsvToJsonOptions = {
    // headers   : "key",
    delimiter   : ";"
}

if (CsvPath !== undefined) {

  let CsvInput = fs.readFile(CsvPath, (err, data) => {
    if (err) throw err;
    ConvertToJSON(data)
  });

}
