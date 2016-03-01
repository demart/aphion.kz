// Custom sorting plugin
(function($) {
	$.fn.sorted = function(options) {

		var sortElements = $(this).children(),
			filteredElements = [];

		sortElements.each(function(i){
			var value = $(this).data('tags').toLowerCase(),
				arr = $.trim(value).split(',');

			if($.trim(options.dataValue.toLowerCase()) === 'all') {
				filteredElements.push(this);
			}else {
				for(var i = 0, c = arr.length; i < c; i++) {
					if($.trim(arr[i]) === $.trim(options.dataValue.toLowerCase())) {
						filteredElements.push(this);
					};
				};				
			}

		});

		return $(filteredElements);
	};
})(jQuery);