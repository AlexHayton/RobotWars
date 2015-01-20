var model = require('nodejs-model');
var Enum = require('enum');

// Robot model
// -----------

// This model represents a robot which sits in the arena.
// Robots have an X and Y coordinate in arena-space.
// Robots can turn left or right or move forward.

// By default, two robots cannot occupy the same space in the arena.

module.exports = model("Robot")
    .attr('x', {
        validations: {
            presence: {
                message: 'X coordinate is required!'
            }
        },
        format: { 
            with: /^\d+$/, 
            message: 'X coordinate must be an integer!' 
        }
    })
    .attr('y', {
        validations: {
            presence: {
                message: 'Y coordinate is required!'
            },
            format: { 
                with: /^\d+$/, 
                message: 'Y coordinate must be an integer!' 
            }
        }
    })
    .attr('direction', {
        validations: {
            presence: {
                message: 'Direction is required!'
            },
            isEnum: {
                message: 'Direction must be an Enum!' 
            }
        }
    })
    .validator('isEnum', function(model, property, options) {
        if (!(model[property]() instanceof Enum)) {
            model.addError(property, options.message);
        }
    });