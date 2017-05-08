const getSetting = require('./get-setting')
const wordSearch = require('./word-search')

const altKeywords = getSetting("Keyword Remaps")
// {
//   // Group Word Remapping
//   "Person" : ["Athlete"],
//   "Team Marks" : ["Marks"],
//   // Keyword Remapping
//   "Blender Bottle" : ["Shaker Bottle", "Rec Bottle"],
//   "Backgrounds & Textures" : ["Backgrounds", "Details"],
//   "Expired" : ["Asset Expired"],
//   "Energy Chews" : ["Prime Chews"],
//   "Gx Bottle" : ["Gx"],
//   "Product Close Up" : ["Product Hero"],
//   "Whey Protein Bar" : ["Recover Bar"]
// }

const remapCheck = function(Keywords) {
  //Takes an array of keywords, loops through and remaps any of them.
  if (!Array.isArray(Keywords)) {
    Keywords = Keywords.split(', ')
  }

  let keywords = Keywords

  for (key in altKeywords) {
    for (let i = 0; i < keywords.length; i++) {
      if (altKeywords[key].indexOf(keywords[i]) !== -1) {
        // console.log(`Remap check: ${keywords[i]} to ${key}`)
        Keywords[i] = key
      }
    }
  }

  return keywords

}

const sortHSLogic = function(hsArr, newObj) {

  if (hsArr.length == 1) {
  // If Single Tier
  // Expired or just a tag
    if (hsArr[0] == "Expired") {
      // Asset is Expired
      if (newObj.assetstatus == "") { newObj.assetstatus = "Expired" }

    } else {
      // It's a tag
      wordSearch(hsArr[0], newObj)
    }
  } else {
    // Two+ tier

    // Start
    let category = hsArr[0].toLowerCase().replace(/\s/g, '');

    if (newObj.hasOwnProperty(category)) {
      // If category matches one in object, push the second string from array into appropriate category.

      if(newObj[category].indexOf(hsArr[1]) == -1) {
        newObj[category].push(hsArr[1])
      }
    } else {
      // Didn't find a category match. Need to check keywords.
      wordSearch(hsArr[1], newObj)
    }

    if (hsArr[2]) {
      wordSearch(hsArr[2], newObj)
    }

    if (hsArr.length > 3) {
      console.log(`===WARNING===
        Found a 4+ tier array. Fourth tier + will not be logged.`)
    }

  }
}

const sortHS = function (objHS, newObj) {
  // Input Example:
  // [ 'Asset Type|Product Renders', 'Product|Protein Powder|Individual Packet', 'Asset Expired' ]
  // !! Single example: Not array !! ex: 'Asset Type|Product Renders'

  // If string, convert to array
  if (typeof objHS == "string") {
    let hsArr = objHS.split('|')
    sortHSLogic(remapCheck(hsArr), newObj)
  } else if (Array.isArray(objHS)) {
    // If already array
    objHS.forEach(function(hs) {
      // For each string containing a set of hierarchical subject tags. Ex:
      // 'Product|Protein Powder|Individual Packet'
      hsArr = hs.split('|')
      sortHSLogic(remapCheck(hsArr), newObj)

    })
  }

}

const sortKeywords = function(obj, newObj) {
  let newObjTags = []
  if (obj.HierarchicalSubject) {
    sortHS(obj.HierarchicalSubject, newObj)
  } else if (obj.Keywords) {
    wordSearch(remapCheck(obj.Keywords), newObj)
  } else if (obj.Subject) {
    wordSearch(remapCheck(obj.Subject), newObj)
  } else {
    (`!!!!Warning!!!! ${obj.FileName} has no keywords!!!!`)
  }
}

module.exports = sortKeywords
