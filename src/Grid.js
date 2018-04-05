import React, { Component } from 'react';
import clone from 'clone';

import Cell from './Cell';

const ROWS = 8;
const COLUMNS = 8;
const PLAYERS = ['red', 'black'];

const buildGrid = () => {
  const rows = [];

  for (let r = 0; r < ROWS; r++) {
    const row = [];

    for (let c = 0; c < COLUMNS; c++) {
      row.push(null);
    }

    rows.push(row);
  }

  return rows;
}

const validateCells = (cells) => {
  return cells.filter(cell => cell[0] >= 0 && cell[1] >= 0)
};

class Grid extends Component {
  constructor(props) {
    super(props);

    const grid = buildGrid();

    this.state = {
      grid,
      turn: PLAYERS[0]
    };

    this.onCellClick = this.onCellClick.bind(this);
  }

  getNextPlayer() {
    const currentPlayer = this.state.turn;
    const currentIdx = PLAYERS.indexOf(currentPlayer);
    let nextIdx;

    if (PLAYERS[currentIdx + 1]) {
      nextIdx = currentIdx + 1;
    } else {
      nextIdx = 0;
    }

    return PLAYERS[nextIdx];
  }

  updateCell(rowIdx, colIdx, grid) {
    const newColor = this.getNextPlayer();

    grid[rowIdx][colIdx] = newColor;

    return grid;
  }

  getValidNeighbors(rowIdx, colIdx) {
    let cells = [];

    cells.push([rowIdx-1, colIdx-1]);
    cells.push([rowIdx-1, colIdx]);
    cells.push([rowIdx-1, colIdx+1]);

    cells.push([rowIdx, colIdx-1]);
    cells.push([rowIdx, colIdx+1]);

    cells.push([rowIdx+1, colIdx-1]);
    cells.push([rowIdx+1, colIdx]);
    cells.push([rowIdx+1, colIdx+1]);

    cells = validateCells(cells);

    return cells;
  }

  getValue(rowIdx, colIdx) {
    return this.state.grid[rowIdx][colIdx];
  }

  checkRow(x, y) {
    const value = this.state.grid[x][y-1];

    if (value) {
      console.log('value', value);
      return true;
    }

    return false;
  }

  checkColumn(x, y) {
    const value = this.state.grid[x-1][y];

    if (value) {
      console.log('value', value);
      return true;
    }

    return false;
  }

  getNeighborCellsToUpdate(rowIdx, colIdx, turn, grid) {
    const neighbors = this.getValidNeighbors(rowIdx, colIdx);

    neighbors.forEach(neighbor => {
      const value = this.getValue(neighbor[0], neighbor[1]);
      let match = false

      if (value && neighbor[0] === rowIdx) {
        match = this.checkRow(neighbor[0], neighbor[1]);
      } else if (value && neighbor[1] === colIdx) {
        match = this.checkColumn(neighbor[0], neighbor[1]);
      }

      if (match) {
        grid = this.updateCell(neighbor[0], neighbor[1], grid);
      }
    })

    return grid;
  }

  onCellClick(rowIdx, colIdx) {
    return () => {
      const turn = this.state.turn;
      let grid = clone(this.state.grid);

      grid = this.updateCell(rowIdx, colIdx, grid);
      grid = this.getNeighborCellsToUpdate(rowIdx, colIdx, turn, grid);
      this.setState({ turn: this.getNextPlayer(), grid });
    }
  }

  renderCell(row, column) {
    const color = this.state.grid[row][column];

    const props = { color };

    if (color) {
      props.style = { cursor: 'no-drop' };
    } else {
      props.style = { cursor: 'pointer' };
      props.onClick = this.onCellClick(row, column);
    }

    return <Cell { ...props } />;
  }

  renderColumns(row) {
    let columns = [];

    for (let i = 0; i < COLUMNS; i++) {
      const cell = this.renderCell(row, i);

      columns.push(
        <div key={ i } className="column">
          { cell }
        </div>
      );
    }

    return columns
  }

  renderRows() {
    let rows = [];

    for (let i = 0; i < ROWS; i++) {
      const columns = this.renderColumns(i);

      rows.push(<div key={ i } className="row">{ columns }</div>);
    }

    return rows;
  }

  render() {
    const rows = this.renderRows();

    return <div className="grid">{ rows }</div>
  }
}

export default Grid;
