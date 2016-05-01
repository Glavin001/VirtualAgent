from elasticsearch import Elasticsearch
import urllib2
import requests
import json

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

response = urllib2.urlopen('https://jobs.github.com/positions.json' + '?page=' + str(0))
json_object = json.load(response)

for i in range
es.index(index='my-index', doc_type='test-type', id=i, body=json_object[0])
i=i+1
 
print(i)


with open(PATH_TO_DATA + 'unique_keywords.json') as data_file:
	data = json.load(data_file)

skill_list = []
for skill in data:
	skill_list.append(skill)


	