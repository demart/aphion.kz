(function($){

	$.fn.animateImage = function(options, positionArray) {
		options = $.extend($.fn.animateImage.defaults, options); 

		return this.each(function(){
			for(var key in options) {
				var elementCollection = $(this).find(options[key]);

				if($.trim(key) === 'image') {
					//run animate image function
					elementCollection.each(function(){
						var obj = { 
							"left" : $(this).data('position-l'),
							"top" : $(this).data('position-t'),
							"right" : $(this).data('position-r')
						};

						if($(this).hasClass('cloud')) {
							// animate.cloudMove($(this), obj);
						}else {
							animate.cactusGrownUp($(this), obj);						
						}
					})
				}else if($.trim(key) == 'layout'){

					elementCollection.each(function(i){
						animate.sunFade($(this), true)
					})
				}else {
					elementCollection.each(function(i){
						animate.sunFade($(this))
					})
				}
			};
		})
	};

	$.fn.animateImage.defaults = {
		'image' : '.image',
		'layout' : '.layout'
	};

})(jQuery);

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
};


var animate = {

	cloudMove : function (element, obj) {

		var self = this,
			sks = document.body.clientWidth,
			sks1 = sks - element.width() + 100,
			maxRandom,
			k = getRandomArbitrary(2.5, 5);

		left = (typeof obj.left == "undefined") ? true : false;

		maxRandom = (left) ? {"right" : getRandomArbitrary(0, obj.right)} : {"left" : getRandomArbitrary(0, obj.left)};

		element.css(maxRandom).fadeIn(400, function(){

			$(this).animate({left: '+='+sks1}, sks1*1000*k/80 , "linear", function(){
				$(this).css('left' , - element.width());
				self.cloudMove($(this), obj);
			})
		});
	},
	sunFade : function (element, more) {

		var self = this,
			opacity = (more) ? getRandomArbitrary(0.88, 1) : getRandomArbitrary(0, 0.25);

		element.animate({'opacity' : opacity}, 1000, 'linear', function(){

			self.sunFade($(this), more);

		})
	},
	cactusGrownUp : function(element, obj) {

		if(element.hasClass('cactus')) {

			element.animate(obj, 2000, "easeOutBounce", function(){
				$(this).click(function() {
					var t = obj.top;

					$(this).animate({"top" : t + (t*50/100)}, 200, 'easeOutBounce').animate({"top" : t}, 200, 'easeOutBounce');
				})
			}).show();

		}else {

			element.css(obj).animate({'opacity': '1'}, 2500, "linear").show();

		}
		
	}
};

$(document).ready(function(){

	$('#animateGames').animateImage({
		'image' : '.b-game-animate_image__type',
		'layout' : '.b-game-animate_image__layout',
		'mask' : '.b-game-animate_image__mask'
	});
})