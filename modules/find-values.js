const trimExtension = require('./trim-extension')

// SETTINGS
const propStructure = require('../config/propstructure.json')

const findValues = function(obj) {
  let outputObj = propStructure
  outputObj["Asset Name"] = trimExtension(obj)
  outputObj["Asset Description"] = findDescription(obj)

  return outputObj
}

module.exports = findValues
