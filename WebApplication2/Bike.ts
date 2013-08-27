class Bike {
    Positions: Coordinate[];

    constructor(startPosition: Coordinate, direction: Direction) {
        this.Positions.push(startPosition);
        this.Positions.push(startPosition.GetNext(direction));
    }

}

class LineHelper {
    GetLines(coordinates: Coordinate[]): Line[] {
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
                    //lines.push(lastLine);
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

    GetNext(direction: Direction) {
        if (direction == Direction.Up) {
            return new Coordinate(this.X, this.Y--);
        }

        if (direction == Direction.Down) {
            return new Coordinate(this.X, this.Y++);
        }

        if (direction == Direction.Right) {
            return new Coordinate(this.X++, this.Y);
        }

        if (direction == Direction.Left) {
            return new Coordinate(this.X--, this.Y);
        }

        return this;
    }


}

enum Direction {
    Up,
    Right,
    Down,
    Left
}

