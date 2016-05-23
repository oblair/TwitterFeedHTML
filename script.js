var tweet_array = [];
var timer;
var delay = 10000;               // milliseconds:int; time delay between tweets
var loops_to_reset = 1;         // loops:int; how many times to loop through the tweets before refreshing
var count = 99;
var loops = 0;

$(document).ready(function(){
    getTweets();
    initControl();
    articlesize();
    highlight('/(#)(\\w+)|(#)/', 'hashtag');
    highlight('/(@)(\\w+)|(@)/', 'user');

});

$(window).resize(function(){
    articlesize();
})

function reset(){
    console.log("reset")
    loops = 0;
    tweet_array = [];
    clearInterval(timer);    
    getTweets();
};

function getTweets(){
    
    $.ajax({
		url: 'get_tweets.php',
		type: 'GET',
		success: function(response) { 
            console.log(response.statuses);
            
            for(i in response.statuses){
                tweet_array.push(response.statuses[i]);
            }
            
            console.log(tweet_array.length);
            if(count > tweet_array.length){count = tweet_array.length - 1;}

            tick();
            timer =  setInterval(tick, delay);
		},
		error: function(errors) {
			console.log('Error: ' + errors);
		}
	});
}


function tick(){
    if(count < 0){
        count = 99;
        loops++;
        if(loops == loops_to_reset){
            reset();
        }
    } else {
        console.log(count)
        displayTweet(count);
        count--;
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
    
    if(tweet_array[tweet_index].entities.media){
        var display_ratio = $(document).width() / $(document).height();
        var image_ratio = tweet_array[tweet_index].entities.media[0].sizes.large.w / tweet_array[tweet_index].entities.media[0].sizes.large.h
        
        $('main').css({'background-image': 'url('+ tweet_array[tweet_index].entities.media[0].media_url +')'});
        $('.tweet-image').attr({'src': tweet_array[tweet_index].entities.media[0].media_url}).css({'display': 'block'});
        if(display_ratio >= image_ratio){
            //image is narrow
            $('main').css({'background-position': 'right top'});
            $('.tweet-image').css({'width': 'auto', 'height': '100%'});
        }else{
            //image is wide
            $('.tweet-image').css({'width': '100%', 'height': 'auto'});
        }
    }else{
        $('main').css({'background-image': 'none'});
        $('.tweet-image').attr({'src': '#'}).css({'display': 'none'});
    }
    
    if(tweet_array[tweet_index].retweeted_status){
        $('.tweet-type').html('retweeted');
        
    }else{
        $('.tweet-type').html('tweeted');
    }
    
    highlight('/(#)(\\w+)|(#)/', 'hashtag');
    highlight('/(@)(\\w+)|(@)/', 'user'); 
    
    articlesize();
}

function articlesize(){
    // set article size
    if ( $(window).width() > $(window).height() ) {
        //landscape
        $('article').css({
            'max-width': ''+ ( $(window).width() / 3 ) +'px'
        }).addClass('landscape')
        .removeClass('portrait');
    } else {
        //portrait screen
        $('article').css({
            'max-width': ''+ ( $(window).width() / 1.5 ) +'px'
        }).removeClass('landscape')
        .addClass('portrait');
    }
    
    //random article position
    //tweet image?
    if(tweet_array[count].entities.media){
        $('article').css({
            'top': ''+ ($(window).height() - $('article').outerHeight()) - 10 +'px',
            'left': ''+ ( 10 + ( Math.random() * ( $(window).width() - $('article').outerWidth() - 20 ) ) ) +'px'
        });
    } else {
        $('article').css({
            'top': ''+ ( 10 + ( Math.random() * (( $(window).height() - $('article').outerHeight()) - 20 ) ) ) +'px',
            'left': ''+ ( 10 + ( Math.random() * ( $(window).width() - $('article').outerWidth() - 20 ) ) ) +'px'
        });
    }
}



function initControl(){
    $('main').click(function(){
//        clearInterval(timer);
        tick();
//        window.alert("sometext");
    })
}

function highlight(expression, class_name){
    var flags = expression.replace(/.*\/([gimy]*)$/, '$1');
    var pattern = expression.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
    var regex = new RegExp(pattern, flags);
    var options = {
        className: class_name
    };
    $('.tweet').markRegExp(regex, options);
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