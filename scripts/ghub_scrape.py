import json
import urllib2

skill_list = ['C++', 'C', 'c', 'C#', 'c#', 'c++']

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


print get_description(get_jobs()[0])


