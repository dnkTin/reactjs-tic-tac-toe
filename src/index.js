import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * GAME component -> render BOARD component -> render SQUARE
 */

class Board extends React.Component {

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.handleClick(i)} />
    }

    render() {
        const squares = this.props.squares.slice();

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>

                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>

                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

function Square(props) {
    return (
        <button className="square" onClick={() => { props.onClick() }}>
            {props.value}
        </button >
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    location: { col: null, row: null }
                },
            ],
            xIsNext: true,
            stepNumber: 0,
        }
    }
    jumpTo(step) {
        // step is index of history
        this.setState({
            xIsNext: step % 2 === 0,
            stepNumber: step
        })
    }

    handleClick(i) {
        // if we dont slice from 0 to stepNumber, the history will increase
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const currentHistory = history[this.state.stepNumber];

        let currentLocation = {};
        currentLocation.row = i % 3;
        currentLocation.col = Math.floor(i / 3);
        const currentSquares = currentHistory.squares.slice();
        // first copy the squares's state from state
        // ignore when having winner, or spquare alr click
        if (calculateWinner(currentSquares) || currentSquares[i]) {
            console.log('win');
            return;
        }
        currentSquares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState(
            {
                history: history.concat([
                    {
                        squares: currentSquares,
                        location: currentLocation
                    },
                ]),
                xIsNext: !this.state.xIsNext,
                // since we add a new history by using above concat function
                // we need to update stepNumber to the new one
                stepNumber: history.length,
            }
        );
    }

    render() {
        const history = this.state.history;
        const currentHistory = history[history.length - 1];
        const winner = calculateWinner(currentHistory.squares);
        let status;
        if (winner) {
            status = "Winner is " + (this.state.xIsNext ? 'O' : 'X');
        } else {
            status = "Next player " + (this.state.xIsNext ? " X :" : "O: ");
        }
        const moves = history.map((step, move) => {
            console.log(step);
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move} style={{ fontWeight: this.state.stepNumber === move ? 'bold' : 'normal' }}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    <span>{step.location.col}</span>
                    <span>{step.location.row}</span>
                </li>
            )
        });
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={currentHistory.squares}
                        handleClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>Location: {}</div>
                    <div>{moves}</div>
                </div>
            </div>
        );
    }
}

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
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)