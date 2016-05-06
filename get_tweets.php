<?php

require_once('twitter_proxy.php');

// Twitter OAuth Config options
$oauth_access_token = '465928689-7gAbhYSCGmuSkWiCVWPRCev3qmQ31htfDk5E2i0u';
$oauth_access_token_secret = 'wB7bdwFxDyhZR5joBNckdIRN2F17SGN9QOiVlLzOTs0yS';
$consumer_key = 'UBUIPqMEJC6SmzGcy9VrQnQYI';
$consumer_secret = 'cAklXOStxBzt1lFnuo2AwnTiV2ZYBbaWYRuRZhdPZucBhopTXS';
$user_id = '465928689';
$screen_name = 'TimTurnidge';
$count = 5;
$search_param = '%23coca4';

$twitter_url = 'search/tweets.json';
$twitter_url .= '?q=' . $search_param;

//$twitter_url .= '?user_id=' . $user_id;
//$twitter_url .= '&screen_name=' . $screen_name;
//$twitter_url .= '&count=' . $count;

$twitter_proxy = new TwitterProxy(
	$oauth_access_token,			// 'Access token' on https://apps.twitter.com
	$oauth_access_token_secret,		// 'Access token secret' on https://apps.twitter.com
	$consumer_key,					// 'API key' on https://apps.twitter.com
	$consumer_secret,				// 'API secret' on https://apps.twitter.com
	$user_id,						// User id (http://gettwitterid.com/)
	$screen_name,					// Twitter handle
	$count							// The number of tweets to pull out
);

// Invoke the get method to retrieve results via a cURL request
$tweets = $twitter_proxy->get($twitter_url);

echo $tweets;

?>