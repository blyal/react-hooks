// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Game() {
  const [gameHistory, setGameHistory] = useLocalStorageState(
    'tic-tac-toe:history',
    Array(Array(9).fill(null)),
  )

  const [currentMove, setCurrentMove] = useLocalStorageState(
    'tic-tac-toe:current-move',
    0,
  )

  const currentSquaresShowing = gameHistory[currentMove]
  const nextValue = calculateNextValue(currentSquaresShowing)
  const winner = calculateWinner(currentSquaresShowing)
  const status = calculateStatus(winner, currentSquaresShowing, nextValue)

  const moves = gameHistory.map((historyItem, index) => {
    const baseText = index === 0 ? 'Go to game start' : `Go to move #${index}`
    const isCurrentMove = index === currentMove
    return (
      <li key={historyItem}>
        <button
          disabled={isCurrentMove}
          onClick={() => {
            setCurrentMove(index)
          }}
        >
          {baseText} {isCurrentMove ? ' (current)' : null}
        </button>
      </li>
    )
  })

  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables

  function selectSquare(square) {
    if (winner || currentMove[square]) return

    const newSquares = [...currentSquaresShowing]
    newSquares[square] = nextValue
    const newGameHistory = gameHistory.slice(0, currentMove + 1)
    newGameHistory.push(newSquares)
    setCurrentMove(currentMove + 1)
    setGameHistory(newGameHistory)
  }

  function restart() {
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
    setCurrentMove(0)
    setGameHistory(Array(Array(9).fill(null)))
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquaresShowing} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
