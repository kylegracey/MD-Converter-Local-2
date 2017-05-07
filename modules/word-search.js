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

const wordSearch = function (objKeywords, objOutput){

  let newObjTags = [];

  // List of Keywords to Re-map
  const altKeywords = {
    "Product" : {
      "Blender Bottle" : ["Shaker Bottle", "Rec Bottle"],
      "Whey Protein Bar" : ["Recover Bar"]
    },
    "Asset Subtype" : {
      "Backgrounds & Textures" : ["Backgrounds"]
    }
  };

  for (let key in KeywordCats) {
    let catName = key.toLowerCase().replace(/\s/g, '');
    const catSettingArr = KeywordCats[key];
    let catArrOutput = [];

    catSettingArr.forEach(function(keyword){
      // Look for matches between each keyword, and the keyword in the object.
      for (let objKey in objKeywords){
        if (keyword === objKeywords[objKey]) {
          //Found an exact match!
          // console.log("In if statement. catName = " + catName);
          catArrOutput.push(objKeywords[objKey]);
          objKeywords.splice(objKey, 1);
        }
      };
    });

    for (let objKey in objKeywords) {
      // For each leftover keyword
      for (let cats in altKeywords) {
        const altCatName = cats.toLowerCase().replace(/\s/g, '');

        // Loop through each alt category only IF it matches category name
        if (catName === altCatName) {
          let catObject = altKeywords[cats];
          for (let catKey in catObject) {
            catObject[catKey].forEach(function(oldTerm){

              if (objKeywords[objKey] === oldTerm) {
                // console.log("found match between " + objKeywords[objKey] + " and " + oldTerm + " in " + catName);
                catArrOutput.push(catKey);
                objKeywords.splice(objKey, 1);

              }

            });
          }

        }

      }

    }

    objOutput[catName] = catArrOutput.join(',');
  }
  objOutput["Tags"] = objKeywords.join(',');
};

module.exports = wordSearch
