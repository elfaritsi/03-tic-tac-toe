import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" value={value} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ isXNowPlayer, squares, onPlay }) {
  function handleOnSquareClick(index) {
    // Jika square dengan index yg di klik sudah ada isinya
    // atau function calculateWinner tidak mengembalikan false
    // (artinya sudah mendapatkan pemenang) maka langsung return
    // jadi fungsi yg dibawahnya tidak dijalankan
    if (squares[index] != null || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[index] = isXNowPlayer ? "X" : "O";

    onPlay(nextSquares);
  }

  let status = "";
  const winner = calculateWinner(squares);

  if (winner) {
    status = `Pemenangnya adalah: ${winner}`;
  } else {
    status = `Pemain saat ini : ${isXNowPlayer ? "X" : "O"}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((square, index) => (
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleOnSquareClick(index)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [gameHistory, setGameHistory] = useState([Array(9).fill(null)]);
  const [isXNowPlayer, setIsXNowPlayer] = useState(true);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = gameHistory[currentMove];

  function handlePlay(nextSquares) {
    const newHistory = [...gameHistory.slice(0, currentMove + 1), nextSquares];
    setGameHistory(newHistory);
    setCurrentMove(newHistory.length - 1)
    setIsXNowPlayer(!isXNowPlayer);
  }

  function jumpTo(index) {
    setCurrentMove(index);
    setIsXNowPlayer(index % 2 === 0 ? true : false);
  }

  const moves = gameHistory.map((history, index) => {
    let description = "";

    if (index > 0) {
      description = `Go to move ${index}`;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          isXNowPlayer={isXNowPlayer}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lineRules = [
    // rules secara horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // rules secara vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // rules secara diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lineRules.length; i++) {
    const [a, b, c] = lineRules[i];

    if (squares[a] && squares[a] === squares[b] && squares[c]) {
      return squares[a];
    }
  }

  return false;
}
