let tableElement = document.querySelector(".table-container");

export default function GameOfLife() {
  this.previousUpdatedGen = [];
  this.currentUpdatedGen = [];
  this.currentCellStatus = 0;
  this.counter = 0;
  //This function creates the first gen, with all DEAD CELLS (0)
  //Also asigns all dead cells to the "updated gen"
  this.createChart = function (size) {
    for (let i = 0; i < size; i++) {
      let currentRow = [];
      for (let j = 0; j < size; j++) {
        currentRow.push(0);
      }
      this.previousUpdatedGen.push(currentRow);
    }
    for (let i = 0; i < size; i++) {
      let currentRow = [];
      for (let j = 0; j < size; j++) {
        currentRow.push(0);
      }
      this.currentUpdatedGen.push(currentRow);
    }
    this.interactiveChart(size, this.previousUpdatedGen);
  };

  //This function creates the next generation. For each cell, using the parameters obtained after counting the surrounding neighbours, it updates its state
  //CHART INPUT MUST BE THE GEN THAT IS ABOUT TO BE UPDATED
  this.createNextGen = function (size, chart) {
    this.countGens();
    this.previousUpdatedGen = [...this.currentUpdatedGen];
    this.currentUpdatedGen = [...chart];
    for (let i = 0; i < size; i++) {
      let thisRow = [...this.currentUpdatedGen[i]];
      for (let j = 0; j < size; j++) {
        let nextGenCell = this.updateCurrentCell(i, j, this.previousUpdatedGen);

        thisRow[j] = nextGenCell;
      }
      this.currentUpdatedGen[i] = [...thisRow];
    }
    //this.interactiveChart(size, this.previousUpdatedGen);
  };

  // Any live cell with two or three live neighbours survives.
  // Any dead cell with three live neighbours becomes a live cell.
  // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
  this.updateCurrentCell = function (i, j, chart) {
    let currentCell = chart[i][j];
    let nextGenCell;
    //This variable stores the state of the cell i'm checking but for ITS NEXT GEN because the current gen must stay the same state!!
    let surroundingCellsAlive = this.checkNeighbours(
      i,
      j,
      this.previousUpdatedGen
    );

    if (currentCell === 1 && surroundingCellsAlive < 2) {
      nextGenCell = 0;
    } else if (
      currentCell === 1 &&
      (surroundingCellsAlive === 2 || surroundingCellsAlive === 3)
    ) {
      nextGenCell = 1;
    } else if (currentCell === 1 && surroundingCellsAlive > 3) {
      nextGenCell = 0;
    } else if (currentCell === 0 && surroundingCellsAlive === 3) {
      nextGenCell = 1;
    } else {
      nextGenCell = currentCell;
    }
    this.currentCellStatus = nextGenCell;
    this.updateState(j, i);

    return nextGenCell;
  };

  //For a given cell, it checks its surrounding neighbours
  this.checkNeighbours = function (i, j, chart) {
    let previousRow = chart[i - 1] || false;
    let currentRow = chart[i];
    let nextRow = chart[i + 1] || false;

    let aliveAroundCurrent =
      +!!previousRow[j - 1] +
      +!!previousRow[j] +
      +!!previousRow[j + 1] +
      +!!currentRow[j + 1] +
      +!!currentRow[j - 1] +
      +!!nextRow[j - 1] +
      +!!nextRow[j] +
      +!!nextRow[j + 1];

    return aliveAroundCurrent;
  };

  //When the 'RANDOMIZE' button is clicked, this function will run through the already created chart, and will randomly update its values

  this.randomizeChart = function (size) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        this.previousUpdatedGen[i][j] = randomizeNumber(0, 1);
        this.currentUpdatedGen[i][j] = this.previousUpdatedGen[i][j];
      }
    }
    this.interactiveChart(size, this.previousUpdatedGen);
  };

  //This function will create the chart shown on the website
  this.interactiveChart = function (size, chart) {
    tableElement.innerHTML = "";
    for (let i = 0; i < size; i++) {
      let newRow = document.createElement("div");
      newRow.classList.add(`row-${i}`);
      newRow.classList.add(`row`);
      tableElement.appendChild(newRow);

      for (let j = 0; j < size; j++) {
        let cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.classList.add(`cell-${j}-${i}`);
        if (chart[i][j] === 0) {
          cellDiv.classList.add("is-dead");
        } else {
          cellDiv.classList.add("is-alive");
          cellDiv.style.backgroundColor = colorPalette[randomizeNumber(0, 7)];
        }
        cellDiv.addEventListener("click", () => {
          this.addStateClass(cellDiv, i, j);
        });
        newRow.appendChild(cellDiv);
      }
    }
  };

  this.updateState = function (j, i) {
    let thisCell = document.querySelector(`.cell-${j}-${i}`);
    if (this.currentCellStatus === 1) {
      thisCell.classList.remove("is-dead");
      thisCell.classList.add("is-alive");
      thisCell.style.backgroundColor = colorPalette[randomizeNumber(0, 7)];
    } else {
      thisCell.classList.add("is-dead");
      thisCell.classList.remove("is-alive");
      thisCell.style.backgroundColor = "";
    }
  };

  this.countGens = function () {
    document.querySelector("#gens").innerHTML = this.counter;
    this.counter++;
  };

  this.clearCounter = function () {
    this.counter = 0;
    document.querySelector("#gens").innerHTML = this.counter;
  };

  //This function adds the class-name to each cell that will give it its corresponding color
  this.addStateClass = function (cell, i, j) {
    if (cell.classList.contains("is-alive")) {
      cell.classList.add("is-dead");
      cell.classList.remove("is-alive");
      cell.style.backgroundColor = "";

      this.currentUpdatedGen[i][j] = 0;
      this.previousUpdatedGen[i][j] = 0;
    } else {
      cell.classList.remove("is-dead");
      cell.classList.add("is-alive");
      cell.style.backgroundColor = colorPalette[randomizeNumber(0, 7)];

      this.currentUpdatedGen[i][j] = 1;
      this.previousUpdatedGen[i][j] = 1;
    }
  };
};

/* EVENT LISTENERS */

let setTimer = false;

function startGame() {
  if (setTimer) return;
  setTimer = setInterval(() => {
    game.createNextGen(setSize(), game.previousUpdatedGen);
  }, setSpeed());
}

function stopGame() {
  clearInterval(setTimer);
  setTimer = false;
}

document
  .querySelector("#start-game")
  .addEventListener("click", () => startGame());
document
  .querySelector("#stop-game")
  .addEventListener("click", () => stopGame());

document
  .querySelector("#size-cols")
  .addEventListener("change", () => setSize());

document.querySelector("#get-table").addEventListener("click", () => {
  drawMe();
  game.clearCounter();
});

document.querySelector("#set-speed").addEventListener("change", () => {
  stopGame();
  startGame();
});

document.querySelector("#randomize").addEventListener("click", () => {
  game.randomizeChart(setSize());
});

function setSpeed() {
  return parseInt(document.querySelector("#set-speed").value);
}

function setSize() {
  return parseInt(document.querySelector("#size-cols").value);
}

const game = new GameOfLife();
game.createChart(setSize());

function drawMe() {
  game.currentUpdatedGen = [];
  game.previousUpdatedGen = [];
  game.createChart(setSize());
}

const colorPalette = [
  "#F8B195",
  "#F67280",
  "#C06C84",
  "#6C5B7B",
  "#355C7D",
  "#F8B195",
  "#F67280",
  "#C06C84",
];

function randomizeNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
