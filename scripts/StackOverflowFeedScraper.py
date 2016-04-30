"""
Author: Conor Scott
Date: 04/29/16
Volta Hackathon

Purpose: Scraping StackOverflow for job postings

Requirements: feedparser
"""

import feedparser

#Initializes feed to a RSS link
def initializeFeed(link):
	#Link to RSS Feed
	#Initialize RSS feed
	feed = feedparser.parse(link)
	return feed

#Get unique attributes of a type, e.g. 'title' or 'category' as a valid key 
def getUniqueAttributes(Feed, key, allowDuplicates = False):
	uniqueAttributes = None
	if allowDuplicates:
		uniqueAttributes = []
	else:
		uniqueAttributes = set()

	for post in Feed.entries:
		if key in post:
			if not allowDuplicates:
				uniqueAttributes.add((post[key.encode('utf-8')]))
			else:
				uniqueAttributes.append((post[key.encode('utf-8')]))
	return uniqueAttributes

#Initialize feed
myFeed = initializeFeed('http://stackoverflow.com/jobs/feed')

"""
Compute all unique categories of stackoverflow job postings, all 
relevant categories are in respective sets avoiding duplicates
"""

categories = getUniqueAttributes(myFeed, 'category')

titles = getUniqueAttributes(myFeed, 'title')

link = getUniqueAttributes(myFeed, 'link')

locations = getUniqueAttributes(myFeed, 'location')

dates = getUniqueAttributes(myFeed, 'date')

authors = getUniqueAttributes(myFeed, 'author')

updated = getUniqueAttributes(myFeed, 'updated')

descriptions = getUniqueAttributes(myFeed, 'description')

"""
Author: Conor Scott
Date: 04/29/16
Volta Hackathon

Purpose: Unique tags (Like Java) from stackoverflow are obtained from 
the json file I copied from their website API that obtains 
them 100 at a time, and compiled 1000 of the most popular
tags

Requirements: just python (comes with json)
"""
import json, os

p = os.path.abspath('..')
jsonObject = json.load(open(p + "\data\\tags.json", 'r'))
tags = set()
for dictionary in jsonObject['items']:
    for key in dictionary:
        if key == 'name':
            tags.add(dictionary[key])

def loadResume(filename):
	p = os.path.abspath('..')
	jsonObject = json.load(open(p + filename, 'r'))
	return jsonObject

def getSkills(resume):
	return resume['skills']

def getUniqueSkills(skills):
	a = set()
	for keyword in skills: 
		for item in keyword['keywords']:
			a.add(item)
	return a

#Get Aaron's Skills from his resume
#uniqueSkills = getUniqueSkills(getSkills(loadResume("\data\\resumes\\aaron.json")))

#unionOfCategoriesAndSkills = list(set(categories) | set(uniqueSkills))

uniques = sorted(list(set(categories) | set(tags)))

nonUTF8 = []
with open('stackoverflow_unique_values.json', 'w') as f:
	f.write("[")
	for index, tag in enumerate(uniques):
		a = tag.decode('utf-8')
		if index == len(uniques)-1:
			f.write(a + "]")
		else:
			f.write(a + ", ")
	f.close()