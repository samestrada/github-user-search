import React, { Component } from 'react';

class Search extends Component{

    constructor(props){
        super(props);
        this.state = {
            queryString:''
        }
    }

    setQuery(val){
        val = val.trim();
        this.setState({
            queryString: val
        })
    }

    render(){
        return(
            <div className="searchBar">
            <input
                type='text'
                className='input'
                placeholder='Search for users'
                value={this.state.queryString}
                onChange={(e) => this.setQuery(e.target.value)}
                required
            />
            <p>{this.state.queryString}</p>
            </div>
        );
    }
}

export default Search;