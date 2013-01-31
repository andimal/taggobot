var username;
function post () {
	username = $('.username').val();
	$.post('get_tags.py', { username: username, limit: 3 }, function(data) {
			$('.title td').text(username.toUpperCase() + '\'S TAGS W/ 3+');

			data = $.parseJSON(data);
			$(data).each(function() {
				$('.tags .output code table').append('<tr><td>' +
					this[0] + '</td><td class="count">' +
					this[1] + '</td></tr>');
			});

			var output_height = $('.output').height() + 20;
			$('.output').css('top', -1 * output_height);
			$('.output').css('margin-bottom', 20);
			$('.output').css('visibility', 'visible');

			$('html, body').animate({
				scrollTop: $('.outputter').offset().top - 40
			}, 'slow');

			$('.output-top').fadeIn();

			$('.right').animate({
				height: 10
			}, 'slow', function() {
				$('.output').animate({
					top: 0
				}, 1000);
			});
		}
	);
}

$('.go').click(function() {
	event.preventDefault();
	post();
});