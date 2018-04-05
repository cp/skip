import React, { Component } from 'react';
import Grid from './Grid';
import './App.css';

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
};

class App extends Component {
  constructor(props) {
    super(props);

    const grid = buildGrid();

    this.state = {
      grid,
      turn: PLAYERS[0]
    };

    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(turn, grid) {
    this.setState({ turn, grid });
  }

  getScore() {
    const reduceRow = (arr) => {
      return arr
        .filter(cell => cell)
        .reduce((players, cell) => {
          if (players[cell]) {
            players[cell] = players[cell] + 1;
          } else {
            players[cell] = 1;
          }

          return players
        }, {});
    };

    const collapseRows = (players, row) => {
      Object.keys(row).forEach(player => {
        if (players[player]) {
          players[player] = row[player] + players[player];
        } else {
          players[player] = row[player];
        }
      })

      return players;
    };

    const start = PLAYERS.reduce((players, player) => {
      players[player] = 0;

      return players;
    }, {});

    return this.state.grid
      .map(reduceRow)
      .reduce(collapseRows, start);
  }

  renderScore() {
    const score = this.getScore();

    const players = Object.keys(score).map(player => {
      return (<div key={ player }>{ player }: { score[player] }</div>);
    })

    return (
      <div className="score">
        { players }
      </div>
    )
  }

  render() {
    const score = this.renderScore();

    return (
      <div className="App">
        <Grid
          { ...this.state }
          onUpdate={ this.onUpdate }
          columns={ COLUMNS }
          rows={ ROWS }
          players={ PLAYERS }
        />
        { score }
      </div>
    );
  }
}

export default App;
