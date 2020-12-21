import React from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';
import {routes} from './routes';

function App() {
  return (
    <BrowserRouter>
      {renderRoutes(routes)}
    </BrowserRouter>
  );
}

export default App;
