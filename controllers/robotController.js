var util = require('util');
var arenaController = require("./arenaController.js");
var RobotModel = require("../models/robot.js");
var DirectionEnum = require("../models/direction.js");
var CommandEnum = require("../models/command.js");

// robotController
// ---------------

// This module is responsible for manipulating robots.

function validateRobot(robot) {
    RobotModel.validate(robot);
}

exports.CreateRobot = function (x, y, direction) {
    var robot = RobotModel.create();
    robot.x = x;
    robot.y = y;
    robot.direction = direction;
    
    validateRobot(robot);
    arenaController.AddRobot(robot);
    return robot;
}

exports.TurnLeft = function (robot) {
    validateRobot(robot);
    
    switch (robot.direction)
    {
        case DirectionEnum.North:
            robot.direction = DirectionEnum.West;
            break;
            
        case DirectionEnum.East:
            robot.direction = DirectionEnum.North;
            break;
            
        case DirectionEnum.South:
            robot.direction = DirectionEnum.East;
            break;
            
        case DirectionEnum.West:
            robot.direction = DirectionEnum.South;
            break;
    }
}

exports.TurnRight = function (robot) {
    validateRobot(robot);
    
    switch (robot.direction)
    {
        case DirectionEnum.North:
            robot.direction = DirectionEnum.East;
            break;
            
        case DirectionEnum.East:
            robot.direction = DirectionEnum.South;
            break;
            
        case DirectionEnum.South:
            robot.direction = DirectionEnum.West;
            break;
            
        case DirectionEnum.West:
            robot.direction = DirectionEnum.North;
            break;
    }
}

exports.Move = function(robot) {
    validateRobot(robot);
    
    switch (robot.direction)
    {
        case DirectionEnum.North:
            if (arenaController.CheckIsSpaceValid(robot.x, robot.y+1))
            {
                robot.y++;
            }
            break;
            
        case DirectionEnum.South:
            if (arenaController.CheckIsSpaceValid(robot.x, robot.y-1))
            {
                robot.y--;
            }
            break;
            
        case DirectionEnum.East:
            if (arenaController.CheckIsSpaceValid(robot.x+1, robot.y))
            {
                robot.x++;
            }
            break;
            
        case DirectionEnum.West:
            if (arenaController.CheckIsSpaceValid(robot.x-1, robot.y))
            {
                robot.x--;
            }
            break;
    }
}


exports.ProcessCommands = function(robot, commands) {
    validateRobot(robot);
    
    if (!util.isArray(commands)) {
        throw new Error("Commands must be an array!");
    }
    
    commands.forEach(function (command)
    {
       switch (command) 
       {
            case CommandEnum.Left:
                exports.TurnLeft(robot);
                break;
                
            case CommandEnum.Right:
                exports.TurnRight(robot);
                break;
                
            case CommandEnum.Move:
                exports.Move(robot, arenaController);
                break;
            
            default:
                throw new Error("command is invalid!");
       }
    });
}