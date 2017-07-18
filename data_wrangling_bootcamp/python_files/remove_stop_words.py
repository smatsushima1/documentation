#!/usr/bin/python

import string
import csv

def get_stops():
	with open('stopwords.csv', 'rb') as f:
	    reader = csv.reader(f)
	    stops = list(reader)
	stopwords=[]
	sz = len(stops)-1
	for x in range(0, sz):
		w = stops[x][0]
		stopwords.append(w)
	return stopwords

def remove_stop_words(text):
	stopwords = get_stops()
	new = []
	words = text.split()
	for w in words:
		w = w.lower()
		if w in stopwords:
			w = ''
		else:
			new.append(w)
	s = ' '
	seq = s.join( new )
	return seq

