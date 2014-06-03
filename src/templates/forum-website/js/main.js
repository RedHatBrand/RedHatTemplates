$(function () {
    $('.event .location').lettering();

    $('.event .location span').each(function (_i, elem) {
    	console.log(elem);

    	var char = $(elem).text().toLowerCase();
    	$(this).addClass(char).addClass('ir');
    });
});
