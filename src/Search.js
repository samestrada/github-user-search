import React, { Component, useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const API           = 'https://api.github.com/search/users?q=';
const PAGE_OP       = '&page=';
const PER_PAGE_OP   = '&per_page=';
const PER_PAGE      = '25';
var CURRENT_PAGE    = '1';
const TEST          = 'https://6108a740d73c6400170d39e6.mockapi.io/TestFields';


class Search extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            queryString:'',
            results:[],
            submitted: false,
            finished: false,
            pageNumbers: [],
            total_count: 0

        };
        this.handleChange   = this.handleChange.bind(this);
        this.handleSubmit   = this.handleSubmit.bind(this);
        this.getInfo        = this.getInfo.bind(this);
        this.resetState     = this.resetState.bind(this);
        this.handleClick     = this.handleClick.bind(this);
    }

    //as field changes, update queryString
    handleChange(e) {
        this.resetState();
        this.setState({
            queryString: e.target.value, 
            submitted: false});
    }
    //on submit button press, retrieve queried results
    handleSubmit(e){
        this.fetchResults();
        this.setState({pageNumbers: []});
    }

    handleClick(event) {
        this.setState({submitted: false})
        CURRENT_PAGE = event.target.id;
        this.fetchResults();
    }

    fetchResults(){
        fetch(API + this.state.queryString + PAGE_OP + CURRENT_PAGE + PER_PAGE_OP + PER_PAGE)
        .then(res => res.json())
        .then(data => {      
          this.setState({
            results: data,
            total_count: data.total_count
          });
        })
    }


    // This function handles API calls for each individual github user returned in results list
    async getInfo(url, pos){

        //array holding star count, full name (if exists), and follower count in that order.
        var fetched = {};
        var copyResults = [];
        copyResults = this.state.results.items;
        let items = {...copyResults};
        let item = items[pos];

        //test against local data
        // fetch(TEST)
        // .then(res => res.json())
        // .then(data => {      
        //     item['followers'] = data[0].followers;
        //     item['stars'] = data[0].stars;
        //     item['repos'] = data[0].repos;
        //     copyResults[pos] = item;
        //     this.setState({results:copyResults});
            
        // })

        //fetch for both gen user url and starred url for number of starred repos -- execute in parallel and wait till complete
        Promise.all([
            fetch(url, ).then(res => res.json()),
            fetch(url + '/starred').then(res => { return res.json();})
        ]).then(([genUserData, starred]) => {
            item['followers'] = genUserData.followers;
            item['stars'] = starred.length;
            item['repos'] = genUserData.public_repos;
            copyResults[pos] = item;
            this.setState({results:copyResults});
        })
    }


    //logic for necessary page buttons to display results
    pagination(){
        if(this.state.results.total_count > 0){
            //total page numbers to display
            for(let i  =  0; i < Math.ceil(this.state.results.total_count / PER_PAGE); i++){
                this.state.pageNumbers.push(i+1);
            }
        }
    }

    resetState(){
        this.setState({queryString:'', results: [], submitted: false, pageNumbers: []});
    }


    showFinal(){
        if(this.state.results.items){
            return(<p>Loading...</p>)
        }

        return(
            <> 

            <p>{this.state.total_count} results for the search '{this.state.queryString}'</p>
            {this.state.pageNumbers.map(number => (
                    <button id={number} onClick={this.handleClick}> {number} </button> 
                ))}
                <ListGroup>
                    {this.state.results.map(item => (
                    <ListGroup.Item align = "left">
                        <img src={item.avatar_url} width="40px" height="40px" alt=''/>
                        <a href={item.html_url}>{item.login} </a>
                        | Followers: {item.followers} | Stars: {item.stars} | Public Repos: {item.repos}
                    </ListGroup.Item>
                    ))}
                </ListGroup>

            </>
        )
    }

    //This function fetches data for each user in the results list, and sets it up to be rendered after search
    returnResults(){
        var pos = 0;
        var limit = 0;
        (this.state.results.total_count < 25) ? limit = this.state.results.total_count : limit = 25;

        //for each user, call getInfo to learn follower/star count etc.
        if (typeof this.state.results.items !== "undefined") {
            this.setState({
                submitted: false
            })
            this.state.results.items.forEach(element => {
                    this.getInfo(element.url, pos);
                    pos++;

            });

        if(pos === limit){
            this.setState({
                submitted: true
            })
        }

        //prevent from overriding previous pagination
        if(this.state.pageNumbers.length < 1){
            this.pagination();
        }

        return(<p>Search through all Github users!</p>)
            
        }
        
    }

    render(){

        return(
            <div>
                <form className="searchBar">
                    <input
                        type='text'
                        name='q'
                        className='input'
                        placeholder='Search for users'
                        onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()} //require submission through submit button
                        onChange={this.handleChange}
                        required
                     />
                 <input type="button" value="Search" onClick={this.handleSubmit}/>
                </form>
                {this.state.submitted ? this.showFinal()
                    : this.returnResults()}
             </div>   
        );
    }
}

export default Search;