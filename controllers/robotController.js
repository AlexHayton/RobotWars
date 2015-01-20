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

// CreateRobot
// -----------
// 
// Creates a robot at the specified coordinates and facing in a certain direction
// The direction must be one of the direction enum types (DirectionEnum.North, South etc.)

exports.CreateRobot = function (x, y, direction) {
    var robot = RobotModel.create();
    robot.x = x;
    robot.y = y;
    robot.direction = direction;
    
    validateRobot(robot);
    arenaController.AddRobot(robot);
    return robot;
}

// TurnLeft
// --------
//
// This turns the passed-in robot 90 degrees to the left. 
// Position is not affected.

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

// TurnRight
// --------
//
// This turns the passed-in robot 90 degrees to the right. 
// Position is not affected.

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

// Move
// --------
//
// This moves the robot forward by one unit along its direction of travel, if possible. 
// Direction is not affected.

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

// ProcessCommands
// ---------------
//
// This takes an array of commands and executes them in order on the specified robot.
// Valid Commands are Left, Right and Move.

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