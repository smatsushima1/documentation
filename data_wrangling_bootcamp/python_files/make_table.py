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

#data = pickle.load( open( "/home/master/my_python/data_wrangling/twitter_data_Trump_SINCE.p", "rb" ))

def create_table(): 
	# Connecting to database
	try:
	    conn = psycopg2.connect("dbname='postgres' user='openpg' host='localhost' password='new_user_password'")
	    #print "postgresql database wrangleDB has been opened and a connection exists"
	except:
	    print "I am unable to connect to the database - make_table.py"

	# Open a cursor to perform database operations
	cur = conn.cursor()

	cur.execute("CREATE TABLE testall (master_ID SERIAL PRIMARY KEY, party TEXT, topic TEXT, contributors TEXT,truncated TEXT, \
		tw_text TEXT, is_quote_status TEXT, in_reply_to_status_id TEXT, id1 TEXT, favorite_count TEXT, \
		author TEXT, geo TEXT, in_reply_to_user_id_str TEXT, lang TEXT, created_at TEXT, in_reply_to_status_id_str TEXT, \
		place TEXT, source TEXT, retweeted TEXT, follow_request_sent TEXT, has_extended_profile TEXT, \
		profile_use_background_image TEXT, profile_sidebar_fill_color TEXT, id2 TEXT, verified TEXT, entities TEXT, \
		profile_image_url_https TEXT, geo_enabled TEXT, profile_text_color TEXT, followers_count TEXT, \
		profile_sidebar_border_color TEXT, id_str TEXT, default_profile_image TEXT, location TEXT, is_translation_enabled TEXT, \
		utc_offset TEXT, statuses_count TEXT, description TEXT, friends_count TEXT, profile_link_color TEXT, \
		profile_image_url TEXT, notifications TEXT, profile_background_image_url_https TEXT, profile_background_color TEXT, \
		profile_banner_url TEXT, profile_background_image_url TEXT, screen_name TEXT, lang2 TEXT, profile_background_tile TEXT, \
		favourites_count TEXT, name TEXT, url TEXT, created_at2 TEXT, contributors_enabled TEXT, time_zone TEXT, protected TEXT,\
		 default_profile TEXT, is_translator TEXT, listed_count TEXT)")

	conn.commit()
	print "Table created"
	return

	

