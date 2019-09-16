var fs = require("fs");

exports.hallo = function(welt, arr, callback) {
  let s = "hallo " + welt;
  arr.push(s);
  fs.readFile("test.txt", "utf8", function(err, data) {
    console.log(data);
  });
  callback(s);
  return s;
};
