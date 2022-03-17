/* Require the dependency and config file */
const Twit = require('twitter');
const Keys = require('./config/keys');

/* Pass the configuration in dev.js to twitter */
const Hero = new Twit(Keys);

/* Additional dependency to get access to Formastic API */
const request = require('request');
const requestPromise = require('request-promise');
const API_URL = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

/* Quote Bot 	
	* Function that will actually get information from API and post tweets 
	* https://medium.com/@kiruu1238/building-and-deploying-random-quote-twitter-bot-easy-way-dc24fdbf01d1 */

const getQuote = (() => {
 
 /* Request options */
 const OPTIONS = {
 uri: API_URL,
 json: true
 };
 requestPromise( OPTIONS )
 
 /* Successful call */
 .then( (response) => {
 if ( !response )
 getQuote();
 let quoteText = response.quoteText;
 let author = response.quoteAuthor || "Unknown";
 let fullQuote = `${quoteText}`
 
 printQuote( fullQuote );
 Hero.post(`statuses/update`, {status: fullQuote}, function(error, tweet, response){
 if(error){
 console.log(error);
 }
 console.log(tweet); // Tweet body.
 console.log(response); // Raw response object.
});
 })

/* Handling errors */
 .catch( (err) => {
 console.log("Unable to retrieve quote");
 })
})();
let printQuote = (fullQuote) => {
 console.log( fullQuote )
}


/* Favorite bot */
/* Find recent and popular tweet in the searched parameters and favorite */

const params = {
 q: '#quotestoliveby',
 result_type: "mixed recent",
 lang: 'en' 
 }


 Hero.get('search/tweets', params, function(err, data, response) {
  // If there is no error, proceed
  if(!err){
    // Loop through the returned tweets
    for(let i = 0; i < data.statuses.length; i++){
      // Get the tweet Id from the returned data
      let id = { id: data.statuses[i].id_str }
      // Try to Favorite the selected Tweet
      Hero.post('favorites/create', id, function(err, response){
        // If the favorite fails, log the error message
        if(err){
          console.log(err[0].message);
        }
        // If the favorite is successful, log the url of the tweet
        else{
          let username = response.user.screen_name;
          let tweetId = response.id_str;
          console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`)
        }
      });
    }
  } else {
    console.log(err);
  }
})