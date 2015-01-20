var rewire = require("rewire");
var ArenaModel = require("../../models/arena.js");
var DirectionEnum = require("../../models/direction.js");
var RobotModel = require("../../models/robot.js");

describe("Arena Controller :: ", function () {
    var arenaController = null;
    beforeEach(function () {
        arenaController = rewire("../../controllers/arenaController.js");
    });
    
    describe("Arena Creation", function ()
    {
        it("should allow creation of square arenas", function () {
            arenaController.CreateArena(5, 5);
            expect(arenaController.__get__("arena").sizeX).toEqual(5);
            expect(arenaController.__get__("arena").sizeY).toEqual(5);
        });
        
        it("should allow creation of rectangular arenas", function () {
            arenaController.CreateArena(5, 10);
            expect(arenaController.__get__("arena").sizeX).toEqual(5);
            expect(arenaController.__get__("arena").sizeY).toEqual(10);
        });
    });
    
    describe("Arena Creation Error Handling", function ()
    {
        it("should error on creation of 0 size arenas (width)", function () {
            expect(function() { arenaController.CreateArena(0, 10) }).toThrow("Arena is zero size!");
        });
        
        it("should error on creation of 0 size arenas (height)", function () {
            expect(function() { arenaController.CreateArena(10, 0) }).toThrow("Arena is zero size!");
        });
        
        it("should error on creation of 0 size arenas (width and height)", function () {
            expect(function() { arenaController.CreateArena(0, 0) }).toThrow("Arena is zero size!");
        });
    });
    
    describe("Arena Ready", function () {
       it("should report the arena as not being ready if it has not been created", function() {
           expect(arenaController.ArenaReady()).toEqual(false);
       });
       it("should report the arena as being ready if it exists", function() {
           arenaController.CreateArena(200, 250);
           expect(arenaController.ArenaReady()).toEqual(true);
       });
    });
    
    describe("Adding and Retrieving Robots", function () {
        var RobotMock = { x: 2, y: 2, direction: DirectionEnum.North };
        beforeEach(function () {
            arenaController.CreateArena(200, 200);
        })
        
        it("should allow robots to be added to the arena", function () {
            arenaController.AddRobot(RobotMock);
            expect(arenaController.GetRobotForCommands()).toEqual(RobotMock);
        })
        
        it("should complain if we try and get a robot when there is none", function () {
            expect(arenaController.GetRobotForCommands()).toThrow("arena has no robots!");
        });
    });

    describe("Checking validity of spaces :: ", function () {
        var RobotMock = { x: 2, y: 2, direction: DirectionEnum.North };
        beforeEach(function () {
            arenaController.CreateArena(200, 200);
            arenaController.AddRobot(RobotMock);
        })
        
        describe("Outside of the arena", function () {
            it("above and to the left is invalid", function () {
                expect(arenaController.CheckIsSpaceValid(250, -100)).toEqual(false);
            });
            
            it("above is invalid", function () {
                expect(arenaController.CheckIsSpaceValid(250, 150)).toEqual(false);
            });
            
            it("above and to the right is invalid", function () {
                expect(arenaController.CheckIsSpaceValid(250, 250)).toEqual(false);
            });
            
            it("to the left is invalid", function () {
                expect(arenaController.CheckIsSpaceValid(-50, 100)).toEqual(false);
            });
            
            it("to the right is invalid", function () {
                expect(arenaController.CheckIsSpaceValid(250, 100)).toEqual(false);
            });
            
            it("below and to the left is invalid", function () {
                expect(arenaController.CheckIsSpaceValid(-100, -100)).toEqual(false);
            });
            
            it("below is invalid", function () {
                expect(arenaController.CheckIsSpaceValid(100, -100)).toEqual(false);
            });
            
            it("below and to the right is invalid", function () {
                expect(arenaController.CheckIsSpaceValid(250, -100)).toEqual(false);
            });
        });
    })

});