#!/usr/bin/python
print "Content-type: text/plain"
print

import urllib2, json, pprint, operator, cgi
form = cgi.FieldStorage()

address = 'http://api.tumblr.com/v2/blog/' + form['username'].value + '.tumblr.com/posts?api_key=H5WRMruB7dtatrPairlLfPVtDEEfNtoZSfEt48GJTCxOhkn9Hg'

pp = pprint.PrettyPrinter(indent=4)
f = urllib2.urlopen(address)
info = json.loads(f.read())
posts = info['response']['blog']['posts']

if posts % 20 > 0:
	loop_num = (posts / 20) + 2
else:
	loop_num = posts / 20 + 1

tags = {}

for x in xrange(0,loop_num):
	
	y = x * 20
	g = urllib2.urlopen(address + '&offset=' + str(y))

	feed = json.loads(g.read())

	for post in feed['response']['posts']:
		for tag in post['tags']:
			tag = tag.lower()
			if tag not in tags:
				tags[tag] = 1

			else:
				tags[tag] += 1

for tag in tags.keys():
	if tags[tag] < int(form['limit'].value):
		del tags[tag]

sorted_tags = sorted(tags.iteritems(), key=operator.itemgetter(1), reverse=True)
# pp.pprint(sorted_tags)
print json.dumps(sorted_tags)


