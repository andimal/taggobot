$.post('get_tags.py', { username: 'andimal', limit: 3 }, function(data) {
	data = $.parseJSON(data);
	$(data).each(function() {
		$('.tags .output code table').append('<tr><td>' +
			this[0] + '</td><td class="count">' +
			this[1] + '</td></tr>');
	});
});	