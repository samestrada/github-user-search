import React, { Component, useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

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
            submitted: false,
            pageNumbers: []
        };
        this.handleChange   = this.handleChange.bind(this);
        this.handleSubmit   = this.handleSubmit.bind(this);
        this.getInfo        = this.getInfo.bind(this);
        this.resetState     = this.resetState.bind(this);
        this.handleClick     = this.handleClick.bind(this);
    }

    //as field changes, update queryString
    handleChange(e) {
        this.setState({queryString: e.target.value});
    }
    //on submit button press, retrieve queried results
    handleSubmit(e){
        this.fetchResults();
    }

    handleClick(event) {
        console.log("event: ", event.target.id);
        // this.setState({submitted: false})
        CURRENT_PAGE = event.target.id;
        this.fetchResults();
    }

    fetchResults(){
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
        console.log("yessir");

        // fetch(url)
        // .then(res => res.json())
        // .then(data => {
        //     info.push(data.name);
        //     info.push(data.followers);
        // })
        // fetch(url+'/starred')
        // .then(res => res.json())
        // .then(data => {
        //     info.push(data.length);
        // })
        // return info;
    }

    pagination(){
        this.state.pageNumbers = [];
        if(this.state.results.total_count > 0){
            console.log("here");
            //total page numbers to display
            console.log("Total results: ", this.state.results.total_count, "Total per page: ", PER_PAGE);
            console.log("Divide: ", Math.ceil(this.state.results.total_count / PER_PAGE))
            for(let i  =  0; i < Math.ceil(this.state.results.total_count / PER_PAGE); i++){
                this.state.pageNumbers.push(i+1);
            }
            {console.log("Total pages: ", this.state.pageNumbers)}
        }
    }

    resetState(){
        this.setState({queryString:'', results: [], submitted: false, pageNumbers: []});
    }

    //This function fetches data for each user in the results list, and sets it up to be rendered after search
    returnResults(){
        console.log("results function: ", this.state.results.items)
        var extraDetails = {};

        //for each user, call getInfo to learn follower/star count etc.
        if (typeof this.state.results.items !== "undefined") {
            this.state.results.items.forEach(element => {
                extraDetails[element.login] = this.getInfo(element.url);
            });
        var showing = 0;
        this.pagination();
        (this.state.results.total_count < PER_PAGE) ? showing = this.state.results.total_count : showing = PER_PAGE;
            return(
                <> 

                <p>{this.state.results.total_count} results for the search '{this.state.queryString}'</p>
                {this.state.pageNumbers.map(number => (
                        <button id={number} onClick={this.handleClick}> {number} </button> 
                    ))} 
                <ListGroup>
                    {this.state.results.items.map(item => (
                        <ListGroup.Item>
                            {console.log("pfp: ", this.state.results.items.avatar_url)}
                            <img src={this.state.results.items.avatar_url} alt=''/>
                            {/* meant to display username with extradetails (full name, follower/star count), experiencing difficulty producing this */}
                            {/* {extraDetails[item.login][0]} | Followers: {extraDetails[item.login]} */}
                            <td><a href={GITHUB + item.login}>{item.login}</a> </td>
                            </ListGroup.Item>
                    ))}
                </ListGroup>

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