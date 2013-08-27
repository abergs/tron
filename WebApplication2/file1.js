/// <reference path="Bike.ts" />
var canvas = document.getElementById("the-game");
var context = canvas.getContext("2d");

var keys = {
    Up: [38, 87],
    Down: [40, 83],
    Left: [37, 65],
    Right: [39, 68],
    start_game: [13, 32]
};

//
var Player = (function () {
    //Cycle: LightBike = null;
    function Player() {
        this.Id = "";
        this.color = '#92F15F';
        this.Name = "Player";
        this.startingPos = new Coordinate(0, 0);
        this.startingDirection = Direction.Right;

        // this.Cycle = new LightBike(this);
        //this.Bike = new Bike(new Coordinate(0,0),Direction.Right);
        this.Reset();
    }
    Player.prototype.Reset = function () {
        this.Bike = new Bike(this.startingPos, this.startingDirection);
        //this.Directions = [];
        //if (this.StartPosition == "right") {
        //    this.Cycle.x = canvas.width - (canvas.width / (this.Cycle.width / 2) + 4);
        //    this.Cycle.y = (canvas.height / 2) + (this.Cycle.height / 2);
        //}
        //else {
        //    this.Cycle.x = (canvas.width / (this.Cycle.width / 2) - 4);
        //    this.Cycle.y = (canvas.height / 2) + (this.Cycle.height / 2);
        //}
    };
    return Player;
})();

//class LightBike {
//    width = 8;
//    height = 8;
//    x: number = 0;
//    y: number = 0;
//    player: Player;
//    constructor(player: Player) {
//        this.player = player;
//    }
//    Reset() {
//        this.x = canvas.width - (canvas.width / (this.width / 2) + 4);
//        this.y = (canvas.height / 2) + (this.height / 2);
//        this.player.color = '#58BEFF';
//    }
//    generateCoords(): string {
//        return this.x + "," + this.y;
//    }
//    draw() {
//        context.fillStyle = this.player.color;
//        context.beginPath();
//        context.moveTo(this.x - (this.width / 2), this.y - (this.height / 2));
//        context.lineTo(this.x + (this.width / 2), this.y - (this.height / 2));
//        context.lineTo(this.x + (this.width / 2), this.y + (this.height / 2));
//        context.lineTo(this.x - (this.width / 2), this.y + (this.height / 2));
//        context.closePath();
//        context.fill();
//    }
//    move() {
//        var direction = this.player.current_direction;
//        if(this.player.Directions.length > 0) {
//            direction = this.player.Directions.shift();
//            this.player.current_direction = direction;
//        }
//        switch (direction) {
//            case 'up':
//                this.y -= this.height;
//                break;
//            case 'down':
//                this.y += this.height;
//                break;
//            case 'right':
//                this.x += this.width;
//                break;
//            case 'left':
//                this.x -= this.width;
//                break;
//        }
//        //coords = this.generateCoords();
//        //console.log(coords);
//        //coordsUsed.push(coords);
//        //cycle.history.push(coords);
//    }
//}
var Game = (function () {
    function Game() {
        var _this = this;
        this.usedCoords = [];
        this.started = false;
        this.over = false;
        this.player = new Player();
        this.players = [];
        this.canvas = document.getElementById("the-game");
        this.context = this.canvas.getContext("2d");
        this.SetupScreen();

        $.connection.hub.start().done(function (data) {
            chat.server.setProfile(game.player.Name, game.player.color);
            console.log("START", data);
            console.log("Connection", $.connection());
            console.log("chat", chat);
        });

        this.ListenToEvents();
        setInterval(function () {
            return _this.loop();
        }, 100);
    }
    Game.prototype.SetupScreen = function () {
        var name = localStorage.getItem("name");
        var color = localStorage.getItem("color");

        if (!name) {
            name = prompt("Nickname", "Seagul" + new Date().getSeconds());
        }

        var colors = ["red", "green", "red", "yellow", "orange", "pink"];
        if (!color) {
            color = prompt("Your color (blue, green, red, yellow, orange, pink", colors[Math.floor(Math.random() * colors.length)]);
            if (colors.indexOf(color) == -1) {
                color = colors[Math.floor(Math.random() * colors.length)];
            }
        }

        localStorage.setItem("name", name);
        localStorage.setItem("color", color);

        this.player.color = color;
        this.player.Name = name;
    };

    Game.prototype.GetPlayer = function (playerId) {
        //console.log(this.players);
        var player = null;
        this.players.forEach(function (_player) {
            if (_player.Id == playerId) {
                player = _player;
            }
        });

        return player;
    };

    Game.prototype.Reset = function () {
        this.over = false;
        this.started = false;

        this.players.forEach(function (p) {
            p.Reset();
        });

        this.players = [];
        this.ResetCanvas();
        this.usedCoords = [];
    };

    Game.prototype.start = function () {
        this.started = true;
    };

    Game.prototype.ResetCanvas = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    Game.prototype.stop = function (winner) {
        this.over = true;
        this.context.fillStyle = '#FFF';
        this.context.font = (this.canvas.height / 15) + 'px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText('GAME OVER - ' + winner.Name + ' LOSES', this.canvas.width / 2, this.canvas.height / 2);
        this.context.fillText('press spacebar to contine', this.canvas.width / 2, this.canvas.height / 2 + (winner.Bike.Height * 3));
        winner.color = "#F00";
    };

    Game.prototype.ListenToEvents = function () {
        var _this = this;
        addEventListener("keydown", function (e) {
            var lastKey = getKey(e.keyCode);
            if (['Up', 'Down', 'Left', 'Right'].indexOf(lastKey) >= 0 && lastKey != inverseDirection(_this.player)) {
                //SendDirection(lastKey);
                var direction = Direction.Unkown;

                if (lastKey == "Up")
                    direction = Direction.Up;
                if (lastKey == "Right")
                    direction = Direction.Right;
                if (lastKey == "Down")
                    direction = Direction.Down;
                if (lastKey == "Left")
                    direction = Direction.Left;

                _this.player.Bike.Turn(direction);
            } else if (['start_game'].indexOf(lastKey) >= 0 && _this.over) {
                console.log(chat.server);
                chat.server.available();
            }
        }, false);
    };

    Game.prototype.checkCollision = function (cycle) {
        //if ((cycle.x < (cycle.width / 2)) ||
        //    (cycle.x > canvas.width - (cycle.width / 2)) ||
        //    (cycle.y < (cycle.height / 2)) ||
        //    (cycle.y > canvas.height - (cycle.height / 2)) ||
        //    this.usedCoords.indexOf(cycle.generateCoords()) >= 0) {
        //    return true;
        //}
        return false;
    };

    Game.prototype.Draw = function (player) {
        context.fillStyle = player.color;
        player.Bike.GetLines().forEach(function (line) {
            context.beginPath();
            context.moveTo(line.Start.X, line.Start.Y);
            context.lineTo(line.End.X, line.End.Y);

            //context.lineTo(this.x + (this.width / 2), this.y + (this.height / 2));
            //context.lineTo(this.x - (this.width / 2), this.y + (this.height / 2));
            context.stroke();
            context.closePath();
        });

        context.fill();
    };

    Game.prototype.loop = function () {
        var _this = this;
        if (this.started && this.over == false) {
            //console.log(this.players);
            this.players.forEach(function (iPlayer) {
                iPlayer.Bike.ContinueMoving();
                _this.Draw(iPlayer);
                //this.usedCoords.push(iPlayer.Cycle.generateCoords());
                //iPlayer.Cycle.move();
                //iPlayer.Cycle.draw();
                //if (this.checkCollision(iPlayer.Cycle)) {
                //    this.stop(iPlayer);
                //}
            });
        }
    };
    return Game;
})();

