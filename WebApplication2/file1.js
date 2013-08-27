var canvas = document.getElementById("the-game");
var context = canvas.getContext("2d");

var keys = {
    up: [38, 87],
    down: [40, 83],
    left: [37, 65],
    right: [39, 68],
    start_game: [13, 32]
};

//
var Player = (function () {
    function Player() {
        this.Id = "";
        this.color = '#92F15F';
        this.current_direction = "left";
        this.Name = "Player";
        this.StartPosition = "right";
        this.Directions = [];
        this.Cycle = null;
        this.Cycle = new LightBike(this);
        this.Reset();
    }
    Player.prototype.Reset = function () {
        this.Directions = [];

        if (this.StartPosition == "right") {
            this.Cycle.x = canvas.width - (canvas.width / (this.Cycle.width / 2) + 4);
            this.Cycle.y = (canvas.height / 2) + (this.Cycle.height / 2);
        } else {
            this.Cycle.x = (canvas.width / (this.Cycle.width / 2) - 4);
            this.Cycle.y = (canvas.height / 2) + (this.Cycle.height / 2);
        }
    };
    return Player;
})();

var LightBike = (function () {
    function LightBike(player) {
        this.width = 8;
        this.height = 8;
        this.x = 0;
        this.y = 0;
        this.player = player;
    }
    LightBike.prototype.Reset = function () {
        this.x = canvas.width - (canvas.width / (this.width / 2) + 4);
        this.y = (canvas.height / 2) + (this.height / 2);
        this.player.color = '#58BEFF';
    };

    LightBike.prototype.generateCoords = function () {
        return this.x + "," + this.y;
    };

    LightBike.prototype.draw = function () {
        context.fillStyle = this.player.color;
        context.beginPath();
        context.moveTo(this.x - (this.width / 2), this.y - (this.height / 2));
        context.lineTo(this.x + (this.width / 2), this.y - (this.height / 2));
        context.lineTo(this.x + (this.width / 2), this.y + (this.height / 2));
        context.lineTo(this.x - (this.width / 2), this.y + (this.height / 2));
        context.closePath();
        context.fill();
    };

    LightBike.prototype.move = function () {
        var direction = this.player.current_direction;

        if (this.player.Directions.length > 0) {
            direction = this.player.Directions.shift();
            this.player.current_direction = direction;
        }

        switch (direction) {
            case 'up':
                this.y -= this.height;
                break;
            case 'down':
                this.y += this.height;
                break;
            case 'right':
                this.x += this.width;
                break;
            case 'left':
                this.x -= this.width;
                break;
        }
        //coords = this.generateCoords();
        //console.log(coords);
        //coordsUsed.push(coords);
        //cycle.history.push(coords);
    };
    return LightBike;
})();

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
        this.context.fillText('press spacebar to contine', this.canvas.width / 2, this.canvas.height / 2 + (winner.Cycle.height * 3));
        winner.color = "#F00";
    };

    Game.prototype.ListenToEvents = function () {
        var _this = this;
        addEventListener("keydown", function (e) {
            var lastKey = getKey(e.keyCode);
            if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0 && lastKey != inverseDirection(_this.player)) {
                SendDirection(lastKey);
                _this.player.current_direction = lastKey;
            } else if (['start_game'].indexOf(lastKey) >= 0 && _this.over) {
                console.log(chat.server);
                chat.server.available();
            }
        }, false);
    };

    Game.prototype.checkCollision = function (cycle) {
        if ((cycle.x < (cycle.width / 2)) || (cycle.x > canvas.width - (cycle.width / 2)) || (cycle.y < (cycle.height / 2)) || (cycle.y > canvas.height - (cycle.height / 2)) || this.usedCoords.indexOf(cycle.generateCoords()) >= 0) {
            return true;
        }

        return false;
    };

    Game.prototype.loop = function () {
        var _this = this;
        if (this.started && this.over == false) {
            //console.log(this.players);
            this.players.forEach(function (iPlayer) {
                _this.usedCoords.push(iPlayer.Cycle.generateCoords());
                iPlayer.Cycle.move();
                iPlayer.Cycle.draw();
                if (_this.checkCollision(iPlayer.Cycle)) {
                    _this.stop(iPlayer);
                }
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
        case 'up':
            return 'down';
            break;
        case 'down':
            return 'up';
            break;
        case 'right':
            return 'left';
            break;
        case 'left':
            return 'right';
            break;
    }
}

var chat = $.connection.gameHub;
var game = new Game();

// Declare a proxy to reference the hub.
chat.client.receive = function (playerId, direction) {
    var player = game.GetPlayer(playerId);
    player.Directions.push(direction);
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
        var player = new Player();
        player.Id = playerDTO.Id;
        player.current_direction = playerDTO.StartDirection;
        player.StartPosition = playerDTO.StartPosition;
        player.Reset();
        player.color = playerDTO.Color;
        player.Name = playerDTO.Name;

        game.players.push(player);

        if (chat.connection.id == player.Id) {
            game.player = player;
        }
    });

    game.start();
};
