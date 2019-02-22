import React, { Component } from "react";
import Header from "./header.js";
import "./App.css";

import Login from "./login";
class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Login />
      </div>
    );
  }
}

export default App;