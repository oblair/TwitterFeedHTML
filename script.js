var tweet_array = [];
var timer;
var delay = 5000;               // milliseconds:int; time delay between tweets
var count = 0;

$(document).ready(function(){
    getTweets();
})

function getTweets(){
    $.ajax({
		url: 'get_tweets.php',
		type: 'GET',
		success: function(response) { 
            console.log(response.statuses);
            
            for(i in response.statuses){
                tweet_array.push(response.statuses[i]);
            }
            tick();
            timer =  setInterval(tick, delay);
		},
		error: function(errors) {
			console.log('Error: ' + errors);
		}
	});
}

function tick(){
    displayTweet(count);
    count++
    if(count > tweet_array.length - 1){
        count = 0;
    }
}

function displayTweet(tweet_index){
    $('.debug').html(tweet_index);
    $('.tweet').html(tweet_array[tweet_index].text);
    $('.author').html(tweet_array[tweet_index].user.name);
    $('.timestamp').html(tweet_array[tweet_index].created_at);
    
    if(tweet_array[tweet_index].entities.media){
        $('main').css({'background-image': 'url('+ tweet_array[tweet_index].entities.media[0].media_url +')'})
    }else{
        $('main').css({'background-image': 'none'})
    }
}