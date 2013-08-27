class Bike {
    public Positions: Coordinate[] = [];
    public Width: number = 4;
    public Height: number = 4;
    constructor(startPosition: Coordinate, direction: Direction) {
        this.Positions.push(startPosition);
        this.Positions.push(startPosition.GetNext(direction));
    }

    Turn(direction: Direction) {
        var lastPosition: Coordinate = this.GetLastPosition();
        var nextPosition: Coordinate = lastPosition.GetNext(direction);
        this.MoveTo(nextPosition, lastPosition);
    }

    private GetLastPosition(): Coordinate {
        return this.Positions.slice(-1)[0];
    }

    ContinueMoving() {
        var direction = LineHelper.GetDirection(this.Positions);
        var lastPos = this.GetLastPosition();
        var newPos = lastPos.GetNext(direction);
        this.MoveTo(newPos, lastPos);
    }

    MoveTo(newPosition: Coordinate, previousPosition: Coordinate) {

        var indexOfPrevious = this.Positions.map((coord: Coordinate) => {
            return coord.toString();
        }).indexOf(previousPosition.toString());

        if (indexOfPrevious < this.Positions.length - 1) {
            console.log("out of sync");
            // we are out of sync and must reimplement path
            this.Positions.splice(indexOfPrevious + 1, this.Positions.length - indexOfPrevious);
        }

        this.Positions.push(newPosition);
    }

    GetLines():Line[] {
        return LineHelper.GetLines(this.Positions);
    }
}

class LineHelper {
    static GetDirection(coordsArray: Coordinate[]): Direction {
        var coords = coordsArray.slice(0);
        var current: Coordinate = coords.pop();
        var previous: Coordinate = coords.pop();

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
    }

    static GetLines(coordinates: Coordinate[]): Line[] {
        var lines: Line[] = [];
        var lastLine: Line = null;

        coordinates.forEach((coordinate: Coordinate) => {
            if (!lastLine) {
                lastLine = new Line(coordinate, coordinate);
                lines.push(lastLine);
            } else {
                // Same line
                if (lastLine.Start.X == coordinate.X ||
                    lastLine.Start.Y == coordinate.Y) {
                    lastLine.End = coordinate;
                } else {
                    // New line
                    lastLine = new Line(lastLine.End, coordinate);
                    lines.push(lastLine);
                }
            }
        });

        return lines;
    }
}

class Line {
    Start: Coordinate;
    End: Coordinate;

    constructor(start: Coordinate, end: Coordinate) {
        this.Start = start;
        this.End = end;
    }
}

class Coordinate {
    X: number;
    Y: number;

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }

    static FromString(str: string) {
        var coordsFromString = str.split(",");
        var x: number = +coordsFromString[0];
        var y: number = +coordsFromString[1];
        return new Coordinate(x,y);
    }

    GetNext(direction: Direction) {
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
    }

    toString() {
        return this.X + "," + this.Y;
    }
}

enum Direction {
    Up,
    Right,
    Down,
    Left,
    Unkown
}

var b = new Bike(new Coordinate(0, 0), Direction.Down);
console.log(b);
b.ContinueMoving();
b.ContinueMoving();
b.ContinueMoving();

b.MoveTo(new Coordinate(1, 3), new Coordinate(0, 3));

console.log(b);