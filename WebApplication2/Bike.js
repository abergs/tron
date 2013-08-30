var Bike = (function () {
    function Bike(startPosition, direction) {
        this.Positions = [];
        this.QuedMovement = [];
        this.Width = 4;
        this.Height = 4;
        this.Positions.push(startPosition);
        this.Positions.push(startPosition.GetNext(direction));
    }
    Bike.prototype.Turn = function (direction) {
        var lastPosition = this.GetLastPosition();
        var nextPosition = lastPosition.GetNext(direction);

        var positionTuple = new Tuple(lastPosition, nextPosition);

        var indexOfPreviousQuedMove = this.QuedMovement.map(function (coordTuple) {
            return coordTuple.toString();
        }).indexOf(positionTuple.toString());

        if (indexOfPreviousQuedMove == -1) {
            this.QuedMovement.push(positionTuple);
        }
    };

    Bike.prototype.GetLastPosition = function () {
        return this.Positions.slice(-1)[0];
    };

    Bike.prototype.ContinueMoving = function () {
        var lastPos = null;
        var newPos = null;

        if (this.QuedMovement.length == 0) {
            var direction = LineHelper.GetDirection(this.Positions);
            lastPos = this.GetLastPosition();
            newPos = lastPos.GetNext(direction);
        } else {
            var quedMove = this.QuedMovement.shift();
            lastPos = quedMove.Item1;
            newPos = quedMove.Item2;
        }
        this.MoveTo(newPos, lastPos);
    };

    Bike.prototype.MoveTo = function (newPosition, previousPosition) {
        var indexOfPrevious = this.Positions.map(function (coord) {
            return coord.toString();
        }).indexOf(previousPosition.toString());

        if (indexOfPrevious < this.Positions.length - 1) {
            console.log("out of sync");

            // we are out of sync and must reimplement path
            this.Positions.splice(indexOfPrevious + 1, this.Positions.length - indexOfPrevious);
        }

        this.Positions.push(newPosition);
    };

    Bike.prototype.GetLines = function () {
        return LineHelper.GetLines(this.Positions);
    };
    return Bike;
})();

var LineHelper = (function () {
    function LineHelper() {
    }
    LineHelper.GetDirection = function (coordsArray) {
        var coords = coordsArray.slice(0);
        var current = coords.pop();
        var previous = coords.pop();

        if (!previous || !current) {
            return Direction.Unkown;
        }

        if (current.X < previous.X)
            return Direction.Left;

        if (current.X > previous.X)
            return Direction.Right;

        if (current.Y < previous.Y)
            return Direction.Up;

        if (current.Y > previous.Y)
            return Direction.Down;

        return Direction.Unkown;
    };

    LineHelper.GetLines = function (coordinates) {
        var lines = [];
        var lastLine = null;

        coordinates.forEach(function (coordinate) {
            if (!lastLine) {
                lastLine = new Line(coordinate, coordinate);
                lines.push(lastLine);
            } else {
                if (lastLine.Start.X == coordinate.X || lastLine.Start.Y == coordinate.Y) {
                    lastLine.End = coordinate;
                } else {
                    // New line
                    lastLine = new Line(lastLine.End, coordinate);
                    lines.push(lastLine);
                }
            }
        });

        return lines;
    };
    return LineHelper;
})();

var Line = (function () {
    function Line(start, end) {
        this.Start = start;
        this.End = end;
    }
    return Line;
})();

var Coordinate = (function () {
    function Coordinate(x, y) {
        this.X = x;
        this.Y = y;
    }
    Coordinate.FromString = function (str) {
        var coordsFromString = str.split(",");
        var x = +coordsFromString[0];
        var y = +coordsFromString[1];
        return new Coordinate(x, y);
    };

    Coordinate.prototype.GetNext = function (direction) {
        if (direction == Direction.Up) {
            return new Coordinate(this.X, this.Y - 1);
        }

        if (direction == Direction.Down) {
            return new Coordinate(this.X, this.Y + 1);
        }

        if (direction == Direction.Right) {
            return new Coordinate(this.X + 1, this.Y);
        }

        if (direction == Direction.Left) {
            return new Coordinate(this.X - 1, this.Y);
        }

        return this;
    };

    Coordinate.prototype.toString = function () {
        return this.X + "," + this.Y;
    };
    return Coordinate;
})();

var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Unkown"] = 4] = "Unkown";
})(Direction || (Direction = {}));

var b = new Bike(new Coordinate(0, 0), Direction.Down);
console.log(b);
b.ContinueMoving();
b.ContinueMoving();
b.ContinueMoving();

b.MoveTo(new Coordinate(1, 3), new Coordinate(0, 3));

console.log(b);

var Tuple = (function () {
    function Tuple(item1, item2) {
        this.Item1 = null;
        this.Item2 = null;
        this.Item1 = item1;
        this.Item2 = item2;
    }
    Tuple.prototype.toString = function () {
        return this.Item1.toString() + "," + this.Item2.toString();
    };
    return Tuple;
})();
