// Trim any extension off the file name or if there isn't an extension, return the current asset name.
module.exports = function trimExtension(obj) {
  if (obj.FileName != null){
    var fName = obj.FileName;
    return fName.replace(/\.[^/.]+$/, "");
  } else {
    return obj["Asset Name"];
  }
}
