const fs = require("fs");

exports.code_files = function (call) {
  fs.readdir("./data/code/", function(err, files) {
    if (err) return console.log("Unable to scan directory: " + err);
    call(files)
  });
}