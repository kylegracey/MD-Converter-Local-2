const trimExtension = require('./trim-extension')

// SETTINGS
const propStructure = require('../config/propstructure.json')

const findDescription = function (obj) {
  if (obj.Description) {
    return obj.Description
  } else {
    return ""
  }
}

const findValues = function(obj) {
  let outputObj = propStructure
  outputObj["Asset Name"] = trimExtension(obj)
  outputObj["Asset Description"] = findDescription(obj)

  return outputObj
}

module.exports = findValues
