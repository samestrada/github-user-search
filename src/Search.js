import React, { Component, useState, useEffect } from 'react';

const API           = 'https://api.github.com/search/users?q=';
const PAGE_OP       = '&page=';
const PER_PAGE_OP   = '&per_page=';
const PER_PAGE      = '25';
const GITHUB        = 'https://github.com/';
var CURRENT_PAGE    = '1';

class Search extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            queryString:'',
            results:[],
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    //as field changes, update queryString
    handleChange(e) {
        this.setState({queryString: e.target.value});
    }
    //on submit button press, retrieve queried results
    handleSubmit(e){
        fetch(API + this.state.queryString + PAGE_OP + CURRENT_PAGE + PER_PAGE_OP + PER_PAGE)
        .then(res => res.json())
        .then(data => {

          this.setState({
            results: data,
          }
          );
        });
        this.setState({submitted: true})
    }

    // This function handles API calls for each individual github user returned in results list
    getInfo(url){

        //array holding star count, full name (if exists), and follower count in that order.
        var info = [];

        fetch(url)
        .then(res => res.json())
        .then(data => {
            info.push(data.name);
            info.push(data.followers);
        })
        fetch(url+'/starred')
        .then(res => res.json())
        .then(data => {
            info.push(data.length);
        })
        return info;
    }

    resetState(){
        this.setState({queryString:'', results: [], refresh: 1});
    }

    //This function fetches data for each user in the results list, and sets it up to be rendered after search
    returnResults(){
        console.log("results function: ", this.state.results.items)
        var extraDetails = {};

        if (typeof this.state.results.items !== "undefined") {
            this.state.results.items.forEach(element => {
                extraDetails[element.login] = this.getInfo(element.url);
            });

        var showing = 0;
        (this.state.results.total_count < PER_PAGE) ? showing = this.state.results.total_count : showing = PER_PAGE;
            return(
                <>
                <p>Showing {showing} out of {this.state.results.total_count} results for the search '{this.state.queryString}'</p>
                <table className="filtered-users">
                    {this.state.results.items.map(item => (
                        <tr>
                            {console.log("pfp: ", this.state.results.items.avatar_url)}
                            <img src={this.state.results.items.avatar_url} alt=''/>
                            {/* meant to display username with extradetails (full name, follower/star count), experiencing difficulty producing this */}
                            {/* {extraDetails[item.login][0]} | Followers: {extraDetails[item.login]} */}
                            <td><a href={GITHUB + item.login}>{item.login}</a> </td>
                        </tr>
                    ))}
                </table>
                </>
            )
        }
        
    }

    render(){

        //render search result count only if we have actual results
        if(typeof this.state.results.items !== "undefined" && this.state.refresh === 1){
            console.log("Total matches found: ", this.state.results.total_count);
            
            this.resetState();
        }

        return(
            <div>
                <form className="searchBar" onSubmit={this.handleSubmit}>
                    <input
                        type='text'
                        name='q='
                        className='input'
                        placeholder='Search for users'
                        value={this.state.queryString}
                        onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()} //require submission through submit button
                        onChange={this.handleChange}
                        required
                     />
                 <input type="button" value="Search" onClick={this.handleSubmit}/>
                </form>
                {this.state.submitted ? this.returnResults()
                    : <p>Search through all Github users!</p>}
             </div>   
        );
    }
}

export default Search;