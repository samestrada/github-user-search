# Replicating Github Search using Githib API

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and utitlizes Fetch API to interact with the Github API.

Deployed application may be viewed [here!](https://samestrada.github.io/github-user-search)

## Features included
* Takes a search query and displays all matches for string
* Paginates results
* Search results are selectable and redirect to corresponding page on github
* Displays information alongside each queried result (*Needs work*)

## Difficulties and things to improve
* This application currently uses minimal external libraries, as I had hoped to get my hands a bit dirtier with the React framework. I'd like to investigate some tools that would make this cleaner and smoother!
* Currently, there are issues with a large amount of fetch requests being made. Further investigation on how to minimize these requests are a must.
* I would like to implement forward and back buttons for the pagination to add extra options and learn more about mainatining previous/next page states.