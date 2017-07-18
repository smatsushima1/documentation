# -*- coding: utf-8 -*-
#!/usr/bin/python
import tweepy
import psycopg2
import psycopg2.extensions
from   psycopg2.extensions import AsIs
import psycopg2.extras
import pickle
import string
import numpy as np
import pandas as pd
import string
import csv
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
from mpl_toolkits.basemap import Basemap, cm
import seaborn as sns


import remove_stop_words as stop

global negative
global positive

def clean_text(twt):
	# cleaning the text using basic string approach
	twt = twt.lower()
	# letters / characters to keep
	good = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
		    't' 'u', 'v', 'w', 'x', 'y', 'z', ' ']
	# convert to unicode
	twt = unicode(twt, 'utf-8')
	# loop through text and only keep lowercase letters
	for c in twt:
		for x in c:
			if x not in good:
				twt = twt.replace(x, '')
	return twt

def sentiment(twt):
	global negative, positive
	word_list = twt.split(' ')
	total, pos, neg = 0,0,0
	for word in word_list:
		if word in negative:
			neg += 1.0
		if word in positive:
			pos += 1.0
		total += 1
	twt_sent = (pos - neg) / total
	return twt_sent

def sentiment_overall(subject):
	global negative, positive
	# used only for naming the columns 
	all_cols = ['master_ID', 'party', 'topic', 'contributors','truncated', 'tw_text', \
				'is_quote_status', 'in_reply_to_status_id', \
		        'id1', 'favorite_count', 'author', 'geo', 'in_reply_to_user_id_str', 'lang', \
		        'created_at', 'in_reply_to_status_id_str', 'place', 'source', 'retweeted', \
		        'follow_request_sent', 'has_extended_profile', 'profile_use_background_image', \
		        'profile_sidebar_fill_color', 'id2', 'verified', 'entities', 'profile_image_url_https',\
		        'geo_enabled', 'profile_text_color', 'followers_count', 'profile_sidebar_border_color', \
		        'id_str', 'default_profile_image', 'location', 'is_translation_enabled', 'utc_offset', \
		        'statuses_count', 'description', 'friends_count', 'profile_link_color', \
		        'profile_image_url', 'notifications', 'profile_background_image_url_https', \
		        'profile_background_color', 'profile_banner_url', 'profile_background_image_url',\
		        'screen_name', 'lang2', 'profile_background_tile', 'favourites_count', \
		        'name', 'url', 'created_at2', 'contributors_enabled', 'time_zone', 'protected', \
		        'default_profile', 'is_translator', 'listed_count']

	# List of characters to be removed - regex can do this automatically import re
	char_remove = ['!','@','#','$','%','^','&','*','(',')','<','>','?',',','.','/','\\','|',';',':','`','~','-','_','=','+',
				   '[',']','{','}',"'",'"','...', '1','2','3','4','5','6','7','8', '9','0']

	# Open lexicon file and load it into lists for determining positive and negeative sentiment of words
	with open('lexicon.csv', 'rb') as f:
	    reader = csv.reader(f)
	    sentiment_list = list(reader)

	# Sentiment lists
	negative = []
	positive = []

	# Load sentiment list
	for row in sentiment_list:
		if (row[1] == 'negative'):
			negative.append(row[0])
		else:
			positive.append(row[0])

	# connect to the database and pull down data
	try:
	    conn = psycopg2.connect("dbname='postgres' user='openpg' host='localhost' password='new_user_password'")
	    print "postgresql database wrangleDB has been opened and a connection exists"
	except:
	    print "I am unable to connect to the database"

	# get info from db
	cur = conn.cursor()
	query = "SELECT * FROM testall WHERE topic = '%s'" % (subject)
	query = query.replace('"','')
	print query
	try:
	    cur.execute(query)
	except:
	    print "I can't SELECT from testall - text_sentiment_analysis.py"

	rows = cur.fetchall()

	pd_data = pd.DataFrame(rows, columns=all_cols)
	#del pd_data['sentiment']
	pd_data['sentiment'] = pd_data['tw_text'].map(clean_text).map(stop.remove_stop_words).map(sentiment)
	
	# Seaborn Histogram
	''' represents the distribution of data by forming bins along the range of the 
	    data and then drawing bars to show the number of observations that fall in each bin.'''   
	
	if pd_data['sentiment'].empty:
		print "No tweets to chart"
	else:
		sns.distplot(pd_data['sentiment'], kde=False, bins=5, rug=True)
		if subject == ' ':
			subject = 'unknown'
		sns.plt.title('Sentiment Distribution: %s' % subject)
		sns.plt.xlabel("Sentiment", fontsize=18)
		sns.plt.ylabel("Number of Tweets", fontsize=18)
		plt.show()
	
	geo_data = pd_data[['party','topic','sentiment','location', 'created_at']]
	
	return geo_data