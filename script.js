$(document).ready(function(){
    console.log('Hello world!');
    $.ajax({
		url: 'get_tweets.php',
		type: 'GET',
		success: function(response) { 
            console.log(response.statuses);
            
            for(i in response.statuses){
                console.log(response.statuses[i].text);
            }
            
            $('.tweet').html(response.statuses[0].text);
            $('.author').html(response.statuses[0].user.name);
            $('.timestamp').html(response.statuses[0].created_at);

		},
		error: function(errors) {
			console.log('Error: ' + errors);
		}
	});
})