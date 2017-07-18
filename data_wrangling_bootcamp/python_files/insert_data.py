#!/usr/bin/python

import tweepy
import psycopg2
import psycopg2.extensions
from   psycopg2.extensions import AsIs
import psycopg2.extras
import pickle
import string
import pandas as pd
import string

def insert_data(data, party, topic):
	all_cols = ["follow_request_sent", "has_extended_profile", "profile_use_background_image", \
	            "profile_sidebar_fill_color", "id1", "verified", "entities", "profile_image_url_https",\
	            "geo_enabled", "profile_text_color", "followers_count", "profile_sidebar_border_color", \
	            "id_str", "default_profile_image", "location", "is_translation_enabled", "utc_offset", \
	            "statuses_count", "description", "friends_count", "profile_link_color", \
	            "profile_image_url", "notifications", "profile_background_image_url_https", \
	            "profile_background_color", "profile_banner_url", "profile_background_image_url",\
	            "screen_name", "lang", "profile_background_tile", "favourites_count", \
	            "name", "url", "created_at", "contributors_enabled", "time_zone", "protected", \
	            "default_profile", "is_translator", "listed_count","contributors","truncated", \
	            "text", "is_quote_status", "in_reply_to_status_id", "id2", "favorite_count", \
	            "author", "geo", "in_reply_to_user_id_str", "lang2", "created_at2", \
	            "in_reply_to_status_id_str", "place", "source", "retweeted"]

	user = ["follow_request_sent", "has_extended_profile", "profile_use_background_image", \
			"profile_sidebar_fill_color", "id", "verified", "entities", "profile_image_url_https",\
			 "geo_enabled", "profile_text_color", "followers_count", "profile_sidebar_border_color", \
			 "id_str", "default_profile_image", "location", "is_translation_enabled", "utc_offset", \
			 "statuses_count", "description", "friends_count", "profile_link_color", \
			 "profile_image_url", "notifications", "profile_background_image_url_https", \
			 "profile_background_color", "profile_banner_url", "profile_background_image_url",\
			  "screen_name", "lang", "profile_background_tile", "favourites_count", \
			  "name", "url", "created_at", "contributors_enabled", "time_zone", "protected", \
			  "default_profile", "is_translator", "listed_count"]

	tweet_attributes = ["contributors","truncated", "text", "is_quote_status", "in_reply_to_status_id", \
						"id", "favorite_count", "author", "geo", "in_reply_to_user_id_str", "lang", \
						"created_at", "in_reply_to_status_id_str", "place", "source", "retweeted"]

	l = len(data["statuses"]) - 1
	for i in range(0, l):
		tweet = (data["statuses"][i])
		tweet_attribute_list = []
		tweet_attribute_list.append(party)
		tweet_attribute_list.append(topic)
		for x in tweet_attributes:
			if x in tweet.keys():
				x = tweet[x]
				if type(x) == dict:
					x = "NA"
				tweet_attribute_list.append(x)
				#print x
			else:
				tweet_attribute_list.append("NA")
		for y in user:
			if y in tweet["user"].keys():
				y = tweet["user"][y]
				if type(y) == dict:
					y = "NA"
				tweet_attribute_list.append(y)
			else:
				tweet_attribute_list.append("NA")

		#print "Total number of attributes appended to the list: ", len(tweet_attribute_list)
		tweet_data_tuple = tuple(tweet_attribute_list)
		#print "They type is: ", type(tweet_data_tuple), " length: ", len(tweet_data_tuple)

		all_cols_t = tuple(all_cols)
		
		# Insert Data into Table
		# Connecting to database
		try:
		    conn = psycopg2.connect("dbname='postgres' user='openpg' host='localhost' password='new_user_password'")
		    #print "postgresql database wrangleDB has been opened and a connection exists"
		except:
		    print "I am unable to connect to the database - insert_data.py"

		# Open a cursor to perform database operations
		cur = conn.cursor() 

		query = "INSERT INTO testall (party, topic, contributors,truncated, tw_text, \
				is_quote_status, in_reply_to_status_id, \
		        id1, favorite_count, author, geo, in_reply_to_user_id_str, lang, \
		        created_at, in_reply_to_status_id_str, place, source, retweeted, \
		        follow_request_sent, has_extended_profile, profile_use_background_image, \
		        profile_sidebar_fill_color, id2, verified, entities, profile_image_url_https,\
		        geo_enabled, profile_text_color, followers_count, profile_sidebar_border_color, \
		        id_str, default_profile_image, location, is_translation_enabled, utc_offset, \
		        statuses_count, description, friends_count, profile_link_color, \
		        profile_image_url, notifications, profile_background_image_url_https, \
		        profile_background_color, profile_banner_url, profile_background_image_url,\
		        screen_name, lang2, profile_background_tile, favourites_count, \
		        name, url, created_at2, contributors_enabled, time_zone, protected, \
		        default_profile, is_translator, listed_count) \
		        VALUES \
		        (%s,%s,%s,%s,%s,%s,%s, %s,%s,%s,%s,%s, %s,%s,%s,%s,%s, %s,%s,%s,%s,%s, %s,%s,%s,%s,%s,\
		        %s,%s,%s,%s,%s, %s,%s,%s,%s,%s, %s,%s,%s,%s,%s, %s,%s,%s,%s,%s, %s,%s,%s,%s,%s, \
		        %s,%s,%s,%s,%s, %s);"

		cur.execute(query, tweet_data_tuple)

		#print "New columns added to table."

		conn.commit()
	return	