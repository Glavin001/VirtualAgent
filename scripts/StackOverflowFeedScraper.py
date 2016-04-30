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