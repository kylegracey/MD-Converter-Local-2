const getSetting = require('./get-setting')
const KeywordCats = getSetting("KeywordCats")

// const objInput = {
//   name: "tempObj",
//   keywords: "GTQ - Frost, JJ Watt, Recover Bar, Individual Product, Male, Efficacy, Football, One, Practice"
// };
//
// let objOutput = {
//   name: "Output Object"
// };

const altKeywords = {
  "Blender Bottle" : ["Shaker Bottle", "Rec Bottle"],
  "Whey Protein Bar" : ["Recover Bar"],
  "Backgrounds & Textures" : ["Backgrounds"]
}

const wordSearch = function(objKeywordArr, newObj) {

  // console.log(`Entering wordSearch, looking for ${objKeywordArr}`)

  // Look for altKeywords and remap any matches
  for (key in altKeywords) {
    for (let i = 0; i < objKeywordArr.length; i++) {
      if (altKeywords[key].indexOf(objKeywordArr[i]) !== -1) {
        objKeywordArr[i] = key
      }
    }
  }

  // Check all keywords for matches and push them into the appropriate category in newObj
  for (let i=0; i < objKeywordArr.length; i++) {
    //If it's a year, push to newObj.year
    if (typeof objKeywordArr[i] == 'number' && objKeywordArr[i].toString().length == 4) {
      if (newObj.year.indexOf(objKeywordArr[i]) == -1) {
        newObj.year.push(objKeywordArr[i])
      }
    } else {

      let foundKeyword = false

      for (Cat in KeywordCats) {

        if (KeywordCats[Cat].indexOf(objKeywordArr[i]) !== -1) {
          foundKeyword = true
          // Found a match in this category's array
          let category = Cat.toLowerCase().replace(/\s/g, '');

          // Exceptions
          if (category === "marks") {
            category = "teammarks"
          }

          // Check if tag exists in category already. If not, push into newObj[category]
          // console.log(`Found a match! Pushing ${objKeywordArr[i]} into ${category}`)
          if(newObj[category].indexOf(objKeywordArr[i]) == -1) {
            newObj[category].push(objKeywordArr[i])
          }
        }

      }

      // If tag isn't found in any of the keyword categories, add to tags
      if (!foundKeyword) {
        if (newObj.Tags.indexOf(objKeywordArr[i]) == -1) {
          newObj.Tags.push(objKeywordArr[i])
        }
      }
    }

  }

}

// // Legacy wordSearch
// const wordSearch = function (objKeywords, objOutput){
//
//   let newObjTags = [];
//
//   // List of Keywords to Re-map
//   const altKeywords = {
//     "Product" : {
//       "Blender Bottle" : ["Shaker Bottle", "Rec Bottle"],
//       "Whey Protein Bar" : ["Recover Bar"]
//     },
//     "Asset Subtype" : {
//       "Backgrounds & Textures" : ["Backgrounds"]
//     }
//   };
//
//   for (let key in KeywordCats) {
//     let catName = key.toLowerCase().replace(/\s/g, '');
//     const catSettingArr = KeywordCats[key];
//     let catArrOutput = [];
//
//     catSettingArr.forEach(function(keyword){
//       // Look for matches between each keyword, and the keyword in the object.
//       for (let objKey in objKeywords){
//         if (keyword === objKeywords[objKey]) {
//           //Found an exact match!
//           // console.log("In if statement. catName = " + catName);
//           catArrOutput.push(objKeywords[objKey]);
//           objKeywords.splice(objKey, 1);
//         }
//       };
//     });
//
//     for (let objKey in objKeywords) {
//       // For each leftover keyword
//       for (let cats in altKeywords) {
//         const altCatName = cats.toLowerCase().replace(/\s/g, '');
//
//         // Loop through each alt category only IF it matches category name
//         if (catName === altCatName) {
//           let catObject = altKeywords[cats];
//           for (let catKey in catObject) {
//             catObject[catKey].forEach(function(oldTerm){
//
//               if (objKeywords[objKey] === oldTerm) {
//                 // console.log("found match between " + objKeywords[objKey] + " and " + oldTerm + " in " + catName);
//                 catArrOutput.push(catKey);
//                 objKeywords.splice(objKey, 1);
//
//               }
//
//             });
//           }
//
//         }
//
//       }
//
//     }
//
//     objOutput[catName] = catArrOutput.join(',');
//   }
//   objOutput["Tags"] = objKeywords.join(',');
// };

module.exports = wordSearch
