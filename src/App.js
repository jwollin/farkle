import React, { useState, useEffect, Fragment, useRef } from 'react';

import { PlayerProvider, usePlayerState, usePlayerDispatch } from './providers/PlayerProvider';
import './App.css';

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

function Score({ score }) {
  const [value, setValue] = useState(score);
  const [input, setInput] = useState(false);

  const inputRef = useRef(uuid());

  useEffect(() => {
    if(input) {
      inputRef.current.focus();
    }
  }, [input]);

  function changeValue(value) {
    const isNumber = !isNaN(Number(value));
    if(isNumber) setValue(value);
  }

  function saveValue() { setInput(false); }

  function changeToInput() {
    setInput(true);
  }

  return (
    <div className="col">
      {input ? (
        <Fragment>
          <input
            type="text"
            className="form-control -dark"
            value={value}
            ref={inputRef}
            onChange={(e) => changeValue(e.target.value)}
          />
          <button
            className="btn btn-info -input"
            type="button"
            onClick={() => saveValue(value)}
          >
            <span className="checkmark" />
          </button>
        </Fragment>
      ) : (
        <button
          type="button"
          className="btn btn-link -teal btn-block text-left"
          onClick={() => changeToInput()}
        >
          {value}
        </button>
      )}
    </div>
  )
}

function ScoreBoard() {
  const state = usePlayerState();

  const scoreHeader = state.map(item => {
    const { name } = item;

    return (
      <div className="col" key={uuid()}>
        <span className="score-name">{name}</span>
      </div>
    )
  });

  const scoreRow = state.map(item => {
    const { id, scores } = item;

    return (
      <div className="row scoreboard-row" key={id}>
        {scores.map(score => <Score score={score} key={uuid()} />)}
      </div>
    )
  });

  return (
    <Fragment>
      <div className="col-12 col-sm-9">
        <h2>Scores Header</h2>
        <div className="col-12">
          <div className="row scoreboard-row">
            {scoreHeader}
          </div>
        </div>
        <div className="col-12">
          {scoreRow}
        </div>
      </div>
    </Fragment>
  )
}

/**
 * return an object
 * {
 *   player: "jesse",
 *   plays: [ 50, 100, 400 ],
 *   diceLeft: 2,
 * }
 */

// todo: Change property values to use img urls for faces of the die.
const dice = {
  1: 'one.png',
  2: 'two.png',
  3: 'three.png',
  4: 'four.png',
  5: 'five.png',
  6: 'six.png',
};

const diceLength = [2, 2, 3, 1, 5, 5];

/**
 * If we have 2 1s return 200
 * If we have 3 1s return 300
 */

function rollDice(length) {
  const rollLength = [];

  for (let i = 0; i < length.length; i++) {
    rollLength.push(Math.floor(Math.random() * 6) + 1);
  }

  return rollLength;
}

function GameBoard() {
  const diceViews = rollDice(diceLength).map(die => {
    const face = `./img/${dice[die]}`;
    return <img className="die" src={face} alt={`${die}`} />;
  });

  return <div className="row">{diceViews}</div>;
}

function GameManager() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const state = usePlayerState();
  const dispatch = usePlayerDispatch();

  const playerCount = state.length + 1;

  const addPlayer = (name) => {
    if(name === "") return setError("Set a player name");

    setError('');
    setName('');

    dispatch({ type: 'add.player', name });
  };

  const removePlayer = (id) => {
    dispatch({ type: 'remove.player', id });
  };

  const players = state.map(player => {
    const { id, name } = player;

    return (
      <li
        key={id}
        id={id}
      >
        {
          <div>
            {name}
            <button
              className="btn btn-link -remove"
              onClick={() => removePlayer(id)}
            >
              &times;
            </button>
          </div>
        }
        {state && <hr/>}
      </li>
    )
  });

  return (
    <Fragment>
      <div className="col-12 col-sm-3">
        <h2>Add Players</h2>
        <div className="position-relative">
          <label htmlFor="player d-inline">
            <span className="d-inline">{`Player ${playerCount}`}</span>
            <input
              type="text"
              className="form-control -dark d-inline"
              id="player"
              value={name}
              placeholder="Player Name"
              onChange={e => setName(e.target.value)}
            />
            {error && <div className="error-msg text-danger">{error}</div>}
          </label>
          <button
            className="btn btn-info -add-player"
            onClick={() => addPlayer(name)}
          >
            Add {name}
          </button>
        </div>
        <ul className="list-unstyled">
          <h3>Players</h3>
          {players}
        </ul>
      </div>
    </Fragment>
  )
}

const Header = ({heading}) => {
  return <h1 className="text-center">{heading}</h1>;
};

function App() {
  return (
    <div className="container-fluid app">
      <div className="container">
        <Header heading="Farkle Score Keeper" />
        <div className="row">
          <PlayerProvider>
            <GameManager />
            <div className="col-xs-12">
              <div className="row">
                <GameBoard />
                <ScoreBoard />
              </div>
            </div>
          </PlayerProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
