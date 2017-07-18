#!/usr/bin/python

import urllib
import urllib2
import json
import re
import pickle
from apiclient.discovery import build



def get_keys():
	keys = open('/home/master/my_python/google_geocode_key.txt', 'rb') 
	geo_key = []
	geo_key = keys.read()
	geo_key = geo_key.split()

	key_dict = {}
	key_dict["key"] = geo_key[1]
	return key_dict

def google_api_pull(location):
	#key = get_keys()['key']
	key = "AIzaSyAlaMXG4dOt5-ot2MKhPVtajWPyDznrQaA"
	base = "https://maps.googleapis.com/maps/api/geocode/json?address="
	url = base + location + '&key=' + key
	url = url.replace("'", '')
	url = url.replace(" ", '_')

	response = urllib2.urlopen(url)
	#answer = response.read()
	answer = json.load(response)

	d_lat = answer['results'][0]['geometry']['bounds']['northeast']['lat']
	d_lng = answer['results'][0]['geometry']['bounds']['northeast']['lng']

	tuple1 = (d_lat, d_lng)

	return tuple1


def get_location(location):
	locations = pickle.load( open( "lat_lng_locations.p", "rb" ) )

	if location in locations:
		print "location submitted already exists."
		tuple1 = locations.get(location)
		print tuple1
	else:
		tuple1 = google_api_pull(location)
		locations[location] = tuple1

	pickle.dump( locations, open( "lat_lng_locations.p", "wb" ) )
	return tuple1