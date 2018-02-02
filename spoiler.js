//importing the request library and creating a request object
const request = require('request');
const cheerio = require('cheerio');

//ignoring the first two parameters of the process.argv array as they are irrelevant to the information entered by the user
const inputParameters = process.argv.splice(2);
var validInput = checkInputParameterValidity(inputParameters);
//if statement that checks if the input is valid or not
if(validInput){
    let sortedInputInformation = sortInformation(inputParameters);//sort the input information
    spoilerMachine(sortedInputInformation);//start spoiler machine program
}
else {
    console.log("Try Again");
}
//invoking the function that contains the main program
//message to the console prompting the user the reattempt if the input was invaid

function sortInformation(inputParameters){
    let sortedInfo = {}; //creating empty object that will store information about object
    let movieTitle = "";
    //going through the inputParameters array to come up with the movie title
    for(let i=0; i<inputParameters.length-1;i++){
        if(i < inputParameters.length-2)
            movieTitle +=  inputParameters[i] + " "; 
        else
            movieTitle += inputParameters[i]; 
    }
    //assigning value to spoiler time
    let spoilerTime = inputParameters[inputParameters.length-1];
    //assigning the movie title and spoiler time key value pairs to the javascript object
    sortedInfo["movieTitle"] = movieTitle;
    sortedInfo["spoilerTime"] = spoilerTime;
    return sortedInfo;//return the object containing the input information for movie title and spoiler time
}
/*function that takes in the inputParameters array as argument and returns the validity of the information entered as input
by the user as a boolean*/
function checkInputParameterValidity(inputParameters){
    //if two parameters are entered as input
    if(inputParameters.length >= 2){
        if (!isNaN(inputParameters[inputParameters.length - 1])) {
            return true;
        }
        else if (!isNaN(inputParameters[0])) {
            console.log("Enter Movie Title followed by Spoiler Time");
            return false;
        }
    } //if only one parameter is entered as input
    if(inputParameters.length == 1){
        //condition to check if input parameter is a number
        if (!isNaN(inputParameters[0])){
            console.log("Movie Title Not Entered");
            return false;
        }//condition to check if input parameter is not a number
        else if(isNaN(inputParameters[0])){
            console.log("Spoiler Time not Entered");
            return false;
        }   
    }
}

//function that contains the main program
function spoilerMachine(sortedInfo){
    //api key for accessing the list of movies
    const apiKey = '79cc065335eb505f9802891bb8cabedb';
    //url for the website which contains the JSON data about the movie
    const urlMovie = `https://api.themoviedb.org/3/search/movie?query=${sortedInfo.movieTitle}&api_key=${apiKey}`;
    //url for the website from where the movie names will be fetched
    const MovieDBDatabaseURL = `https://www.themoviedb.org/search/movie?query=${sortedInfo.movieTitle}`;
    //url for the website which contains the google search results
    const urlGoogle = `https://www.google.ca/search?q=${sortedInfo.movieTitle}`;

    //timer function that gets invoked after the time as entered as the second parameter by the user at the start of the program
    setTimeout(function () {
        //api request for fetching the data at the webpage located at the url MovieDBDatabaseURL
        request(MovieDBDatabaseURL, function (error, response, body) {
            //condition to check if there is any error and display error messages accordingly
            if (error) {
                console.log(`Error Message : ${error}`);
                console.log(`Status Code : ${response.statusCode()}`);
            }
            else {
                let $ = cheerio.load(body); //making use of the cheerio library
                //condition to check if the movie title even exists or not
                if ($(`a.title.result`)[0] === undefined || $(`a.title.result`)[0].attribs.title.toLowerCase() !== sortedInfo.movieTitle.toLowerCase()) {
                    console.log("There were no movies that matched your query");
                } else {
                    //api request for fetching the spoiler message if movie title exists 
                    request(urlMovie, function (error, response, body) {
                        //condition to check if there is any error and display error messages accordingly
                        if (error) {
                            console.log(`Error Message : ${error}`);
                            console.log(`Status Code : ${response.statusCode()}`);
                        }
                        else {
                            //converting data received as string into json object so that it can be accessed through api
                            jsonObject = JSON.parse(body);
                            console.log(`SPOILER MESSAGE\n---------------`);
                            //prints the overview in the console
                            console.log(`${jsonObject.results[0].overview}\n`);
                        }
                    });
                }
            }
        });
    }, parseInt(sortedInfo.spoilerTime) * 1000);
    //spoiler message warning
    console.log(`\n***spoiler warning*** We will be spoiling the plot of ${sortedInfo.movieTitle} in ${sortedInfo.spoilerTime} seconds.`);
    //api request for fetching the data at the webpage located at the url google
    request(urlGoogle, function (error, response, body) {
        let $ = cheerio.load(body); //making use of the cheerio library
        //title for displaying individual results
        console.log(`\nThe latest google search results for the film ${sortedInfo.movieTitle} are : \n`);
        //displaying the individual results
        $(`h3.r`).each(function() {
            console.log(`    -- ${$(this).text()}\n`);
        });
    });
}
        
    





