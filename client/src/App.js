import logo from './logo.svg';
import React from 'react';
import './App.css';
import {BrowserTouter} from 'react-router-dom';
import AppRouter from './Router';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

function App() {
  return (
    <div className="App">
      <AppRouter/>
    </div>
  );
}

export default App;
