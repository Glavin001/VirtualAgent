import feedparser

stackRSS = feedparser.parse('http://stackoverflow.com/jobs/feed')
for post in stackRSS.entries:
	print post.title + ": " + post.link + '\n'