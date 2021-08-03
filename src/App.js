import './App.css';
import React, { Component } from 'react';
import Search from './Search';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      results: [],
      searchText: ''
    };
  }

  render(){
    return (
      <div className="App">
        <h1>Github Search using Github API</h1>
        <Search></Search>
      </div>
    );
  }
}


export default App;
