#!/usr/bin/python

import psycopg2

def check_if_exist():
	# Connecting to database
	try:
		conn = psycopg2.connect("dbname='postgres' user='openpg' host='localhost' password='new_user_password'")
	    #print "postgresql database wrangleDB has been opened and a connection exists"
	except:
	    print "I am unable to connect to the database - table_exists.py"

	# Open a cursor to perform database operations
	cur = conn.cursor()

	cur.execute("SELECT EXISTS(SELECT * FROM information_schema.tables where table_name=%s)", ('testall',))
	tbl_exist = cur.fetchone()[0]

	#print "TABLE EXIST\n"
	return tbl_exist