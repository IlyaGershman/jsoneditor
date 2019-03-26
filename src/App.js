import React, { Component } from 'react';
import axios from 'axios';

import JSONEditorReact from './JSONEditorReact';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

const schema = {};

const json = {};

const modes = ['tree', 'form', 'view', 'code', 'text'];
const _http = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:8008`
});
class App extends Component {
  constructor() {
    super();
    this.state =  {
      schema,
      text: JSON.stringify(json, null, 2),
      mode: 'tree'
    };
  }

  async componentDidMount() {
    const json = await _http.get('/posts');
    this.setState({text: JSON.stringify(json)})
  }

  render() {
    return (
      <div className="app">
        <div className="contents">
          <JSONEditorReact
              schema={this.state.schema}
              text={this.state.text}
              mode={this.state.mode}
              modes={modes}
              indentation={4}
              onChangeText={this.onChangeText}
              onModeChange={this.onModeChange}
          />
          <button className="btn btn-primary" onClick={this.submitResult}>
             Submit
          </button>
        </div>
      </div>
    );
  }

  onChangeText = (text) => {
    this.setState({ text });
  };

  onModeChangeSelect = (event) => {
    this.setState({ mode: event.target.value });
  };

  onModeChange = (mode) => {
    this.setState({ mode });
  };

  submitResult = () => {
    if (this.state.text && this.state.text.length) {
      _http.post('/delay-management', JSON.parse(this.state.text))
      .then(res => {
        console.log(res);
        window.confirm('Sent successful');
      }).catch(err => {
        window.confirm(`Error occured ${JSON.stringify(err)}`);
      });
    } else {
      window.confirm('The Form is empty');
    }
  }
}

export default App;
