// Maze Generator Class
class Cell {
  constructor(config, index) {
    this.x = config.x;
    this.y = config.y;
    this.walls = [];
    this.visited = false;
  }
}

export default class Maze {
  constructor(config) {
    this.config = config;
  }

  generateMaze = (cols, rows) => {
    const totalCells = cols * rows;
    let cells = new Array();
    let unvis = new Array();

    for (let r = 0; r < rows ; r++) {
      cells[r] = new Array();
      unvis[r] = new Array();
      for (let c = 0; c <cols; c++) {
        cells[r][c] = [0,0,0,0];
        unvis[r][c] = true;
      }
    }

    // Set a random position to start from
    let currentCell = this.config.start || [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
    let startingPoint = {
      y: currentCell[0],
      x: currentCell[1]
    };
    let path = [currentCell];
    unvis[currentCell[0]][currentCell[1]] = false;
    let visited = 1;
    let next;

    // Loop through all available cell positions
    while (visited < totalCells) {
      // Determine neighboring cells
      let pot = [
        [currentCell[0] - 1, currentCell[1], 0, 2], // top
        [currentCell[0], currentCell[1] + 1, 1, 3], // right
        [currentCell[0] + 1, currentCell[1], 2, 0], // bottom
        [currentCell[0], currentCell[1] - 1, 3, 1] // left
      ];
      console.log(pot);
      let neighbors = new Array();

      // Determine if each neighboring cell is in game grid, and whether it has already been checked
      for (var l = 0; l < 4; l++) {
        if (pot[l][0] > -1 && pot[l][0] < rows && pot[l][1] > -1 && pot[l][1] < cols && unvis[pot[l][0]][pot[l][1]]) {
          neighbors.push(pot[l]);
        }
      }

      // If at least one active neighboring cell has been found
      if (neighbors.length) {
        // Choose one of the neighbors at random
        next = neighbors[Math.floor(Math.random() * neighbors.length)];

        // Remove the wall between the current cell and the chosen neighboring cell
        cells[currentCell[0]][currentCell[1]][next[2]] = 1;
        cells[next[0]][next[1]][next[3]] = 1;

        // Mark the neighbor as visited, and set it as the current cell
        unvis[next[0]][next[1]] = false;
        visited++;
        currentCell = [next[0], next[1]];
        path.push(currentCell);
      } else {
        currentCell = path.pop();
      }
    }
    return {
      maze: cells,
      path: path,
      start: startingPoint
    };
  };
}
