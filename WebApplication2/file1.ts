/// <reference path="Bike.ts" />
var canvas: any = document.getElementById("the-game");
var context = canvas.getContext("2d");

var keys = {
    Up: [38, 87],
    Down: [40, 83],
    Left: [37, 65],
    Right: [39, 68],
    start_game: [13, 32]
};

//

class Player {
    Id: string = "";
    color: string = '#92F15F';
    Name: string = "Player";

    Bike: Bike;

    private startingPos: Coordinate;
    private startingDirection: Direction;
    //Cycle: LightBike = null;
    constructor(startingPos: Coordinate, direction: Direction) {
        this.startingPos = startingPos;
        this.startingDirection = direction;
        // this.Cycle = new LightBike(this);
        //this.Bike = new Bike(new Coordinate(0,0),Direction.Right);
        this.Reset();
    }

    Reset() {
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
    }
}

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

class Game {
    usedCoords: string[] = [];
    started: boolean = false;
    over: boolean = false;

    player: Player = new Player(new Coordinate(0,0),Direction.Unkown);
    players: Player[] = [];

    canvas: any = document.getElementById("the-game");
    context = this.canvas.getContext("2d");

    constructor() {
        this.SetupScreen();

        $.connection.hub.start().done(function (data) {
            chat.server.setProfile(game.player.Name, game.player.color);
            console.log("START", data);
            console.log("Connection", $.connection());
            console.log("chat", chat);
        });

        this.ListenToEvents();
        setInterval(() => this.loop(), 100);
    }

    SetupScreen() {
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
    }

    GetPlayer(playerId): Player {
        //console.log(this.players);
        var player = null;
        this.players.forEach((_player) => {
            //console.log(player.Id, playerId);
            if (_player.Id == playerId) {
                player = _player;
            }
        });

        return player;
    }

    Reset() {
        this.over = false;
        this.started = false;

        this.players.forEach((p) => {
            p.Reset();
        });

        this.players = [];
        this.ResetCanvas();
        this.usedCoords = [];
    }

    start() {
        this.started = true;
    }

    ResetCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    stop(winner: Player) {
        this.over = true;
        this.context.fillStyle = '#FFF';
        this.context.font = (this.canvas.height / 15) + 'px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText('GAME OVER - ' + winner.Name + ' LOSES', this.canvas.width / 2, this.canvas.height / 2);
        this.context.fillText('press spacebar to contine', this.canvas.width / 2, this.canvas.height / 2 + (winner.Bike.Height * 3));
        winner.color = "#F00";
    }

    ListenToEvents() {
        addEventListener("keydown",
            (e) => {
                var lastKey = getKey(e.keyCode);
                if (['Up', 'Down', 'Left', 'Right'].indexOf(lastKey) >= 0 && lastKey != inverseDirection(this.player)) {
                    //SendDirection(lastKey);
                    var direction: Direction = Direction.Unkown;

                    if (lastKey == "Up")
                        direction = Direction.Up;
                    if (lastKey == "Right")
                        direction = Direction.Right;
                    if (lastKey == "Down")
                        direction = Direction.Down;
                    if (lastKey == "Left")
                        direction = Direction.Left;

                    this.player.Bike.Turn(direction);
                } else if (['start_game'].indexOf(lastKey) >= 0 && this.over) {
                    console.log(chat.server);
                    chat.server.available();
                }
            }, false);
    }

    checkCollision(cycle: Bike): boolean {
        //if ((cycle.x < (cycle.width / 2)) ||
        //    (cycle.x > canvas.width - (cycle.width / 2)) ||
        //    (cycle.y < (cycle.height / 2)) ||
        //    (cycle.y > canvas.height - (cycle.height / 2)) ||
        //    this.usedCoords.indexOf(cycle.generateCoords()) >= 0) {
        //    return true;
        //}

        return false;
    }

    Draw(player: Player) {
        context.strokeStyle = player.color;
        player.Bike.GetLines().forEach((line) => {
            context.beginPath();
            context.moveTo(line.Start.X, line.Start.Y);
            context.lineTo(line.End.X, line.End.Y);
            //context.lineTo(this.x + (this.width / 2), this.y + (this.height / 2));
            //context.lineTo(this.x - (this.width / 2), this.y + (this.height / 2));
            context.stroke();
            context.closePath();
        });

        context.fill();
    }

    loop() {
        if (this.started && this.over == false) {
            //console.log(this.players);
            this.players.forEach((iPlayer) => {
                iPlayer.Bike.ContinueMoving();
                this.Draw(iPlayer);
                //this.usedCoords.push(iPlayer.Cycle.generateCoords());
                //iPlayer.Cycle.move();
                //iPlayer.Cycle.draw();
                //if (this.checkCollision(iPlayer.Cycle)) {

                //    this.stop(iPlayer);
                //}
            });
        }
    }
}

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

//var me = new Player();
//me.StartPosition = "left";
//me.current_direction = "right";

//game.player = me;
//game.players.push(me);


declare var $: any;

// Declare a proxy to reference the hub.


chat.client.receive = function (playerId, direction) {
    var player = game.GetPlayer(playerId);
    //player.Directions.push(direction);
    //player.current_direction = direction;
}

function SendDirection(direction) {
    chat.server.send(GAMEDATA.GroupName, direction);
}

var GAMEDATA = null;

chat.client.start = function (gameData) {
    console.log("START EVENT", gameData);
    GAMEDATA = gameData;

    game.Reset();

    gameData.Players.forEach((playerDTO) => {
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
}
var player = new Player(new Coordinate(0, 0), Direction.Right);
player.Id = "1";
player.Reset();
player.color = "#FF0000";
player.Name = "anders";

game.players.push(player);
game.player = player;

var player2 = new Player(new Coordinate(200, 100), Direction.Left);
player2.Id = "2";
player2.Reset();
player2.color = "#0000FF";
player2.Name = "anders";

game.players.push(player2);

game.start();