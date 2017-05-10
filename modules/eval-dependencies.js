const taxonomy = require('../config/taxonomy-structure')

function getMetapropertyOptions(name) {
  let mp = ""
  for (i=0; i<taxonomy.length; i++) {
    if (taxonomy[i].Metaproperty == name) {
      mp = taxonomy[i].Options
    }
  }
  return mp
}

const checkTags = function (obj, category, values, CritErrObject, DependencyCount, MinorErrObject) {
  const MpOptions = getMetapropertyOptions(category)
  for (var value of values) {
    let ValidTag = false

    for (var MpOption of MpOptions) {
      if (value == MpOption.Label) {
        ValidTag = true

        if (MpOption.Dependencies !== undefined) {
          let ValidDependency = false
          for (mp in MpOption.Dependencies) {
            //For each type of dependency (by metaproperty)
            for (let dependency of MpOption.Dependencies[mp]) {
              // console.log(`${dependency} on ${mp}`)
              if (obj[mp] == dependency) {
                ValidDependency = true
              }
            }
          }

          // If checked all dependencies and didn't find a match, trigger error.
          if (!ValidDependency) {
            CritErrObject.exists = true
            DependencyCount++
            CritErrObject["Dependencies"].push(`${category}: '${value}' has incompatible dependencies!`)
          }
        }

      }
    }
  }

}

module.exports = checkTags
