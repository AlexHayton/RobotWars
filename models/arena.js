var validate = require('validate.js');

// Arena model
// -----------

// This model represents an arena for the robots to fight in.
// The arena is a fixed size, with [0,0] being the bottom-left. 
//
// The arena can contain one or more robots, which cannot move 
// outside of the arena or collide with one another.
//
// Robot collision can be switched on or off based on preference.

var ArenaModel = { 
    sizeX: 0,
    sizeY: 0,
    robots: [],
    robotsCollide: true
};

exports.create = function () {
    return Object.create(ArenaModel);
};

var constraints = {
    sizeX: {
        presence: true,
        numericality: {
          onlyInteger: true,
          greaterThan: 0,
        }
    },
    sizeY: {
        presence: true,
        numericality: {
          onlyInteger: true,
          greaterThan: 0,
        }
    },
    // This is an array containing all of the active robots.
    robots: {
    },
    robotsCollide: {
        presence: true
    }
};

exports.validate = function(arena)
{
    var validationErrors = validate(arena, constraints);
    if (validationErrors) {
        throw new Error(JSON.stringify(validationErrors));
    }
}