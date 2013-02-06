#!/usr/bin/python
print "Content-type: text/plain"
print

import urllib2, json, operator, cgi, tempfile
# Get posted data
form = cgi.FieldStorage()
callback = form['callback'].value
username = form['username'].value
limit = form['limit'].value

# Build api address
address = 'http://api.tumblr.com/v2/blog/' + username + '.tumblr.com/posts?api_key=H5WRMruB7dtatrPairlLfPVtDEEfNtoZSfEt48GJTCxOhkn9Hg'

#Query "info" on the tumblr account to get post count
f = urllib2.urlopen(address)
info = json.loads(f.read())
posts = info['response']['blog']['posts']

# Tumblr limits responses to 20; this gets the needed loop count
if posts % 20 > 0:
	loop_num = (posts / 20) + 2
else:
	loop_num = posts / 20 + 1

# A dict for the tags
tags = {}

for x in xrange(0,loop_num):
	
	# Set the offset number needed to get the next set of posts
	y = x * 20
	# Query for the response
	g = urllib2.urlopen(address + '&offset=' + str(y))

	# Load the json
	feed = json.loads(g.read())

	# For each post...
	for post in feed['response']['posts']:
		# For each tag in that post...
		for tag in post['tags']:
			tag = tag.lower()
			# If it's not in the tags dict yet, add it with a count of 1
			if tag not in tags:
				tags[tag] = 1
			# If it is in there, increase its count
			else:
				tags[tag] += 1

# For each tag in the dict...
for tag in tags.keys():
	# If the tag's count is less than the posted limit, get rid of it
	if tags[tag] < int(limit):
		del tags[tag]

# Most-used tags first
sorted_tags = sorted(tags.iteritems(), key=operator.itemgetter(1), reverse=True)
# Back to json, purty indenting
dump = json.dumps(sorted_tags, indent=4)

#Set the temp file dir
temp_dir = 'tmp/'
# Append each temp file with "username_"
temp_prefix = username + '_'
# Create the temp file
tf = tempfile.NamedTemporaryFile(
									delete=False,
									dir=temp_dir,
									prefix=temp_prefix,
									suffix='.json'
								)
tf_name = tf.name
name_split = tf_name.split('/')
tf_name = name_split[len(name_split) - 1]

# Write the json to the temp file
tf.write(dump)
# Close(don't delete) the file
tf.close()

# Add the temp filename to the array here(so it's not in the
# json output file), re-sort and jsonify to send to the ui
tags['temp_filename'] = tf_name
sorted_tags = sorted(tags.iteritems(), key=operator.itemgetter(1), reverse=True)
dump = json.dumps(sorted_tags, indent=4)

# Return the json to the ui
# print dump
print '{0}({1})'.format(callback, dump)


