var rewire = require("rewire");
var CommandEnum = require("../../models/command.js");
var DirectionEnum = require("../../models/direction.js");
var RobotModel = require("../../models/robot.js");

var arenaController = require("../../controllers/arenaController.js");
var commandParser = rewire("../../utils/commandParser.js");

describe('arena creation', function() {
    var arenaControllerMock = {
        ArenaReady: function() { return false; }, 
        CreateArena: function () {} 
    };
    
    // Reset the arena spy before each test.
    beforeEach(function () {
        spyOn(arenaControllerMock, "CreateArena");
        
        commandParser.__set__("arenaController", arenaControllerMock);
    });
    
    it('should create simple square arenas', function() {
        commandParser("5 5");
        expect(arenaControllerMock.CreateArena).toHaveBeenCalledWith(5, 5);
    });
    
    it('should create rectangular arenas', function() {
        commandParser("5 7");
        expect(arenaControllerMock.CreateArena).toHaveBeenCalledWith(5, 7);
    });
    
    it('should handle multi-digit numbers', function() {
        commandParser("10 15");
        expect(arenaControllerMock.CreateArena).toHaveBeenCalledWith(10, 15);
    });
    
    it('should throw errors for negative numbers', function() {
        expect(function () { commandParser("10 -5") }).toThrow("Invalid Input!");
    });
    
    it('should throw errors for letters', function() {
        expect(function () { commandParser("10 Test") }).toThrow("Invalid Input!");
    });
});

describe('robot creation with no arena', function() {
    it('should fail if there is no arena', function () {
        expect(function () { commandParser("0 0 N") }).toThrow("Arena is not ready, cannot create robot!");
    });
});
 
describe('robot creation with an arena', function () {
    var arenaControllerMock = { 
        ArenaReady: function() { return true; }, 
    };
    var robotControllerMock = { 
        CreateRobot: function () {} 
    };
    
    // Reset the arena and the robot spy before each test.
    beforeEach(function () {
        spyOn(robotControllerMock, "CreateRobot");
        
        commandParser.__set__("arenaController", arenaControllerMock);
        commandParser.__set__("robotController", robotControllerMock);
    });
    
    it('should create a simple robot at 0 0 N', function() {
        commandParser("0 0 N");
        expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(0, 0, DirectionEnum.North);
    });
    
    it('should create a simple robot at 1 2 N', function() {
        commandParser("1 2 N");
        expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(1, 2, DirectionEnum.North);
    });
    
    it('should handle multi-digit numbers', function() {
        commandParser("10 15 N");
        expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(10, 15, DirectionEnum.North);
    });
    
    it('should handle the East direction', function() {
        commandParser("0 0 E");
        expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(0, 0, DirectionEnum.East);
    });
    
    it('should handle the South direction', function() {
        commandParser("0 0 S");
        expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(0, 0, DirectionEnum.South);
    });
    
    it('should handle the East direction', function() {
        commandParser("0 0 E");
        expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(0, 0, DirectionEnum.East);
    });
});

describe('command execution', function() {
    var robotMock = { myFakeRobot: true };
    var arenaControllerMock = {
        GetRobotForCommands: function () { return robotMock; }
    }
    var robotControllerMock = { 
        ProcessCommands: function () {} 
    };
    
     // Reset the arena and the robot spy before each test.
    beforeEach(function () {
        spyOn(robotControllerMock, "ProcessCommands");
        
        commandParser.__set__("arenaController", arenaControllerMock);
        commandParser.__set__("robotController", robotControllerMock);
    });
    
    it('should handle L', function() {
        commandParser("L");
        expect(robotControllerMock.ProcessCommands).toHaveBeenCalledWith(robotMock, [ CommandEnum.Left ]);
    });
    
    it('should handle R', function() {
        commandParser("R");
        expect(robotControllerMock.ProcessCommands).toHaveBeenCalledWith(robotMock, [ CommandEnum.Right ]);
    });
    
    it('should handle M', function() {
        commandParser("M");
        expect(robotControllerMock.ProcessCommands).toHaveBeenCalledWith(robotMock, [ CommandEnum.Move ]);
    });
    
    it ('should handle multiple commands', function () {
       commandParser("LMRM"); 
       expect(robotControllerMock.ProcessCommands).toHaveBeenCalledWith(robotMock, [ 
           CommandEnum.Left,  
           CommandEnum.Move,  
           CommandEnum.Right,  
           CommandEnum.Move,  
        ]);
    });
    
    it ('should handle repeated commands', function () {
       commandParser("LLRR"); 
       expect(robotControllerMock.ProcessCommands).toHaveBeenCalledWith(robotMock, [ 
           CommandEnum.Left,  
           CommandEnum.Left,  
           CommandEnum.Right,  
           CommandEnum.Right,  
        ]);
    });
});

describe('garbage input handling', function () {
    it ('should reject any letters', function () {
       expect(function () { commandParser("5 A") }).toThrow("Invalid Input!"); 
    });
});