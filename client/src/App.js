import logo from './logo.svg';
import React from 'react';
import './App.css';
import {BrowserTouter} from 'react-router-dom';
import AppRouter from './Router';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import StoreProvider from './modules/layout/userContext';

function App() {
  return (
    <div className="App">
      <StoreProvider>
         <AppRouter/>
      </StoreProvider>
  
       


      
    </div>
  );
}

export default App;
