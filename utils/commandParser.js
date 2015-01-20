var check = require("check-types");

var CommandEnum = require("../models/command.js");
var DirectionEnum = require("../models/direction.js");

var arenaRegex = /^(\d+) (\d+)$/;
var robotRegex = /^(\d+) (\d+) ([NESWnesw])$/;
var commandRegex = /^[LRMlrm]+$/;

var arenaController = require("../controllers/arenaController.js");
var robotController = require("../controllers/robotController.js");

// commandParser module
// --------------------

// The command parser is responsible for taking user input and calling the 
// relevant controller to perform the actions.

// Invalid user input will result in a warning and is ignored.

module.exports = function(lineToParse) {
    check.string(lineToParse);
    
    var validInput = false;
    var arenaRegexMatches = lineToParse.match(arenaRegex);
    if (arenaRegexMatches !== null)
    {
        var sizeX = Number(arenaRegexMatches[1]);
        var sizeY = Number(arenaRegexMatches[2]);
        arenaController.CreateArena(sizeX, sizeY);
        validInput = true;
    }
    
    var robotRegexMatches = lineToParse.match(robotRegex);
    if (robotRegexMatches !== null)
    {
        if (!arenaController.ArenaReady()) {
            throw new Error("Arena is not ready, cannot create robot!");
        }
        
        var X = Number(robotRegexMatches[1]);
        var Y = Number(robotRegexMatches[2]);
        var rawDirection = robotRegexMatches[3];
        var direction = DirectionEnum.North;
        
        switch (rawDirection.toUpperCase())
        {
            case 'N':
                direction = DirectionEnum.North;
                break;
                
            case 'E':
                direction = DirectionEnum.East;
                break;
                
            case 'S':
                direction = DirectionEnum.South;
                break;
                
            case 'W':
                direction = DirectionEnum.West;
                break;
        }
        
        robotController.CreateRobot(X, Y, direction);
        validInput = true;
    }
    
    var commandRegexMatches = lineToParse.match(commandRegex);
    if (commandRegexMatches !== null)
    {
        var robot = arenaController.GetRobotForCommands();
        var rawCommands = lineToParse.split("");

        // Translate the string commands to our internal representation.
        var commands = rawCommands.map(function(rawCommand) {
            var command = null;
            switch (rawCommand) {
                case "L":
                    command = CommandEnum.Left;
                    break;
               
                case "R":
                    command = CommandEnum.Right;
                    break;
                   
                case "M":
                    command = CommandEnum.Move;
                    break;
           }
           
           return command;
        });
        
        robotController.ProcessCommands(robot, commands);
        validInput = true;
    }
    
    if (!validInput)
    {
        throw new Error("Invalid Input!");
    }
}