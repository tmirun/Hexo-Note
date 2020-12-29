import React from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';
import {routes} from './routes';
import { Provider } from 'react-redux';
import {store} from "./store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </Provider>
  );
}

export default App;
