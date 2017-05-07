const getSetting = require('./get-setting')
const productSizeTerms = getSetting("Product Size")

const sortHSLogic = function(objHS, hsArr, newObj) {
  if (hsArr.length == 1) {
  // If Single Tier
  // Expired or just a tag
    if (hsArr[0] == "Asset Expired") {
      // Asset is Expired
      if (newObj.assetstatus == "") { newObj.assetstatus = "Expired" }

    } else {
      // It's just a tag
      if(newObj.Tags.indexOf(objHS) == -1) {
        newObj.Tags.push(objHS)
      }
    }
  } else {
    // Two+ tier
    let category = hsArr[0].toLowerCase().replace(/\s/g, '');

    if (newObj.hasOwnProperty(category)) {
      // If category matches one in object, push the second string from array into appropriate category.
      if(newObj[category].indexOf(hsArr[1]) == -1) {
        newObj[category].push(hsArr[1])
      }
    } else if (category == "athlete"){
      //Athlete exception. Remap to 'person'
      if(newObj.person.indexOf(hsArr[1]) == -1) {
        newObj.person.push(hsArr[1])
      }

    } else {
      if(newObj.Tags.indexOf(hsArr[1]) == -1) {
        newObj.Tags.push(hsArr[1])
      }
    }

    if (hsArr[2]) {
      //Check third tier tags for matches with 'Product Size'
      if (productSizeTerms.indexOf(hsArr[2]) !== -1) {
        // If term matches product size term
        if(newObj.productsize.indexOf(hsArr[2]) == -1) {
          newObj.productsize.push(hsArr[2])
        }

      } else if(newObj.Tags.indexOf(hsArr[2]) == -1) {
        newObj.Tags.push(hsArr[2])
      }
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

  // If not array
  if (typeof objHS == "string") {
    let hsArr = objHS.split('|')
    sortHSLogic(objHS, hsArr, newObj)
  } else if (Array.isArray(objHS)) {
    // If array
    objHS.forEach(function(hs) {
      // For each string containing a set of hierarchical subject tags. Ex:
      // 'Product|Protein Powder|Individual Packet'
      hsArr = hs.split('|')
      sortHSLogic(objHS, hsArr, newObj)

    })
  }

}

const sortKeywords = function(obj, newObj) {
  let newObjTags = []
  if (obj.HierarchicalSubject) {
    sortHS(obj.HierarchicalSubject, newObj)
  } else if (obj.Keywords) {
    console.log('Keywords: ' + obj.FileName)
  } else if (obj.Subject) {
    console.log('Subject: ' + obj.FileName)
  } else {
    (`!!!!Warning!!!! ${obj.FileName} has no keywords!!!!`)
  }
}

module.exports = sortKeywords
