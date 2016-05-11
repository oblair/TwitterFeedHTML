var tweet_array = [];
var timer;
var delay = 5000;               // milliseconds:int; time delay between tweets
var count = 0;

$(document).ready(function(){
    getTweets();
    initControl();
});

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
    count++;
    if(count > tweet_array.length - 1){
        count = 0;
    }
}

function displayTweet(tweet_index){
    $('.debug').html(tweet_index);
    $('.tweet').html(tweet_array[tweet_index].text);
    $('.metadata img').attr('src', tweet_array[tweet_index].user.profile_image_url);
    $('.name').html(tweet_array[tweet_index].user.name);
    $('.screen-name').html('@' + tweet_array[tweet_index].user.screen_name);
    $('.timestamp').html(parseTwitterDate(tweet_array[tweet_index].created_at));
    
        var tweet_text = tweet_array[tweet_index].text;
    var n = tweet_text.indexOf(' #');
    console.log(n);
    
    if(tweet_array[tweet_index].entities.media){
        $('main').css({'background-image': 'url('+ tweet_array[tweet_index].entities.media[0].media_url +')'});
//        if(tweet_array[tweet_index].entities.media[0].sizes.large.h >= tweet_array[tweet_index].entities.media[0].sizes.large.w){
//            //portrait
//            $('main').css({'background-position': 'right'});
//        }else{
//            //landscape
//        }
    }else{
        $('main').css({'background-image': 'none'})
    }
    
    if(tweet_array[tweet_index].retweeted_status){
        $('.tweet-type').html('retweeted');
    }else{
        $('.tweet-type').html('tweeted');
    }
    
    scanText();
}

function initControl(){
    $('main').click(function(){
        clearInterval(timer);
    })
}

function scanText(){
    $('.tweet').highlight("#+\w+.\b");
}

// thanks Brady: http://stackoverflow.com/users/367154/brady
function parseTwitterDate(twitter_date) {
    var system_date = new Date(Date.parse(twitter_date));
    var now_date = new Date();
    if (K.ie) {
        system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
    }
    var diff = Math.floor((now_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 777600) {return "1 week ago";}
    return "on " + system_date;
}

// from http://widgets.twimg.com/j/1/widget.js
var K = function () {
    var a = navigator.userAgent;
    return {
        ie: a.match(/MSIE\s([^;]*)/)
    }
}();
