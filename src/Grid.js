import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clone from 'clone';

import Cell from './Cell';

const propTypes = {
  columns: PropTypes.number,
  rows: PropTypes.number,
  players: PropTypes.arrayOf(PropTypes.string),
  grid: PropTypes.array,
  turn: PropTypes.string,
}

const validateCells = (cells) => {
  return cells.filter(cell => cell[0] >= 0 && cell[1] >= 0)
};

class Grid extends Component {
  constructor(props) {
    super(props);

    this.onCellClick = this.onCellClick.bind(this);
  }

  onUpdate(turn, grid) {
    this.props.onUpdate(turn, grid)
  };

  getNextPlayer() {
    const currentPlayer = this.props.turn;
    const currentIdx = this.props.players.indexOf(currentPlayer);
    let nextIdx;

    if (this.props.players[currentIdx + 1]) {
      nextIdx = currentIdx + 1;
    } else {
      nextIdx = 0;
    }

    return this.props.players[nextIdx];
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
    return this.props.grid[rowIdx][colIdx];
  }

  checkRow(x, y) {
    const value = this.props.grid[x][y-1];

    if (value) {
      return true;
    }

    return false;
  }

  checkColumn(x, y) {
    const value = this.props.grid[x-1][y];

    if (value) {
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
      const turn = this.props.turn;
      let grid = clone(this.props.grid);

      grid = this.updateCell(rowIdx, colIdx, grid);
      grid = this.getNeighborCellsToUpdate(rowIdx, colIdx, turn, grid);
      this.onUpdate(this.getNextPlayer(), grid);
    }
  }

  renderCell(row, column) {
    const color = this.props.grid[row][column];

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

    for (let i = 0; i < this.props.columns; i++) {
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

    for (let i = 0; i < this.props.rows; i++) {
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

Grid.propTypes = propTypes;

export default Grid;
