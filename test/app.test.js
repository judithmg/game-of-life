const GameOfLife = function () {
  this.previousUpdatedGen = [];
  this.currentUpdatedGen = [];

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
  };

  this.createNextGen = function (size, chart) {
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
  };

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

    return nextGenCell;
  };

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

  this.testingStates = {
    blinker: {
      initial: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      next: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
    },

    toad: {
      initial: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      next: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
    },

    beacon: {
      initial: [
        [0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0],
        [0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0],
        [0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      next: [
        [0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0],
      ],
    },
  };
};

describe("Given a new game on Game Of Life", () => {
  describe("When a new game is started with size of 10", () => {
    test("Then a 10x10 array filled with 0s should be created", () => {
      const game = new GameOfLife();
      game.createChart(10);
      expect(game.previousUpdatedGen).toEqual([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
      expect(game.currentUpdatedGen).toEqual([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
    });
  });
  describe("When a new game is started with size of 5", () => {
    test("Then a 5x5 array filled with 0s should be created", () => {
      const game = new GameOfLife();
      game.createChart(5);
      expect(game.previousUpdatedGen).toEqual([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
      expect(game.currentUpdatedGen).toEqual([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
    });
  });
  describe("When different patters are tested", () => {
    describe("When a BLINKER pattern is tested", () => {
      test("Then next gen should change", () => {
        const game = new GameOfLife();
        game.createChart(5);
        game.previousUpdatedGen,
          (game.currentUpdatedGen = [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
          ]);
        game.createNextGen(5, game.previousUpdatedGen);
        expect(game.currentUpdatedGen).toEqual(game.testingStates.blinker.next);
        expect(game.previousUpdatedGen).toEqual(
          game.testingStates.blinker.initial
        );
      });
    });
    describe("When a TOAD pattern is tested", () => {
      test("Then next gen should change", () => {
        const game = new GameOfLife();
        game.createChart(6);
        game.previousUpdatedGen,
          (game.currentUpdatedGen = game.testingStates.toad.initial);
        game.createNextGen(5, game.previousUpdatedGen);
        expect(game.currentUpdatedGen).toEqual(game.testingStates.toad.next);
        expect(game.previousUpdatedGen).toEqual(
          game.testingStates.toad.initial
        );
      });
    });
    describe("When a BEACON pattern is tested", () => {
      test("Then next gen should change", () => {
        const game = new GameOfLife();
        game.createChart(6);
        game.previousUpdatedGen,
          (game.currentUpdatedGen = game.testingStates.beacon.initial);

        game.createNextGen(5, game.previousUpdatedGen);
        expect(game.currentUpdatedGen).toEqual(game.testingStates.beacon.next);
        expect(game.previousUpdatedGen).toEqual(
          game.testingStates.beacon.initial
        );
      });
    });
  });
});
