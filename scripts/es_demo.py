import requests
import os
import json

# Constants

PATH_TO_DATA = os.getcwd()[:-7] + 'data/'

# Determine if ES is operational

res = requests.get('http://localhost:9200')
res.content

from elasticsearch import Elasticsearch
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

with open(PATH_TO_DATA + 'GitHub_Jobs.json') as data_file:
	GH_data = json.load(data_file)


with open(PATH_TO_DATA + 'StackOverflow_Jobs.json') as data_file:
	SO_data = json.load(data_file)

combined_jobs = GH_data + SO_data



