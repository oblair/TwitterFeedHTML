var tweet_array = [];
var timer;
var delay = 10000;               // milliseconds:int; time delay between tweets
var loops_to_reset = 1;         // loops:int; how many times to loop through the tweets before refreshing
var count = 99;
var loops = 0;

$(document).ready(function(){
    getTweets();
    initControl();
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
            if(count > tweet_array.length){
                count = tweet_array.length - 1;
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
    if(count < 0){
        count = 99;
        loops++;
        if(loops == loops_to_reset){
            reset();
        }
    } else {
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
    
//    var tweet_text = tweet_array[tweet_index].text;
    
    if(tweet_array[tweet_index].entities.media){
        // Tweet contains image
        var display_ratio = $(document).width() / $(document).height();
        var image_ratio = tweet_array[tweet_index].entities.media[0].sizes.large.w / tweet_array[tweet_index].entities.media[0].sizes.large.h
        var top_left = randomBoolean();
        
        $('main').css({'background-image': 'url('+ tweet_array[tweet_index].entities.media[0].media_url +')'});
        $('.tweet-image').attr({'src': tweet_array[tweet_index].entities.media[0].media_url}).css({'visibility':'visible'});
        if(display_ratio >= image_ratio){
            //image is narrow
            $('.tweet-image').css({'width': 'auto', 'height': '100%'});
            if(top_left){
                // image on left
                console.log('left');
                $('.tweet-image').css({
                    'left': '0', 
                    'right': 'auto'
                });
                $('article').css({
                    'top': randomBetween(0, $(window).height() - $('article').outerHeight()) +'px',
                    'right': '0',
                    'bottom': 'auto',
                    'left': 'auto'
                });
            }else{
                // image on right
                console.log('right');
                $('.tweet-image').css({'left': 'auto', 'right': '0'});
                $('article').css({
                    'top': randomBetween(0, $(window).height() - $('article').outerHeight()) +'px',
                    'right': 'auto',
                    'bottom': 'auto',
                    'left': '0'
                });
            }
        }else{
            //image is wide
            $('.tweet-image').css({'width': '100%', 'height': 'auto'});
            if(top_left){
                // image on top
                console.log('top');
                $('.tweet-image').css({'top': '0', 'bottom': 'auto'});
                $('article').css({
                    'top': 'auto',
                    'right': 'auto',
                    'bottom': '0',
                    'left': randomBetween(0, $(window).width() - $('article').outerWidth()) +'px',
                });
            }else{
                // image on bottom
                console.log('bottom');
                $('.tweet-image').css({'top': 'auto', 'bottom': '0'});
                $('article').css({
                    'top': '0',
                    'right': 'auto',
                    'bottom': 'auto',
                    'left': randomBetween(0, $(window).width() - $('article').outerWidth()) +'px',
                });
            }
        }
    }else{
        // Tweet contains no image
        $('main').css({'background-image': 'none'});
        $('.tweet-image').attr({'src': '#'}).css({'visibility':'hidden'});
        $('article').css({
            'top': randomBetween(0, $(window).height() - $('article').outerHeight()) +'px',
            'right': 'auto',
            'bottom': 'auto',
            'left': randomBetween(0, $(window).width() - $('article').outerWidth()) +'px',
        });
    }

    
    if(tweet_array[tweet_index].retweeted_status){
        $('.tweet-type').html('retweeted');
        
    }else{
        $('.tweet-type').html('tweeted');
    }
    
    highlight('/(#)(\\w+)|(#)/', 'hashtag');
    highlight('/(@)(\\w+)|(@)/', 'user'); 
    
    //articlesize();
}

function articlesize(){
    // set article size
    
    
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
        tick();
    });
    $(document).keypress(function(e){
        if(e.which == 32){  // space
            clearInterval(timer);
        }
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

function randomBoolean(){
    var r = Math.random();
    if(r > 0.5){
        return true;
    }else{
        return false;
    }
}

function randomBetween(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}