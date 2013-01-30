function post () {
	$.post('get_tags.py', { username: 'andimal', limit: 3 }, function(data) {
			data = $.parseJSON(data);
			$(data).each(function() {
				$('.tags .output code table').append('<tr><td>' +
					this[0] + '</td><td class="count">' +
					this[1] + '</td></tr>');
			});

			var output_height = $('.output').height();
			$('.output').css('top', -1 * output_height);
			$('.output').css('margin-bottom', 0);
			$('.output').css('visibility', 'visible');

			$('.output-top').fadeIn();

			$('.right').animate({
				height: 10
			}, 'slow', function() {
				$('.output').animate({
					top: 0
				}, 'slow');
			});
		}
	);
}

$('.go').click(function() {
	post();
});