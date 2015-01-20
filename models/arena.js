var model = require('nodejs-model');
var typeOfIs = require('type-of-is');

// Arena model
// -----------

// This model represents an arena for the robots to fight in.
// The arena is a fixed size, with [0,0] being the bottom-left. 
//
// The arena can contain one or more robots, which cannot move 
// outside of the arena or collide with one another.
//
// Robot collision can be switched on or off based on preference.

module.exports = model("Arena")
    .attr('sizeX', {
        validations: {
            presence: {
                message: 'X size is required!'
            },
            format: { 
                with: /^\d+$/, 
                message: 'sizeX must be an integer!' 
            },
            greaterThanZero: {
                message: "arena cannot be zero size!"
            }
        }
    })
    .attr('sizeY', {
        validations: {
            presence: {
                message: 'Y size is required!'
            },
            format: { 
                with: /^\d+$/, 
                message: 'sizeY must be an integer!' 
            },
            greaterThanZero: {
                message: "arena cannot be zero size!"
            }
        }
    })
    // This is an array containing all of the active robots.
    .attr('robots', {
        validations: {
            presence: {
                message: 'robots is required!'
            },
            isArray: {
                message: 'robots must be an array!'
            }
        }
    })
    .attr('robotsCollide', {
        validations: {
            presence: {
                message: 'robotsCollide is required!'
            },
            isBoolean: {
                message: 'robotsCollide must be a boolean!'
            }
        }
    });
    
    module.exports.validator('greaterThanZero', function(model, property, options) {
        var numberProp = model[property]();
        if ((!Type.is(numberProp, Number))
            ||
            numberProp <= 0) {
            model.addError(property, options.message);
        }
    });
    
    module.exports.validator('isArray', function(model, property, options) {
        if (!(model[property]().isArray)) {
            model.addError(property, options.message);
        }
    });
    
    module.exports.validator('isBoolean', function(model, property, options) {
        if (!(Type.is(model[property](), Boolean))) {
            model.addError(property, options.message);
        }
    });