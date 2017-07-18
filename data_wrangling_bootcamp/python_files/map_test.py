#!/usr/bin/python

from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from mpl_toolkits.basemap import Basemap, cm
from google_geocode import get_location
import string

def make_map(df):
  m = Basemap(llcrnrlon=-119, llcrnrlat=22, urcrnrlon=-64, urcrnrlat=49, projection='lcc', lat_1=33, lat_2=45,
              lon_0=-95, resolution='h', area_thresh=10000)
  
  trump_places = df.loc[df['party'] == 'Trump']
  #print trump_places.head(10)
  #Tplaces_count = trump_places[['location']].groupby('location').tolist()
  Tplaces=trump_places['location'].unique().tolist()
  
  Tlat, Tlng = [], []
  for place in Tplaces:
    try:
      spot = get_location(place)
      Tlat.append(spot[0])
      Tlng.append(spot[1])
    except:
      print "The twitter location: %s cannot be located" % place

  hillary_places = df.loc[df['party'] == 'Hillary']
  #print hillary_places.head(10)
  #Hplaces_count = hillary_places[['location']].groupby('location').size().tolist()
  Hplaces=hillary_places['location'].unique().tolist()

  Hlat, Hlng, spoth = [], [], []
  for place in Hplaces:
    try:
      spoth = get_location(place)
      Hlat.append(spoth[0])
      Hlng.append(spoth[1])
    except:
      print "H: The twitter location: %s cannot be located" % place
  
  
  m.bluemarble()
  m.drawcoastlines()
  m.drawcountries(linewidth=3)
  m.drawmapboundary()
  m.drawstates()
  m.drawparallels(np.arange(25,65,20),labels=[1,0,0,0])
  m.drawmeridians(np.arange(-120,-40,20),labels=[0,0,0,1])

  x,y=m(Tlng, Tlat)
  m.scatter(x, y, marker='D', color='r')
  xh,yh=m(Hlng, Hlat)
  m.scatter(xh, yh, marker='D', color='b')
  Title = plt.title("Politics & Twitter: Where are the Tweets?")

  plt.show()
  return
