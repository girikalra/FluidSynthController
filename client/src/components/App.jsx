import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Channel from './Channel.jsx';
import SystemControl from './SystemControl.jsx';

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      channels: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.appendFile = this.appendFile.bind(this);
    this.loadPreset = this.loadPreset.bind(this);
    this.savePreset = this.savePreset.bind(this);
    this.showPreset = this.showPreset.bind(this);
  }

  handleChange(e) {
    let channels = this.state.channels.slice();
    channels[e.target.id] = `select ${e.target.id} 1 ${e.target.value}`;
    this.setState({channels: channels});
  }

  appendFile() {
    let config = [];
    for (var i = 0; i < this.state.channels.length; i++) {
      if (this.state.channels[i]) config.push(this.state.channels[i]);
    }
    axios.post('/load', {config: config})
    .then((res) => alert('config successfully loaded'))
    .catch((err) => alert('error loading config file'))
  }

  loadPreset(e) {
    let preset = e.target.id;
    axios.get('/loadpreset', {params: {preset: preset}})
    .then((res) => this.showPreset(res))
    .catch((err)=> alert('error loading preset file'))
  }

  savePreset() {
    let choice = prompt('which preset? 1, 2, or 3');
    var options = ['1', '2', '3'];
    if (options.includes(choice)) {
      let config = [];
      for (var i = 0; i < this.state.channels.length; i++) {
        if (this.state.channels[i]) config.push(this.state.channels[i]);
      }
      axios.post('/save', {config: config, preset: choice})
      .then((res) => alert('config successfully saved to preset' + choice))
      .catch((err) => alert('error saving config file'))
    }
  }

  showPreset(text) {
    let channels = [];
    let assignments = {};
    let lines = text.data.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let selectors = lines[i].split(' ');
      let instrumentCode = selectors[3] + ' ' + selectors[4];
      let channel = selectors[1];
      channels[channel] = lines[i];
      assignments[i] = instrumentCode;
    }
    for (var i = 0; i < 16; i++) {
      let val = (assignments[i] ? assignments[i] : '');
      document.getElementById(i).value = val;
    }
    this.setState({channels: channels});
  }

  render() {
    let channels = [];
    for (var i = 0; i < 16; i++) {
      channels.push(<Channel key={i} ch={i} handleChange={this.handleChange}/>)
    }

    return (
      <div>
        <div id="channels">
          {channels}
        </div>
        <div className="load-save-buttons">
          <button id="load" onClick={this.appendFile}>load your config</button>
          <button id="save" onClick={this.savePreset}>save your config</button>
        </div>
        <div className="preset-buttons">
          <button id="preset01" onClick={this.loadPreset}>preset 1</button>
          <button id="preset02" onClick={this.loadPreset}>preset 2</button>
          <button id="preset03" onClick={this.loadPreset}>preset 3</button>
        </div>
        <div>
          <SystemControl />
        </div>
      </div>
    )
  }

};