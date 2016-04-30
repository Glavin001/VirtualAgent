import json
import urllib2
import os
import string

PATH_TO_DATA = os.getcwd()[:-7] + 'data/'

# Load skill-map.json

with open(PATH_TO_DATA + 'skill-map.json') as data_file:
	data = json.load(data_file)


skill_list = []

for entry in data:

	skill_list.append(entry.encode('utf-8'))

def get_jobs(page=0):
	''' Returns all jobs on a specified github careers page as a json object.
	'''

	response = urllib2.urlopen('https://jobs.github.com/positions.json' + '?page=' + str(page))
	json_object = json.load(response)

	return json_object

def get_description(json_job):
	''' Extracts and returns the description text from a json_job as a string.
	'''

	description_text = json_job['description']

	return description_text.encode('utf-8')

def get_keywords(text, key_words_list):
	''' Return a list of the keywords found in the text that also appear in the given key word list. 
	'''

	found_words = []

	for word in key_words_list:
		if word in text:
			found_words.append(word)

	return found_words

def get_all_jobs():

	index = 0
	while get_jobs(index) != []:

		get_jobs(index)

	return 'none'

print type(get_jobs()[0])