function getKey(value) {
    for (var key in keys) {
        if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0) {
            return key;
        }
    }
    return null;
}

function inverseDirection(player) {
    switch (player.current_direction) {
        case 'Up':
            return 'Down';
            break;
        case 'Down':
            return 'Up';
            break;
        case 'Right':
            return 'Left';
            break;
        case 'Left':
            return 'Right';
            break;
    }
}

var chat = $.connection.gameHub;
var game = new Game();

// Declare a proxy to reference the hub.
chat.client.receive = function (playerId, direction) {
    var player = game.GetPlayer(playerId);
    //player.Directions.push(direction);
    //player.current_direction = direction;
};

function SendDirection(direction) {
    chat.server.send(GAMEDATA.GroupName, direction);
}

var GAMEDATA = null;

chat.client.start = function (gameData) {
    console.log("START EVENT", gameData);
    GAMEDATA = gameData;

    game.Reset();

    gameData.Players.forEach(function (playerDTO) {
        //var player = new Player();
        //player.Id = playerDTO.Id;
        //player.current_direction = playerDTO.StartDirection;
        //player.StartPosition = playerDTO.StartPosition;
        //player.Reset();
        //player.color = playerDTO.Color;
        //player.Name = playerDTO.Name;
        //game.players.push(player);
        //if (chat.connection.id == player.Id) {
        //    game.player = player;
        //}
    });

    game.start();
};
var player = new Player();
player.Id = "1";
player.Reset();
player.color = "#FF0000";
player.Name = "anders";

game.players.push(player);
game.player = player;
game.start();
