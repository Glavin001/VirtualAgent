from elasticsearch import Elasticsearch
import urllib2
import requests
import json
import os

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

PATH_TO_DATA = os.getcwd()[:-7] + 'data/'

#es.index(index='my-index', doc_type='test-type', id=i, body=json_object[0])
 


with open(PATH_TO_DATA + 'unique_keywords.json') as data_file:
	data = json.load(data_file)

skill_list = []

for skill in data:
	skill_list.append(skill)

with open(PATH_TO_DATA + 'GitHub_Jobs.json') as data_file:
	data = json.load(data_file)


for i in range(len(data)):

	es.index(index='github_jobs', doc_type='test-type',id = i, body = data[i])	

print es.search(index='github_jobs', body={"query": {"match": {'description':'interest'}}})