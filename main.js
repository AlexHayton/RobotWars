// Robots
//
// Check for command line arguments
var debugMode = false;
if (process.argv.length > 0) {
  process.argv.forEach(function(val, index) {
      if (val == "--help")
      {
        console.log("Instructions for use:");
        process.exit();
      }
      
      if (val == "--debug")
      {
        console.log("Debug mode enabled");
        debugMode = true;
      }
  });
}

// Read input from stdin
var readline = require("readline");
var commandParser = require("./utils/commandParser.js");

var std = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
.on('line', function(lineToParse) {
  commandParser(lineToParse, debugMode);
});

commandParser