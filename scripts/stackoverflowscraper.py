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
				uniqueAttributes.append((post[key]))
	return uniqueAttributes

#Initialize feed
myFeed = initializeFeed('http://stackoverflow.com/jobs/feed')

#Compute all unique categories of stackoverflow job postings
categories = getUniqueAttributes(myFeed, 'category')
print categories
#Compute all unique titles of stackoverflow job postings
titles = getUniqueAttributes(myFeed, 'title')

print '\n' + str(titles)


"""
#Code to show nicely all the titles
for theString in titles:
	print '\n'
	count += 1
	print count
	#print u' '.join(theString).encode('utf-8').strip()
	print theString.encode('utf-8')
"""