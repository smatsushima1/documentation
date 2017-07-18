# https://learnpythonthehardway.org/book/ex32.html

def install_and_import(package):
    print package
    import importlib
    try:
        importlib.import_module(package)
    except ImportError:
        import pip
        pip.main(['install', package])
    finally:
        globals()[package] = importlib.import_module(package)


modules = ['apiclient.discovery', 'csv', 'google_geocode', 'json', 'matplotlib.pyplot', 'mpl_toolkits.basemap', 'mpl_toolkits.basemap', 'numpy', 'pandas', 'pickle', 'psycopg2', 'psycopg2.extensions', 'psycopg2.extras', 're', 'seaborn', 'string', 'tweepy', 'twitter_pull', 'urllib', 'urllib2', 'piclient.discovery']

for m in modules:
    install_and_import(m)
