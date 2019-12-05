import React, { Component } from 'react';
import logo2 from './img/slockit_logo.svg'
import './App.css';
import web3 from './web3';
import ens_contract from './ens_contract';

class App extends Component {

  state = {
    events: [],
    address: '',
    averageTransactions: 0,
    numberOfDays: 0,
    event_of_interest: ''
  };

  async componentDidMount() {
    const averageTransactions = 50000; 
    const numberOfDays = 1;
    
    await ens_contract.getPastEvents("NameRegistered", {
      fromBlock: (await web3.eth.getBlockNumber()) - (averageTransactions * numberOfDays),
      toBlock: "latest"
    }, (error, event)=> { this.setState({events: event}); })
    .then((event) => {
        console.log(JSON.stringify(event)) 
    }); 

    const address = ens_contract.options.address;
    const event_of_interest = "NameRegistered (string name, bytes32 label, address owner, uint256 cost, uint256 expires)";
    this.setState({averageTransactions: averageTransactions});
    this.setState({event_of_interest});
    this.setState({numberOfDays: numberOfDays});
    this.setState({address: address});
  }


  onSubmit = async event => {
    event.preventDefault();
    const events = await ens_contract.getPastEvents("NameRegistered", {
      fromBlock: (await web3.eth.getBlockNumber()) - (this.state.averageTransactions * this.state.numberOfDays),  
      toBlock: "latest"
    });
    this.setState({events: events});
  };


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo2} className="App-logo" alt="logo" />
          <p className="App-title">
            slock.it programming task [ENS Contract event visualisation]
          </p>
        </header>
        <br/>
        <p className="App-content">
          ENS Contract Address: {this.state.address} <br/>
          Event of Interest: {this.state.event_of_interest}
        </p>

        <form onSubmit={this.onSubmit} >
          <h4>Tweak the default parameters here</h4>
          <div style={{float : 'left', width : '40%'}}>
            <label>Average Blocks mined per day  </label>
            <input
              value={this.state.averageTransactions}
              onChange={event => this.setState({ averageTransactions: event.target.value })}
            />
          </div>
          <div style={{float : 'left', width : '40%'}}>
            <label>Number of Days  </label>
            <input
              value={this.state.numberOfDays}
              onChange={event => this.setState({ numberOfDays: event.target.value })}
            />
          </div>
          <button>Fetch Events</button>
        </form>
        <hr />

        <h4>Events Detail</h4>
        <textarea
            cols={200} rows={15}
            value= { JSON.stringify(this.state.events) }
            onChange= {event => this.setState({ events: event.target.value })} 
        />

        <h4>There are currently{' '}
              {this.state.events.length} NameRegistered event(s) that have occured, considering avg {' '}
              {this.state.averageTransactions} blocks mined per day for {' '}
              {this.state.numberOfDays} day(s)</h4>

        <footer className="App-footer">
          <p>
            <b>Developed by</b>: Hritik Gupta <br/>
            Indian Institute of Technology Mandi, India
          </p>
        </footer>

      </div>
    ); 
  }


}


export default App;
