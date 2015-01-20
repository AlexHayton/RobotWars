var rewire = require("rewire");
var ArenaModel = require("../../models/arena.js");
var DirectionEnum = require("../../models/direction.js");
var CommandEnum = require("../../models/command.js");
var RobotModel = require("../../models/robot.js");
var arenaController = require("../../controllers/arenaController.js");

describe("Robot Controller :: ", function () {
    var robotController = null;
    var spaceValidSpy = null;
    var addRobotSpy = null;
    arenaControllerMock = {
        sizeX: 200,
        sizeY: 200,
        ArenaReady: function() { return true; }, 
        AddRobot: function() { },
        CheckIsSpaceValid: function() { return true; } 
    };
    
    beforeEach(function () {
        robotController = rewire("../../controllers/robotController.js");
        robotController.__set__("DirectionEnum", DirectionEnum);
        robotController.__set__("arenaController", arenaControllerMock);
        spyOn(arenaControllerMock, "CheckIsSpaceValid");
        spyOn(arenaControllerMock, "AddRobot");
    });
    
    describe("Robot Creation", function ()
    {
        it("should create a robot at a valid position", function() {
            var desiredRobot = RobotModel.create();
            desiredRobot.x = 5;
            desiredRobot.y = 5;
            desiredRobot.direction = DirectionEnum.North;
            
            var robot = robotController.CreateRobot(5, 5, DirectionEnum.North);
            expect(arenaControllerMock.AddRobot.calls[0].args[0].x).toEqual(5);
            expect(arenaControllerMock.AddRobot.calls[0].args[0].y).toEqual(5);
            expect(arenaControllerMock.AddRobot.calls[0].args[0].direction).toEqual(DirectionEnum.North);
            expect(robot.x).toEqual(5);
            expect(robot.y).toEqual(5);
            expect(robot.direction).toEqual(DirectionEnum.North);
        });
        
        it("should create two robots", function() {
            var desiredRobot1 = RobotModel.create();
            desiredRobot1.x = 3;
            desiredRobot1.y = 4;
            desiredRobot1.direction = DirectionEnum.West;
            
            var robot1 = robotController.CreateRobot(desiredRobot1.x, desiredRobot1.y, desiredRobot1.direction);
            expect(arenaControllerMock.AddRobot.calls[0].args[0].x).toEqual(desiredRobot1.x);
            expect(arenaControllerMock.AddRobot.calls[0].args[0].y).toEqual(desiredRobot1.y);
            expect(JSON.stringify(arenaControllerMock.AddRobot.calls[0].args[0].direction)).toEqual(JSON.stringify(desiredRobot1.direction));
            expect(robot1.x).toEqual(desiredRobot1.x);
            expect(robot1.y).toEqual(desiredRobot1.y);
            expect(JSON.stringify(robot1.direction)).toEqual(JSON.stringify(desiredRobot1.direction));
            
            var desiredRobot2 = RobotModel.create();
            desiredRobot2.x = 7;
            desiredRobot2.y = 8;
            desiredRobot2.direction = DirectionEnum.South;
            
            var robot2 = robotController.CreateRobot(desiredRobot2.x, desiredRobot2.y, desiredRobot2.direction);
            expect(arenaControllerMock.AddRobot.calls[1].args[0].x).toEqual(desiredRobot2.x);
            expect(arenaControllerMock.AddRobot.calls[1].args[0].y).toEqual(desiredRobot2.y);
            expect(JSON.stringify(arenaControllerMock.AddRobot.calls[1].args[0].direction)).toEqual(JSON.stringify(desiredRobot2.direction));
            expect(robot2.x).toEqual(desiredRobot2.x);
            expect(robot2.y).toEqual(desiredRobot2.y);
            expect(JSON.stringify(robot2.direction)).toEqual(JSON.stringify(desiredRobot2.direction));
        });
        
        it("should not accept negative numbers as X coordinates", function () {
            expect(function() { robotController.CreateRobot(-5, 2, DirectionEnum.North) }).toThrow();
        });
        
        it("should not accept negative numbers as Y coordinates", function () {
            expect(function() { robotController.CreateRobot(2, -5, DirectionEnum.North) }).toThrow();
        });
        
        it("should reject invalid directions", function () {
            expect(function() { robotController.CreateRobot(2, 5, "MyRandomDirection") }).toThrow();
        });
    });
    
    describe("Turning Left", function(){
        var robot = null;
        var oldX = 5;
        var oldY = 10;
        beforeEach(function (){
            arenaController.CreateArena(200, 200);
            robotController.__set__("arenaController", arenaController);
            robot = robotController.CreateRobot(oldX, oldY, DirectionEnum.North);
        });
        
        afterEach(function () {
           expect(robot.x).toEqual(oldX);
           expect(robot.y).toEqual(oldY);
        });
        
        it ("should turn left once", function() {
            var commands = [ CommandEnum.Left ];
            robotController.ProcessCommands(robot, commands);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.West));
        });
        
        it ("should turn left twice", function() {
            var commands = [ 
                             CommandEnum.Left,
                             CommandEnum.Left
                           ];
            robotController.ProcessCommands(robot, commands);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.South));
        });
        
        it ("should turn left thrice", function() {
            var commands = [ 
                             CommandEnum.Left,
                             CommandEnum.Left,
                             CommandEnum.Left,
                           ];
            robotController.ProcessCommands(robot, commands);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.East));
        });
        
        it ("should turn come full circle left", function() {
            var commands = [ 
                 CommandEnum.Left,
                 CommandEnum.Left,
                 CommandEnum.Left,
                 CommandEnum.Left
               ];
            robotController.ProcessCommands(robot, commands);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.North));
        });
    });
    
    describe("Turning Right", function(){
        var robot = null;
        var oldX = 5;
        var oldY = 10;
        beforeEach(function (){
            arenaController.CreateArena(200, 200);
            robotController.__set__("arenaController", arenaController);
            robot = robotController.CreateRobot(oldX, oldY, DirectionEnum.North);
        });
        
        afterEach(function () {
           expect(robot.x).toEqual(oldX);
           expect(robot.y).toEqual(oldY);
        });
        
        it ("should turn right once", function() {
            var commands = [ CommandEnum.Right ];
            robotController.ProcessCommands(robot, commands);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.East));
        });
        
        it ("should turn right twice", function() {
            var commands = [ 
                             CommandEnum.Right,
                             CommandEnum.Right
                           ];
            robotController.ProcessCommands(robot, commands);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.South));
        });
        
        it ("should turn right thrice", function() {
            var commands = [ 
                             CommandEnum.Right,
                             CommandEnum.Right,
                             CommandEnum.Right,
                           ];
            robotController.ProcessCommands(robot, commands);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.West));
        });
        
        it ("should turn come full circle right", function() {
            var commands = [ 
                 CommandEnum.Right,
                 CommandEnum.Right,
                 CommandEnum.Right,
                 CommandEnum.Right
               ];
            robotController.ProcessCommands(robot, commands);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.North));
        });
    });
    
    describe("Moving", function (){
        beforeEach(function (){
            arenaController.CreateArena(200, 200);
            robotController.__set__("arenaController", arenaController);
        });
        
        it ("should move forward to a clear space", function() {
            var robot = robotController.CreateRobot(10, 10, DirectionEnum.North);
            robotController.Move(robot);
            expect(robot.x).toEqual(10);
            expect(robot.y).toEqual(11);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.North));
        });
        
        it ("should not move into an obstructed space", function() {
            var oldX = 10;
            var oldY = 10;
            var obstructedY = oldY+1;
            robotController.CreateRobot(oldX, obstructedY, DirectionEnum.North);
            var robot = robotController.CreateRobot(oldX, oldY, DirectionEnum.North);
            robotController.Move(robot);
            expect(robot.x).toEqual(oldX);
            expect(robot.y).toEqual(oldY);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.North));
        });
        
        it ("should not be able to move off the North edge", function() {
            var oldX = 10;
            var oldY = arenaControllerMock.sizeY;
            var robot = robotController.CreateRobot(oldX, oldY, DirectionEnum.North);
            robotController.Move(robot);
            expect(robot.x).toEqual(oldX);
            expect(robot.y).toEqual(oldY);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.North));
        });
        
        it ("should not be able to move off the East edge", function() {
            var oldX = arenaControllerMock.sizeX;
            var oldY = 10;
            var robot = robotController.CreateRobot(oldX, oldY, DirectionEnum.East);
            robotController.Move(robot);
            expect(robot.x).toEqual(oldX);
            expect(robot.y).toEqual(oldY);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.East));
        });
        
        it ("should not be able to move off the South edge", function() {
            var oldX = 10;
            var oldY = 0;
            var robot = robotController.CreateRobot(oldX, oldY, DirectionEnum.South);
            robotController.Move(robot);
            expect(robot.x).toEqual(oldX);
            expect(robot.y).toEqual(oldY);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.South));
        });
        
        it ("should not be able to move off the West edge", function() {
            var oldX = 0;
            var oldY = 10;
            var robot = robotController.CreateRobot(oldX, oldY, DirectionEnum.West);
            robotController.Move(robot);
            expect(robot.x).toEqual(oldX);
            expect(robot.y).toEqual(oldY);
            expect(JSON.stringify(robot.direction)).toEqual(JSON.stringify(DirectionEnum.West));
        });
    });
});