
// debulked onresize handler
function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,100)};return c};

var setToggles = function() {
	if (ww<768) {
		$('.toggle').each(function() {
			var el = $(this).data('toggle'),
				hidden = ($(this).data('hidden')=='1') ? true : false;
			if (hidden) $(el).toggle(200);
		});
	}
};


$(function() {
	
	var formlink_parameters = '?sc_cid='+$.cookie('rh_omni_tc')+'&offer_id=70160000000c0gjAAA';
	
	$('.event .location').lettering();

	$('.flexslider.sponsors').flexslider({
		animation		: 'slide',
		direction		: 'vertical',
		slideshowSpeed	: 4000,
		controlNav		: false,
		directionNav	: false
	});
	
	$('.flexslider').flexslider({
		animation		: 'slide',
		directionNav	: false
	});
	
	$('.nav.phone').change(function () {
		window.location.href = $(this).val();
	});
	
	$('.toggle').on('click',function(e) {
		e.preventDefault();
		var el = $(this).data('toggle');
		$(el).toggle(200);
	});
	
	$('.destinationboard a, .agenda a').on('click', function() {
		var el = $(this),
			linktype = (el.hasClass('event')) ? 'Destinationboard' : 'Agenda',
			location = el.data('location'),
			url = el.attr('href');
		el.attr('href',url+formlink_parameters);
		window.setTimeout(function(){ el.attr('href',url); }, 100);
		ga('send', 'event', 'external', linktype, location);
	});
	
	$('.scrollto').on('click', function(){
		var ele = $('#'+$(this).attr('name'));
		var margintop = 20;
		$('html,body').animate({scrollTop: (ele.offset().top-margintop)},'slow');	
	});
	
	


});





/*
$(window).load(function() {
	
	setToggles();
	
});
*/


/*
on_resize(function() {
	
	ww = $(window).width();
	setToggles();
	
});
*/
