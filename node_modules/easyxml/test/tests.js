// vim: noai:ts=2:sw=2
/*jshint strict:false*/
/*global __dirname describe it require*/

var assert  = require("chai").assert,
    fs      = require("fs"),
    path    = require("path"),

    easyXML = require("../index.js");

describe("Node EasyXML", function () {
  var should = {
        "names"  : "should parse a JSON object into XML",
        "names1" : "should parse a JSON object with attrs into XML",
        "names2" : "should parse a JSON object with attrs and text node into XML",
        "singularizeChildren" : "should parse a JSON object without singularizeChildren to XML",
        "singularizeChildren2" : "should parse a JSON object without singularizeChildren to XML (with object)",
        "singularizeChildren3" : "should parse a JSON object with correct captalization",
        "complex" : "testing a more complex XML object",
        "unwrappedArrays" : "should be able to use unwrapped child nodes to represent an array",
        "wrappedArrays" : "should normally wrap array elements in a single parent element",
        "null"    : "should parse a null value"
      };

  Object.keys(should)
    .forEach(function(name){
      it(should[name], function (done) {
        var config = {};
        if (name === 'singularizeChildren' || name === 'singularizeChildren2') {
          config.singularizeChildren = false;
        } else {
          config.singularizeChildren = true;
        }
        if (name === 'unwrappedArrays') {
          config.unwrappedArrays = true;
        } else {
          config.unwrappedArrays = false;
        }

        easyXML.configure(config);

        var file = __dirname + "/fixtures/" + name;

        fs.readFile(file + ".xml", "UTF-8", function (err, data) {
          if (err) {
            throw err;
          }

          var json = require(file + ".json");

          assert.equal(easyXML.render(json), data, "EasyXML should create the correct XML from a JSON data structure.");
          assert.strictEqual(easyXML.render(json), data, "EasyXML should create the correct XML from a JSON data structure.");

          done();
        });
      });
    });
    var undefinedTests = {
        undefinedHandling: { 
            mochaDesc: "Handling undefine in arrays and as elements",
            config: {
                singularizeChildren: true,
                unwrappedArrays: false
            }
        },
        undefinedHandlingFiltered: { 
            mochaDesc: "Handling undefine in arrays and as elements",
            config: {
                singularizeChildren: true,
                unwrappedArrays: false,
                filterNulls: true
            }
        }
    };
    Object.keys(undefinedTests).forEach(function(name) {
      it(undefinedTests[name].mochaDesc, function(done) {
        var file = __dirname + "/fixtures/" + name;
        var json = {
            undef: undefined,
            undefObj: {
                undefSubKey: undefined,
            },
            undefs: [
                undefined,
                null,
                'not-null'
            ],
            undef1s:[
                undefined,
                null,
            ]
        };
        fs.readFile(file + ".xml", "UTF-8", function (err, data) {
            if (err) {
                throw err;
                console.error(err);
            }
            easyXML.configure(undefinedTests[name].config);
            assert.equal(easyXML.render(json), data, "EasyXML should create the correct XML from a JSON data structure.");
            assert.strictEqual(easyXML.render(json), data, "EasyXML should create the correct XML from a JSON data structure.");

            done();
        });
      });
    });
});
