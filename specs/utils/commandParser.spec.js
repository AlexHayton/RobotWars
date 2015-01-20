var rewire = require("rewire");
var CommandEnum = require("../../models/command.js");
var DirectionEnum = require("../../models/direction.js");
var RobotModel = require("../../models/robot.js");

var arenaController = require("../../controllers/arenaController.js");

describe('Command Parser :: ', function() {
    
    var logMock = { log: function () { } };
    
    describe('arena creation', function() {
        var commandParser = null;
        var arenaControllerMock = {
            ArenaReady: function() { return false; }, 
            CreateArena: function () {} 
        };
        
        // Reset the arena spy before each test.
        beforeEach(function () {
            commandParser = rewire("../../utils/commandParser.js");
            
            spyOn(arenaControllerMock, "CreateArena");
            
            commandParser.__set__("arenaController", arenaControllerMock);
        });
        
        it('should create simple square arenas', function() {
            commandParser("5 5", logMock.log);
            expect(arenaControllerMock.CreateArena).toHaveBeenCalledWith(5, 5);
        });
        
        it('should create rectangular arenas', function() {
            commandParser("5 7", logMock.log);
            expect(arenaControllerMock.CreateArena).toHaveBeenCalledWith(5, 7);
        });
        
        it('should handle multi-digit numbers', function() {
            commandParser("10 15", logMock.log);
            expect(arenaControllerMock.CreateArena).toHaveBeenCalledWith(10, 15);
        });
        
        it('should throw errors for negative numbers', function() {
            expect(function () { commandParser("10 -5", logMock.log) }).toThrow("Invalid Input!");
        });
        
        it('should throw errors for letters', function() {
            expect(function () { commandParser("10 Test", logMock.log) }).toThrow("Invalid Input!");
        });
    });
    
    describe('robot creation with no arena', function() {
        var commandParser = null;
        
        beforeEach(function () {
            commandParser = rewire("../../utils/commandParser.js");
        });
        
        it('should fail if there is no arena', function () {
            arenaController.ResetArena();
            expect(function () { commandParser("0 0 N", logMock.log) }).toThrow("Arena is not ready, cannot create robot!");
        });
    });
     
    describe('robot creation with an arena', function () {
        var commandParser = null;
        var arenaControllerMock = { 
            ArenaReady: function() { return true; }, 
        };
        var robotControllerMock = { 
            CreateRobot: function () {} 
        };
        
        // Reset the arena and the robot spy before each test.
        beforeEach(function () {
            commandParser = rewire("../../utils/commandParser.js");
        
            spyOn(robotControllerMock, "CreateRobot");
            
            commandParser.__set__("arenaController", arenaControllerMock);
            commandParser.__set__("robotController", robotControllerMock);
        });
        
        it('should create a simple robot at 0 0 N', function() {
            commandParser("0 0 N", logMock.log);
            expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(0, 0, DirectionEnum.North);
        });
        
        it('should create a simple robot at 1 2 N', function() {
            commandParser("1 2 N", logMock.log);
            expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(1, 2, DirectionEnum.North);
        });
        
        it('should handle multi-digit numbers', function() {
            commandParser("10 15 N", logMock.log);
            expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(10, 15, DirectionEnum.North);
        });
        
        it('should handle the East direction', function() {
            commandParser("0 0 E", logMock.log);
            expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(0, 0, DirectionEnum.East);
        });
        
        it('should handle the South direction', function() {
            commandParser("0 0 S", logMock.log);
            expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(0, 0, DirectionEnum.South);
        });
        
        it('should handle the East direction', function() {
            commandParser("0 0 E", logMock.log);
            expect(robotControllerMock.CreateRobot).toHaveBeenCalledWith(0, 0, DirectionEnum.East);
        });
    });
    
    describe('command execution', function() {
        var commandParser = null;
        var robotMock = { x: 0, y: 0, direction: DirectionEnum.North };
        var arenaControllerMock = {
            GetRobotForCommands: function () { return robotMock; }
        }
        var robotControllerMock = { 
            ProcessCommands: function () {} 
        };
        
         // Reset the arena and the robot spy before each test.
        beforeEach(function () {
            commandParser = rewire("../../utils/commandParser.js");
            
            spyOn(arenaControllerMock, "GetRobotForCommands").andCallThrough();;
            spyOn(robotControllerMock, "ProcessCommands");
            spyOn(logMock, "log");
            
            commandParser.__set__("arenaController", arenaControllerMock);
            commandParser.__set__("robotController", robotControllerMock);
        });
        
        it('should handle L', function() {
            commandParser("L", logMock.log);
            expect(logMock.log).toHaveBeenCalled();
            expect(arenaControllerMock.GetRobotForCommands).toHaveBeenCalled();
            expect(robotControllerMock.ProcessCommands).toHaveBeenCalledWith(robotMock, [ CommandEnum.Left ]);
        });
        
        it('should handle R', function() {
            commandParser("R", logMock.log);
            expect(logMock.log).toHaveBeenCalled();
            expect(arenaControllerMock.GetRobotForCommands).toHaveBeenCalled();
            expect(robotControllerMock.ProcessCommands).toHaveBeenCalledWith(robotMock, [ CommandEnum.Right ]);
        });
        
        it('should handle M', function() {
            commandParser("M", logMock.log);
            expect(logMock.log).toHaveBeenCalled();
            expect(arenaControllerMock.GetRobotForCommands).toHaveBeenCalled();
            expect(robotControllerMock.ProcessCommands).toHaveBeenCalledWith(robotMock, [ CommandEnum.Move ]);
        });
        
        it ('should handle multiple commands', function () {
           commandParser("LMRM", logMock.log); 
           expect(logMock.log).toHaveBeenCalled();
           expect(arenaControllerMock.GetRobotForCommands).toHaveBeenCalled();
           expect(robotControllerMock.ProcessCommands).toHaveBeenCalledWith(robotMock, [ 
               CommandEnum.Left,  
               CommandEnum.Move,  
               CommandEnum.Right,  
               CommandEnum.Move,  
            ]);
        });
        
        it ('should handle repeated commands', function () {
           commandParser("LLRR", logMock.log); 
           expect(logMock.log).toHaveBeenCalled();
           expect(arenaControllerMock.GetRobotForCommands).toHaveBeenCalled();
           expect(robotControllerMock.ProcessCommands).toHaveBeenCalledWith(robotMock, [ 
               CommandEnum.Left,  
               CommandEnum.Left,  
               CommandEnum.Right,  
               CommandEnum.Right,  
            ]);
        });
    });
    
    describe('garbage input handling', function () {
        var commandParser = null;
        
        beforeEach(function () {
            commandParser = rewire("../../utils/commandParser.js");
        });
        
        it ('should reject any letters', function () {
           expect(function () { commandParser("5 A", logMock.log) }).toThrow("Invalid Input!"); 
        });
    });
    
    describe('output', function () {
        var commandParser = null;
        var arenaController = null;
        var robotController = null;
        beforeEach(function () {
            arenaController = require("../../controllers/arenaController.js");
            robotController = require("../../controllers/robotController.js");
            commandParser = rewire("../../utils/commandParser.js");
            spyOn(logMock, "log");
        });
        
        it ('should output the position of the robot after commmands #1', function ()
        {
            arenaController.CreateArena(5, 5);
            var robot = robotController.CreateRobot(1, 2, DirectionEnum.North);
            commandParser("LMLMLMLMM", logMock.log);
            
            expect(logMock.log).toHaveBeenCalledWith("1 3 N");
        });
        
        it ('should output the position of the robot after commmands #2', function ()
        {
            arenaController.CreateArena(5, 5);
            var robot = robotController.CreateRobot(3, 3, DirectionEnum.East);
            commandParser("MMRMMRMRRM", logMock.log);
            
            expect(logMock.log).toHaveBeenCalledWith("5 1 E");
        });
            
    });
});