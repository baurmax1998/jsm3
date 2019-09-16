const fs = require("fs");

exports.files = function (call) {
  fs.readdir("./data/files/", function(err, files) {
    if (err) return console.log("Unable to scan directory: " + err);
    call(files)
  });
}