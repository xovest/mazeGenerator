let maze = document.querySelector('.maze');
let ctx = maze.getContext('2d');

let cur;

class Maze {
  constructor(size, rows, cols) {
    this.size = size;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.stack = [];
  }

  setup() {
    for (let r = 0; r < this.rows; ++r) {
      let row = [];
      for (let c = 0; c < this.cols; ++c) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    cur = this.grid[0][0];
  }
  
  draw() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = 'green'; 
    cur.visited = true;
    
    for (let r = 0; r < this.rows; ++r) {
      for (let c = 0; c < this.cols; ++c) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.rows, this.cols);
      }
    }

    let next = cur.checkNeighbours();
    if (next) {
      next.visited = true;

      this.stack.push(cur);

      cur.highlight(this.cols);
      cur.removeWall(cur, next);
      cur = next;
    } else if (this.stack.length > 0) {
      let cell = this.stack.pop();
      cur = cell;
      cur.highlight(this.cols);
    }

    if (this.stack.length == 0) {
      return;
    }

    window.requestAnimationFrame(() => {
      this.draw();
    })
  }
}

class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
    this.visited = false;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true
    };
  }

  checkNeighbours() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;
    let neighbours = [];

    let top = row !== 0 ? grid[row - 1][col] : undefined;
    let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col !== 0 ? grid[row][col - 1] : undefined;

    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }

  drawTopWall(x, y, size, cols, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / cols, y);
    ctx.stroke();
  }

  drawRightWall(x, y, size, cols, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / cols, y);
    ctx.lineTo(x + size / cols, y + size / rows);
    ctx.stroke();
  }

  drawBottomWall(x, y, size, cols, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x + size / cols, y + size / rows);
    ctx.stroke();
  }

  drawLeftWall(x, y, size, cols, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }

  highlight(cols) {
    let x = this.colNum * this.parentSize / cols + 1;
    let y = this.rowNum * this.parentSize / cols + 1;

    ctx.fillStyle = 'pink';
    ctx.fillRect(x, y, this.parentSize / cols - 3, this.parentSize / cols - 3);
  }

  removeWall(c1, c2) {
    let x = c1.colNum - c2.colNum;

    if (x == 1) {
      c1.walls.leftWall = false;
      c2.walls.rightWall = false;
    } else if (x == -1) {
      c1.walls.rightWall = false;
      c2.walls.leftWall = false;
    }

    let y = c1.rowNum - c2.rowNum;
    if (y == 1) {
      c1.walls.topWall = false;
      c2.walls.bottomWall = false;
    } else if (y == -1) {
      c1.walls.bottomWall = false;
      c2.walls.topWall = false;
    }
  }

  show(size, rows, cols) {
    let x = this.colNum * size / cols;
    let y = this.rowNum * size / rows;

    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'green';
    ctx.lineWidth = 2;

    if (this.walls.topWall) this.drawTopWall(x, y, size, cols, rows);
    if (this.walls.rightWall) this.drawRightWall(x, y, size, cols, rows);
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, cols, rows);
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, cols, rows);
    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / cols - 2, size / rows - 2);
    }
  }
}

let newMaze = new Maze(500, 20, 20);
newMaze.setup();
newMaze.draw();