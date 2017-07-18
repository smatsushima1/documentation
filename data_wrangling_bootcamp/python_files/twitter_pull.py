#!/usr/bin/python

import tweepy
import psycopg2
import pickle



def get_keys():
	keys = open('/home/master/my_python/twitter_keys.txt', 'rb') 
	twitter_keys = []
	twitter_keys = keys.read()
	twitter_keys = twitter_keys.split()

	key_dict = {}
	key_dict["consumer_key"] = twitter_keys[2]
	key_dict["consumer_secret"] = twitter_keys[5]
	key_dict["access_token"] = twitter_keys[8]
	key_dict["access_token_secret"] = twitter_keys[11]
	return key_dict


def twitter(search_topic, cnt):
	#print "Calling function to get secret Twitter API keys."
	#key_dict = get_keys()
	consumer_key = "4UBIRPDtdS42Gi9hEJJ4tVmIR"
	consumer_secret = "8xOO11K08PRCOeXtYzbj5n0Y3NcwmQIJJOAwwHkR2XpRyplh1A"
	access_token = "4861964469-bzWde7WVRC9SjMQwI7TaCdKMxw0vdtX09fy4meZ"
	access_token_secret = "udlAYL0H5cxFFLt3UjqffI1k6e2WNbSRUrVT9fzNg0HL2"
	auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
	auth.set_access_token(access_token, access_token_secret)
	api = tweepy.API(auth, parser=tweepy.parsers.JSONParser())
	public_tweets = api.search(q=search_topic, count=cnt, lang="en") #  since="2013-06-01" ,  show_user="true"
	#pickle.dump( public_tweets, open( "twitter_data_Trump_SINCE.p", "wb" ) )
	#print "END"
	return public_tweets