var validate = require('validate.js');
var DirectionEnum = require("./direction.js");

// Robot model
// -----------

// This model represents a robot which sits in the arena.
// Robots have an X and Y coordinate in arena-space.
// Robots can turn left or right or move forward.

// By default, two robots cannot occupy the same space in the arena.
var RobotModel = { 
    x: 0,
    y: 0,
    direction: DirectionEnum.North
};
    
exports.create = function () {
    return Object.create(RobotModel);
};

var constraints = {
    x: {
        presence: true,
        numericality: {
          onlyInteger: true,
          greaterThanOrEqualTo: 0,
        }
    },
    y: {
        presence: true,
        numericality: {
          onlyInteger: true,
          greaterThanOrEqualTo: 0,
        }
    },
    direction: {
        presence: true,
        inclusion: {
            within: {
                "North": DirectionEnum.North, 
                "East": DirectionEnum.East,
                "South": DirectionEnum.South,
                "West": DirectionEnum.West,
            }
        }
    },
}

exports.validate = function(robot) {
    var validationErrors = validate(robot, constraints);
    if (validationErrors) {
        throw new Error(JSON.stringify(validationErrors));
    }
}