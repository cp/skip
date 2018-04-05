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

  updateCell(rowIdx, colIdx) {
    const newColor = this.getNextPlayer();

    const grid = clone(this.state.grid);
    grid[rowIdx][colIdx] = newColor;

    this.setState({ grid, turn: newColor });
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

  updateNeighborCells(rowIdx, colIdx, turn) {
    const neighbors = this.getValidNeighbors(rowIdx, colIdx);

    neighbors.forEach(neighbor => {
      const value = this.getValue(neighbor[0], neighbor[1]);

    })
  }

  onCellClick(rowIdx, colIdx) {
    return () => {
      const turn = this.state.turn;

      this.updateCell(rowIdx, colIdx);
      this.updateNeighborCells(rowIdx, colIdx, turn);
    }
  }

  renderCell(row, column) {
    const color = this.state.grid[row][column];

    return (
      <Cell
        onClick={ this.onCellClick(row, column) }
        color={ color }
      />
    )
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
