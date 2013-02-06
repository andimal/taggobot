$('.heading-shadow').css({
	'left'		: 3,
	'top'		: $('h1').offset().top + 3,
	'display'	: 'block'
});

var drag_x = 0,
	is_first_click = true;

$('.scissors').mousedown(function () {
	if (is_first_click) {
		$('.tear-off').addClass('show-cut');
		setTimeout(function () {
			$('.tear-off').removeClass('show-cut');
			is_first_click = false;
		}, 200);
	}
});

$( '.scissors').draggable({
	axis: 'x',
	containment: 'window',
	start: function () {
		$(this).find('img').addClass('cutting');
	},
	stop: function () {
		$(this).find('img').removeClass('cutting');
		if ($('.cut').width() > $('.output').width() / 2) {
			var left_to = parseInt($('.cut').css('max-width'), 10);
			$(this).animate({
				left: $('.output').offset().left + $('.output').width() + 40
			}, 1000, function() {
				$(this).fadeOut();
			});

			$('.cut').animate({
				width: left_to
			}, 800, function() {
				window.open('tmp/' + temp_file);
				$('pre a').attr('href', 'tmp/' + temp_file);
				$('pre a').fadeIn();
			});
		};
	},
	drag: function (event, ui) {
		var left = $('.output').offset().left - 30;
		$('.cut').css('max-width', $('.output').width() + 1);
		if( ui.offset.left > left && ui.offset.left > drag_x ) {
			$('.cut').width(ui.offset.left - left);
			drag_x = ui.offset.left;
		}
	}
});

var username,
	limit,
	temp_file;

function reset () {
	$('table tr').each(function() {
		if(!$(this).hasClass('title') && !$(this).hasClass('sub')) {
			$(this).remove();
			$('.output-top').fadeOut(0);
		}
	});
	$('.scissors').removeAttr('style');
	$('.cut').removeAttr('style');
	drag_x = 0;
}

function post () {
	username = $('.username').val();
	limit = $('.limit').text();

	$.ajax({
		url: 'get_tags.py',
		type: 'POST',
		dataType: 'jsonp',
		data: { username: username, limit: limit },
		error: function () {
			$('.username').addClass('error');
	    },
		success: function(data) {
			if(!data) {
				$('.username').addClass('error');
			} else {
				$('.title td').text(username.toUpperCase() + '\'S TAGS W/ ' + limit + '+');

				reset();
				if (data.length) {
					$(data).each(function() {
						if(this[0] === 'temp_filename') {
							temp_file = this[1];
						} else {
							$('.tags .output code table').append('<tr><td>' +
								this[0] + '</td><td class="count">' +
								this[1] + '</td></tr>');
						}
					});
				} else {
					$('.tags .output code table').append('<tr><td class="no-tags">NO TAGS</td></tr>');
				}

				$('.tags').fadeIn('fast');
				$('.bot .arrow').fadeIn('fast');
				$('.bot').removeClass('bot-init');

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
					}, 1000, function() {
						$('.scissors img').addClass('cutting');
						setTimeout(function () {
							$('.scissors img').removeClass('cutting');
						}, 200);
					});
				});
			}

			$('.go').removeClass('disabled going');
			$('.go').text('Go!');
		}

	});
}

function set_limit (limit) {
	$( '.limit' ).text( limit );
}

$('.slider').slider({
	value	: 4,
	min		: 1,
	max		: 20,
	step	: 1,
	slide: function( event, ui ) {
		set_limit(ui.value);
	},
	start: function() {
		$('.limit').addClass('limit-active');
	},
	stop: function() {
		$('.limit').removeClass('limit-active');
	}
});

set_limit($( '.slider' ).slider( 'value' ));

$('.username').keyup(function() {
	if($(this).val() !== '') {
		$('.go').removeClass('disabled');
	} else {
		$('.go').addClass('disabled');
	}
});

$('.go').click(function() {
	event.preventDefault();
	if (!$(this).hasClass('disabled')) {
		$('.username').removeClass('error');
		$(this).addClass('disabled going');
		$(this).text('Going...');
		post();
	} else {
		$('.username').addClass('error');
	};
});