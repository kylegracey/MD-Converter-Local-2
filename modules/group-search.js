const getSetting = require('./get-setting.js');

// Settings
const ProductGroups = getSetting("Product Groups");

const groupSearch = function(newObj) {
  // Get array of products
  const products = newObj.product

  // For each product in the products array
  for (let i = 0; i < products.length; i++) {
    for (group in ProductGroups) {
      if (ProductGroups[group].indexOf(products[i]) !== -1) {

        if (newObj.productgroup.indexOf(group) == -1) {
          newObj.productgroup.push(group)
        }

      }
    }
  }

}

module.exports = groupSearch
