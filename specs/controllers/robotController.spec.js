var rewire = require("rewire");
var ArenaModel = require("../../models/arena.js");
var DirectionEnum = require("../../models/direction.js");
var RobotModel = require("../../models/robot.js");

describe("Robot Controller :: ", function () {
    var robotController = null;
    beforeEach(function () {
        robotController = rewire("../../controllers/robotController.js");
    });
    
};