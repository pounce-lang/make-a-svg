import * as React from 'react'
import './App.css'
import { BrowserRouter, Route } from "react-router-dom";
import Routes from "./Routes";

export function App() {
  return (
  <div className="App">
  <h1>penplotter svg</h1>
  <BrowserRouter>
    <Route path="/" component={Routes} />
  </BrowserRouter>
  </div>)
}

