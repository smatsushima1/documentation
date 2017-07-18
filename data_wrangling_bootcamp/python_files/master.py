#!/usr/bin/python
import pickle 
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

import twitter_pull as tp
import make_table as mt
import table_exist as cx
import insert_data as da
import text_sentiment_analysis as sen
import map_test as mp

def config_file():
	config = open('config.txt', 'rb') 
	twitter_config = []
	twitter_config = config.read()
	twitter_config = twitter_config.split(':')

	config_dict = {}
	config_dict["search 1T"] = twitter_config[3]
	config_dict["search 2T"] = twitter_config[5]
	config_dict["search 3T"] = twitter_config[7]
	config_dict["search 4T"] = twitter_config[9]
	config_dict["search 5T"] = twitter_config[11]
	config_dict["search 1H"] = twitter_config[15]
	config_dict["search 2H"] = twitter_config[17]
	config_dict["search 3H"] = twitter_config[19]
	config_dict["search 4H"] = twitter_config[21]
	config_dict["search 5H"] = twitter_config[23]

	return config_dict

# Function to see if a table has already been created for the data dump
tbl_exist = cx.check_if_exist()
if (tbl_exist):
	print "Table Exists"
else:
	mt.create_table()


config = config_file()
for key, val in config.items():
	p = None
	p = key.find('T')
	if p>1:
		party = 'Trump'
	else:
		party = 'Hillary'
	pulls_per_search = 10
	data = tp.twitter(val, pulls_per_search )
	topic = str(val)
	topic = topic.replace('"','')
	# Function to see if a table has already been created for the data dump
	tbl_exist = cx.check_if_exist()
	print "Insert: %s a %s tweet." % (topic, party)
	da.insert_data(data, party, topic)

#data = pickle.load( open( "/home/master/my_python/data_wrangling/twitter_data_Trump_SINCE.p", "rb" ))
geo_cols = ['party', 'topic', 'sentiment', 'location', 'created_at']	
geo_df = pd.DataFrame(columns=geo_cols)
for key, val in config.items():
	topic = str(val)
	topic = topic.replace('"','')
	current_df = sen.sentiment_overall(topic)
	geo_df = geo_df.append(current_df)
print "Generating map, this may take a few moments."
hillary_test = geo_df.loc[geo_df['party'] == 'Hillary']
trump_test = geo_df.loc[geo_df['party'] == 'Trump']
#print hillary_test.head(30)
mp.make_map(geo_df)
trump_time = trump_test.groupby('created_at').sum()
trump_time.plot(subplots=True, figsize=(6,6), style='k--', label='Series')
plt.title('Trump Sentiment Over Time')
plt.show()
hillary_time = hillary_test.groupby('created_at').sum()
hillary_time.plot(subplots=True, figsize=(6,6), style='k--', label='Series')
plt.title('Hillary Sentiment Over Time')
plt.show()
#print trump_time.head(20)
print "PROGRAM END"