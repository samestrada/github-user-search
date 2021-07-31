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

  componentDidMount(){
      fetch(`https://api.github.com/users`)
      .then(res => res.json())
      .then(user => {
        this.setState({
         results: user, 
         searchText: ''
        });
      });
  }


  searchQuery(changeState){
    
  }
  // https://api.github.com/users/samestrada

  render(){
    var { results } = this.state;
    return (
      <div className="App">
        <h1>Github Search using Github API</h1>
        <Search></Search>
         <ul>
           {results.map(item => (
              <li key = {item.id}>
                <h2>
                  {item.login}
                </h2>
              </li>
          ))};
        </ul>
      </div>
    );
  }
}


export default App;
