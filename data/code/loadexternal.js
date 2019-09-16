var module = require.resolve('./external.js');

var arr = [];

function read_external(){
    var external = require(module);
    console.log(external);
    var result = external.hallo("max", arr, function (result) {
        console.log(result);
    });
    console.log(result);
}

setInterval(function(){
    delete require.cache[module]; //clear cache
    read_external();
    console.log(arr.length)
},3000);