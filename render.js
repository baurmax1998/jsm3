const fs = require("fs");
const path = require("path");
const parser = require("jsdoc3-parser");
const electron = require("electron");
const remote = electron.remote;
const { fork } = require("child_process");

JSONEditor.defaults.editors.object.options.collapsed = true;
JSONEditor.defaults.editors.array.options.collapsed = true;

let data = {};
var configPath = "data/config/config.json";

var JavaScriptMode = ace.require("ace/mode/javascript").Mode;
var editorInstance = ace.edit("editor");
editorInstance.setTheme("ace/theme/twilight");
editorInstance.session.setMode(new JavaScriptMode());
editorInstance.setValue(`
process.on('message', (msg) => {
  console.log('Message from parent:', msg);
});

let counter = 0;

setInterval(() => {
  process.send({ counter: counter++ });
}, 1000);
`)

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

function loadings() {
  let loadings = data.loadings;
  data.dynamic = {};
  for (let loadingPath of loadings) {
    let loading = remote.require(loadingPath);
    parser(loadingPath, function(e, docs) {
      let doc = findDoc(docs, loadingPath);
      loading[doc.name](function(loadData) {
        data.dynamic[doc.name] = loadData;
        jsoneditor.setValue(data);
        $("input.form-control:not([placeholder='Property name...'])")
          .off("click", enterInput)
          .on("click", enterInput);
      });
    });
  }
}

function functions() {
  addFunction("userf", "red", "fa-user");
  addFunction("playf", "green", "fa-play");
  addFunction("editf", "purple", "fa-edit");

  $("#editf").on("click", function() {
    console.log("edit"); //todo editor aufrufen
    editorInstance.setValue("console.log('hallo')");
  });

  $("#playf").on("click", function() {
    console.log("play");
    let code = editorInstance.getValue();
    let tempFile = "child.js";
    fs.writeFile(tempFile, code, "utf8", function(err) {
      if (err) {
        return console.log(err);
      }
      let forked = fork(tempFile);

      forked.on("message", msg => {
        console.log("Message from child", msg);
      });

      forked.on('exit', function (code, signal) {
        console.log('child process exited with ' +
                    `code ${code} and signal ${signal}`);
      });

      forked.send({ hello: "world" });

      setTimeout(function (){

        forked.kill()
      
      }, 5000);

    });
  });
}

function addFunction(id, color, icon) {
  $("#functions").append(
    $("<li>").append(
      $('<a class="btn-floating">')
        .attr("id", id)
        .css("background-color", color)
        .append($('<i class="fa">').addClass(icon))
    )
  );
}

function findDoc(docs, filePath) {
  for (let doc of docs) {
    if (doc.meta != undefined) {
      if (doc.meta.filename.split(".")[0] == doc.name) {
        return doc;
      }
    }
  }
  throw new Error("No doc for: " + filePath);
}

function enterInput(event) {
  let path = event.currentTarget.name
    .replaceAll("\\[", "/")
    .replaceAll("\\]", "");
  $(".breadcrumb").html("");
  $(path.split("/")).each((i, x) => {
    $(".breadcrumb").append($("<li>").append($("<a href='#'>").text(x)));
  });
  updateFunctions(path);
}

function updateFunctions(currentPath) {
  console.log(currentPath + " todo: spezifische Methoden");
}

var jsoneditor = new JSONEditor(document.getElementById("editor_holder"), {
  theme: "bootstrap3",
  iconlib: "bootstrap3",
  disable_edit_json: true,
  disable_collapse: false,
  collapsed: true,
  schema: {
    title: "Config",
    type: "object"
  }
});

fs.readFile(configPath, "utf8", function(err, text) {
  data = JSON.parse(text);
  jsoneditor.setValue(data);
  loadings();
  functions();
});

jsoneditor.on("change", function() {
  data = jsoneditor.getValue();
  if (!(Object.keys(data).length === 0 && data.constructor === Object))
    fs.writeFile(configPath, JSON.stringify(data), function(err) {
      if (err) return console.error(err);
    });
});
