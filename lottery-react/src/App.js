import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    owner: 'MISSING',
    players: [],
    balance: '',
    value: '',
    message: ''
  }

  async componentDidMount() {
    const owner = await lottery.methods.owner().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ owner, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.addPlayer().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async (event) => {
    this.setState({ message: 'Picking a winner...' });

    const accounts = await web3.eth.getAccounts();

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  }

  render() {
    window.lottery = lottery;
    return (
      <div className="App">
        <header className="App-header">
          <h2>
            Lottery Contract
          </h2>
          <p>
            This contract is managed by {this.state.owner}. <br />
            There are currently {this.state.players.length} people entered,
            competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether.
          </p>
          <form onSubmit={this.onSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
              <label>Amount of ether to enter </label>
              <input
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
              />
            </div>
            <button>Enter</button>
          </form>

          <h4>Ready to pick a winner?</h4>
          <button onClick={this.onClick}>Pick a winner!</button>

          <h1>{this.state.message}</h1>
        </header>
      </div>
    )
  }
}

export default App;
