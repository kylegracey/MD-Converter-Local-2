const taxonomy = require('../config/taxonomy-structure')

const checkDependencies = function (obj, category, values, errObject) {
  const metaproperty = taxonomy[category]

  console.log(metaproperty)

  // for (var value of values) {
  //
  // }
}

module.exports = checkDependencies
