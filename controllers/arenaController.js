var ArenaModel = require("../models/arena.js");
var deferred = require("deferred");

// arenaController
// ---------------

// This module is responsible for managing and manipulating the arena data.
// It contains a singleton Arena reference which can have robots added.
//
// The arena is a fixed size, with [0,0] being the bottom-left. 
// By default, robots cannot collide with one another but there is an option
// to allow two robots to occupy the same space.

var arena = null;

// ArenaReady
// ----------
// Have we defined the width and height of the arena yet?

exports.ArenaReady = function () {
    return arena !== null;
}

// CreateArena
// ----------
// Called after the user types in the arena width and height.

exports.CreateArena = function (sizeX, sizeY) {
    arena = ArenaModel.create();
    arena.sizeX = sizeX;
    arena.sizeY = sizeY;
    arena.robots = [];
    arena.robotsCollide = true;
    
    ArenaModel.validate(arena);
}

// AddRobot
// ----------
// Adds a robot to the arena. This will be the robot that next receives commands

exports.AddRobot = function (robot) {
    arena.robots.push(robot);
}

// GetRobotForCommands
// ----------
// Gets the robot that was most recently added to the arena
// Commands are typically issued to the most recent robot.

exports.GetRobotForCommands = function () {
    if (arena.robots.length === 0)
    {
        throw new Error("arena has no robots!");
    }
    return arena.robots[arena.robots.length - 1];
}

// CheckIsSpaceValid
// -----------------

// This function validates whether a robot can occupy a given space.
// If the position lies outside of the arena or is already occupied
// by a robot, it is not a valid space.

exports.CheckIsSpaceValid = function(X, Y) {
    var isValid = (X >= 0 && 
                   X <= arena.sizeX &&
                   Y >= 0 &&
                   Y <= arena.sizeY);
                   
    if (isValid && arena.robotsCollide)
    {
        arena.robots.forEach(function(robot) {
            if (robot.x == X && robot.y == Y)
            {
                isValid = false;
                return false;
            }
        });
    }
    
    return isValid;
}

// ResetArena
// ----------
// Used for testing purposes

exports.ResetArena = function() {
    arena = null;
}