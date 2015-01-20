var arenaController = require("./arenaController.js");
var RobotModel = require("../models/robot.js");
var DirectionEnum = require("../models/direction.js");
var CommandEnum = require("../models/command.js");

// robotController
// ---------------

// This module is responsible for manipulating robots.

function validateRobot(robot) {
    if (!(robot instanceof RobotModel)) {
        throw new Error("robot is not valid!");
    }
    
    robot.validate(function() {
        if (!robot.isValid)
        {
            //validation failed, dump validation errors to the console
            console.error(robot.errors);
            throw new Error(robot.errors.toString());
        }
    });
}

exports.CreateRobot = function (sizeX, sizeY, direction) {
    var robot = RobotModel.create();
    robot.sizeX = sizeX;
    robot.sizeY = sizeY;
    robot.Direction = direction;
    
    robot.validate(function() {
        if (!robot.isValid)
        {
            //validation failed, dump validation errors to the console
            console.error(robot.errors);
        }
    });
}

exports.ProcessCommands = function(robot, commands) {
    validateRobot(robot);
    
    if (!commands.isArray) {
        throw new Error("Commands must be an array!");
    }
    
    commands.each(function (command)
    {
       if (!command instanceof CommandEnum)
       {
            throw new Error("command is invalid");   
       }
       
       switch (command) 
       {
            case CommandEnum.Left:
                this.TurnLeft(robot);
                break;
                
            case CommandEnum.Right:
                this.TurnRight(robot);
                break;
                
            case CommandEnum.Move:
                this.Move(robot);
                break;
       }
    });
}

exports.TurnLeft = function (robot) {
    validateRobot(robot);
    
    switch (robot.Direction)
    {
        case DirectionEnum.North:
            robot.Direction = DirectionEnum.West;
            break;
            
        case DirectionEnum.East:
            robot.Direction = DirectionEnum.North;
            break;
            
        case DirectionEnum.South:
            robot.Direction = DirectionEnum.East;
            break;
            
        case DirectionEnum.West:
            robot.Direction = DirectionEnum.South;
            break;
    }
}

exports.TurnRight = function (robot) {
    validateRobot(robot);
    
    switch (robot.Direction)
    {
        case DirectionEnum.North:
            robot.Direction = DirectionEnum.East;
            break;
            
        case DirectionEnum.East:
            robot.Direction = DirectionEnum.South;
            break;
            
        case DirectionEnum.South:
            robot.Direction = DirectionEnum.West;
            break;
            
        case DirectionEnum.West:
            robot.Direction = DirectionEnum.North;
            break;
    }
}

exports.Move = function(robot, arena) {
    validateRobot(robot);
    
    switch (robot.Direction)
    {
        case DirectionEnum.North:
            if (arenaController.CheckIsSpaceValid(robot.X, robot.Y+1))
            {
                robot.Y++;
            }
            break;
            
        case DirectionEnum.South:
            if (arenaController.CheckIsSpaceValid(robot.X, robot.Y-1))
            {
                robot.Y--;
            }
            break;
            
        case DirectionEnum.East:
            if (arenaController.CheckIsSpaceValid(robot.X+1, robot.Y))
            {
                robot.X++;
            }
            break;
            
        case DirectionEnum.West:
            if (arenaController.CheckIsSpaceValid(robot.X-1, robot.Y))
            {
                robot.X--;
            }
            break;
    }
}