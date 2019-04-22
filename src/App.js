// Libraries
import React, { Component } from 'react';
import Forecast from '../src/components/Forecast';

// Stylesheets
import '../src/css/App.css';
import '../src/css/Clock.css';

class App extends Component {

  render() {
    return (
      <Forecast />
    );
  }
}

export default App;
