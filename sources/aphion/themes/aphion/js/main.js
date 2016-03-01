/*if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	$mobileDevice = true;
}
else {
	$mobileDevice = false;
*/
var mainPage,
    stepsIndex = 0,
    stepsIndex1 = 0;

$(function() {
	mainPage = new MainPage();
	mainPage.init();

	// $("html").niceScroll({
	// 	scrollspeed: 60,
	// 		mousescrollstep: 40,
	// 		cursorwidth: 15,
	// 		cursorborder: 0,
	// 		cursorcolor: '#303030',
	// 		cursorborderradius: 6,
	// 		autohidemode: false,
	// 		horizrailenabled: false
	// });
});

function MainPage() {
	var $promoText = $('#promo-text'),
		$promoMockups = $('#promo-mockups');

	//initialising main page
	this.init = function() {
		this.animatePoromo();
		this.initSliderRecentWorks();
		this.initSliderClients();
		this.initSliderClientsResponses();
		this.mainPageAnimation();
		this.showingScheme();
		this.showingLines();
		this.showingClouds();

		// this.initParallax('.b-page_content__jumbotron', 1);
		// this.initParallax('.b-clients-responses', 1);
		// this.initParallax('.b-request-quote__main', 1);
		this.initParallax('.b-page_content.b-page_inner__arrows', 0.5);
		this.initParallax('.b-careers_manager_bkg', 0.5);
		this.initParallax('.condition_wrap', -0.5);
        this.initParallax('.b-request-quote__prototyping', 0.5);

	}

	//animating Clouds on game page
	this.showingClouds = function() {
		$(window).bind('load', function(){
		    $('.cloudz').each(function(){
		        var stepsList = $(this);
		        (function stepsCouds(lines) {
		        	if(lines == 0) {
		                lines = 0;
		            }
		            if(!lines) {
		                lines = -260;
		            }
		            if(lines == $(window).width()) {
		            	lines = -260;
		            }
		            stepsList.animate({'left': lines + 'px'}, 20);
		            lines++;
		            setTimeout(function () {
		            	stepsCouds(lines)
		            }, 20);
		        })(jQuery);
		    });
		});
	}

	//animating Lines on dedicated page
	this.showingLines = function() {

		function showAllLines() {
		    $(window).off('scroll.lines')
		}

		$(window).on('scroll.lines', function(){
		    $('#teamDevSteps').ready(function(){
		        var stepsList = $('#teamDevSteps'),
		        mainHeight = 0,
		        points = stepsList.children(),
		        index = points.length;
		        if( $('#teamDevSteps').offset()){
		            mainHeight = $('#teamDevSteps').offset().top - $(window).height() + stepsList.innerHeight();
		        }
		        if ($(document).scrollTop() > mainHeight) {
		            (function stepsLine(lines) {
		                if (lines == index) {
		                    showAllLines();
		                }
		                else {
		                    if (!lines) {
		                        lines = 0;
		                    }
		                    $(points[lines]).addClass('active');
		                    lines++;
		                    setTimeout(function () {
		                        stepsLine(lines)
		                    }, 1000);

		                }
		            })(jQuery);
		        }
		    });
		});
	}

	//animating Scheme on dedicated page
	this.showingScheme = function() {

		function showAllScheme() {
	    	$(window).off('scroll.scheme')
		}

		$(window).on('scroll.scheme', function(){
	    $('#teamScheme').ready(function(){
	        var stepsList = $('#teamScheme'),
	            points = stepsList.children(),
	            index = points.length,
	            mainHeight = 0;
	        if( $('#teamScheme').offset()){
	            mainHeight = $('#teamScheme').offset().top - $(window).height() + stepsList.innerHeight();
	        }
	        if ($(document).scrollTop() > mainHeight) {
	            (function stepsLine(lines) {
	                if (lines == index) {
	                    showAllScheme();
	                }
	                else {
	                    if (!lines) {
	                        lines = 0;
	                    }
	                    var placeL = $(points[lines]).data('point-l'),
	                        placeT = $(points[lines]).data('point-t');
	                    $(points[lines]).show().animate({'left': placeL + 'px', 'top': placeT + 'px', 'opacity': '1'}, 1000, function () {
	                        $(this).addClass('b-scheme_item__line');
	                        $(this).addClass('active');
	                    });
	                    lines++;
	                    setTimeout(function () {
	                        stepsLine(lines)
	                    }, 1000);
	                }
	            })(jQuery);
	        }
	    });

	});
	}


	//animating promo block on main page top
	this.animatePoromo = function() {
		var self = this;

		if ($promoText.length) {
			// starts animating only if promo mockups are visible (if screen width > 780)
			
			setTimeout(function() {
				var $promoTextElements = $promoText.children(),
					cnt1 = 0;

				var showPromoText = setInterval(function() {
					if (cnt1 < $promoTextElements.length) {
						$($promoTextElements[cnt1]).animate({
							opacity: 1,
							marginLeft: 0
						}, 600);
						cnt1++;
					} else {
						clearInterval(showPromoText);
					}
				}, 200);

				if ($promoMockups.is(':visible')) {
					var $promoMockupsElements = $promoMockups.children(),
						cnt2 = 0;

					var showPromoMockups = setInterval(function() {
						if (cnt2 < $promoMockupsElements.length) {
							$($promoMockupsElements[cnt2]).animate({
								opacity: 1,
								marginRight: parseInt($($promoMockupsElements[cnt2]).css('margin-right')) + 50
							}, 800);
							cnt2++;
						} else {
							clearInterval(showPromoMockups);
						}
					}, 600);
				} else {
					self.resetPromo();
				}
			}, 500);
			
		}
	}

	this.mainPageAnimation = function() {
		$('.b-infographic_icon__flip-wrap, .b-we-ensure .col, .b-skill-list_icon, .b-technology_decor, .b-infographic_item, .b-proj-count p, .b-skill-list_title, .b-information_icon, .section-descr, #contacts-page .offices .city-group, #contacts-page .team .people').on('inview', function() {
			$(this).addClass('inview');
		});
	}

	//reset promo block state to show all its elements
	this.resetPromo = function() {
		if($promoText.length) {	
			$promoText.css({
				opacity: 1,
				marginLeft: 0
			});
			$promoMockups.css({
				opacity: 1
				// backgroundPositionX: this.calculateMockupsPosition() - 50
			});
		}else {
			return false;
		}
	}

	//calculation mockups position on promo-block
	this.calculateMockupsPosition = function() {
		if($promoText.length) {
			return (parseInt($promoText.offset().left) + $promoText.outerWidth());
		}
	}

	//initializing slider plugin
	this.initSlider = function(selector, params) {
		var slider = $(selector);
		if (slider.length) {
			return $(selector).bxSlider(params);
		} else {
			return false;
		}
	}

	//initialising recent works slider
	this.initSliderRecentWorks = function() {
		var self = this,
			$slider = $('#recent-works-slider');

		var slider = this.initSlider('#recent-works-slider', {
			speed: 1000,
			pager: false,
			infiniteLoop: false,
			hideControlOnEnd: true,
			slideWidth: 800,
			nextSelector: '.b-recent-works .b-slider_ctrl__circle-next',
			prevSelector: '.b-recent-works .b-slider_ctrl__circle-prev',
			nextText: '',
			prevText: '',
			onSliderLoad: function(currentIndex) {
				// recentWorksTitle.animate({
				// 	top: $slider.find('li[data-index=' + currentIndex + '] h2').outerHeight()
				// }, 1000);
			},
			onSlideBefore: function($slideElement, oldIndex, newIndex) {
				$slider.find('li[data-index=' + oldIndex + ']').animate({
					opacity: 0
				}, 700);
				$slideElement.css({
					opacity: 0
				});
				setTimeout(function() {
					$slideElement.animate({
						opacity: 1
					}, 700);
				}, 300);

				// recentWorksTitle.animate({
				// 	top: $slider.find('li[data-index=' + newIndex + '] h2').outerHeight()
				// }, 1000);
			}
		});
	}

	//initializing slider with client's logos
	this.initSliderClients = function() {
		var slider = this.initSlider('#clients-slider', {
			minSlides: 2,
			maxSlides: 5,
			slideWidth: 200,
			slideMargin: 10,
			speed: 1000,
			pause: 1000,
			auto: true,
			controls: false,
			moveSlides: 1,
			pager: false
		});
	}

	//initializing clients responses slider
	this.initSliderClientsResponses = function() {
		var self = this,
			$sliderClientsResponses = $('#responses-slider');

		var slider = this.initSlider('#responses-slider', {
			speed: 1000,
			slideWidth: 750,
			pager: false,
			infiniteLoop: false,
			hideControlOnEnd: true,
			nextSelector: '.b-clients-responses .b-slider_ctrl__simple-next',
			prevSelector: '.b-clients-responses .b-slider_ctrl__simple-prev',
			nextText: '',
			prevText: '',
			onSliderLoad: function() {
				$('.b-slider_item.b-slider_item__client').each(function() {
					var $currentSlide = $(this);
					$currentSlide.css({
						marginTop: ($sliderClientsResponses.closest('.bx-viewport').outerHeight() - $currentSlide.outerHeight()) / 2
					});
				});
			}
		});
	}

	//toggle dropdown menu if footer
	this.footerDropdownToggle = function(e) {
		var dropdownLink = $(e.currentTarget);
		
		dropdownLink.next('.dropdown-block').slideToggle();
		dropdownLink.toggleClass('opened');
	}
	//initializing scheme animation


	this.initShowPortfolio = function(popupId, block, currentElement) {
		var popup = $(popupId),
			popupImage = popup.find('.b-'+block+'_popup-image img'),
			popupTitle = popup.find('.b-'+block+'_popup-disription .b-page_title'),
			popupText =  popup.find('.b-'+block+'_popup-disription .b-page_text'),
			popupStore = popup.find('.b-'+block+'_popup-ctrl__store'),
			showImage = currentElement.find('.b-'+block+'_image img'),
			showTitle = currentElement.find('.b-'+block+'_title').text(),
			showStore = currentElement.find('.b-'+block+'-ctrl__store').html(),
			showText = currentElement.find('.b-'+block+'_text').html(),
            showID = currentElement.find('.b-'+block+'_id').html(),
            lang = currentElement.data('lang');

		popupImage.attr('src', showImage.attr('src_big'));
		popupTitle.text(showTitle);
		popupText.html(showText);
		popupStore.html(showStore)

        $.magnificPopup.open({
            showCloseBtn:true,
            items: {
            	src: popupId,
                type: 'inline'
            },
            callbacks : {
                afterClose: function() {
                    history.pushState(null, null, '/' + block);
                }
            }
        });
        lang = typeof(lang)=="undefined" ? "ru" : lang;
        history.pushState(null, null, "/" + block + '_info/'+ showID + '?language='+lang);
	};

	this.initFilterPortfolio = function(filter, filterElement) {
		var $data = filterElement.clone(),
			self = this;

		filter.on('click', 'a', function(e) {
			var filterBy = $(this).data('type'),
				filterBy = $.trim(filterBy.toLowerCase());

			$(this).parent().children().removeClass('active');
			$(this).addClass('active');

			$filteredData = $data.sorted({"dataValue" : filterBy});

			filterElement.quicksand($filteredData, {
				duratioon: 800,
				useScaling : true
			});

			filterElement.children().click(function(e){
				e.preventDefault();
				var popupId = '#portfolioPopup',
					currentElement = $(this);

				self.initShowPortfolio(popupId, 'portfolio', currentElement)
			});

			e.preventDefault();
		});

        var pathName = location.pathname,
            strUrl = '/portfolio_info';
        if (pathName.indexOf(strUrl) != '-1' && id != '') {
            var id = pathName.substr(pathName.indexOf(strUrl) + strUrl.length + 1),
                popupId = '#portfolioPopup',
                currentElement = filterElement.children('li[data-url='+id+']');//console.log(id);
            self.initShowPortfolio(popupId, 'portfolio', currentElement)
        }

	};

	this.initGoPageTop = function(element) {

		$(window).scroll(function(){
			if ($(this).scrollTop() > 50) {
				element.fadeIn();
			} else {
				element.fadeOut();
			};
		});

		element.click(function(event){
			event.preventDefault();       
			$('body,html').animate({scrollTop: 0}, 400); return false;
		})
	};

	this.initTabsControl = function (button, tabs, callback) {
		var tab = tabs.children(),
			index = button.index();

		tab.hide();
		
		$(tab[index]).show();

		if(typeof callback == 'function' && typeof callback !== 'undefined') {
			callback.call();
		}
	};

	this.showHrBlock = function(index) {

		var hrBlock = $('.b-tabs_tab');
        var hrs = $('.b-careers_hr-list_item');

        hrs.removeClass('active').eq(index).addClass('active');
        hrBlock.hide().eq(index).show();

        //var hrBlock = $('.b-careers_hr-list .b-careers_hr');
		//hrBlock.hide();
        //
		//if(index !== 1) {
		//	$(hrBlock[0]).show();
		//}else {
		//	$(hrBlock[1]).show();
		//}
	};

	this.initParallax = function(selector, speed) {
		var $el = $(selector);

		if ($el.length) {
			$el.parallax({
				speed: speed
			});
		}
	}

	this.showDropdownMenu = function(e) {
		if (!$('.navbar-toggle').is(':visible')) {
			var $dropdown = $(e.currentTarget).closest('.dropdown'),
				$dropdownMenu = $dropdown.find('.dropdown-menu');

			$dropdownMenu.fadeIn(200);
		}
	}


	this.hideDropdownMenu = function(e) {
		setTimeout(function() {
			var $dropdown = $(e.currentTarget).closest('.dropdown'),
			$dropdownMenu = $dropdown.find('.dropdown-menu');

			$dropdownMenu.fadeOut(200);
		}, 200);

	}

	$('footer .dropdown-link').click($.proxy(this.footerDropdownToggle, this));
	$('#mainMenu .dropdown').on('mouseenter', $.proxy(this.showDropdownMenu, this));
	$('#mainMenu .dropdown').on('mouseleave', $.proxy(this.hideDropdownMenu, this));
}

var fadeStart=20 // 100px scroll or less will equiv to 1 opacity
    ,fadeUntil=400; // 200px scroll or more will equiv to 0 opacity


$(window).bind('scroll', function(){
    var offset = $(document).scrollTop()
        ,opacity=0
    ;
    if( offset<=fadeStart ){
        opacity=1;
    }else if( offset<=fadeUntil ){
        opacity=1-offset/fadeUntil;
    }
    $('#promo-text, #promo-mockups').css('opacity',opacity);

});

$(window).resize(function() {
	mainPage.resetPromo();


});

$(document).ready(function(){


    //$('.b-careers_manager_bkg').each(function(){
    //    var offset_top = $(this).offset().top/* - $(this).outerHeight(true)*/;
    //    $(this).attr('data-start', offset_top);
    //});



    $('#portfolio .b-portfolio_item .b-portfolio_image, #portfolio .b-portfolio_item .b-portfolio_title').click(function(e){
		e.preventDefault();
		var popupId = '#portfolioPopup',
			currentElement = $(this).closest('.b-portfolio_item');
		mainPage.initShowPortfolio(popupId, 'portfolio', currentElement)
	});

    $b_tabs_ctrl_link = $('.b-tabs_ctrl .b-tabs_ctrl-link');
    $b_tabs_ctrl_link.click(function(){
		var parents = $(this).parents('.b-tabs'),
			index = $(this).parent().index(),
			button = $(this).parent();

		parents.find('.active').removeClass('active');
		button.addClass('active');

		mainPage.initTabsControl(button, parents.find('.b-tabs_item'), function(){
			mainPage.showHrBlock(index);
		});

        //add by alex
        if(index == 2){
            $triple_gall.multiSlideGall({});
        }


        //$('.b-careers_manager_bkg, .condition_wrap').offsetForBkg();

	});

    //$('[href="' + window.location.hash + '"]').trigger('click');




	// $('#mainMenu ul li:first-child').on('mouseenter', function(){
	// 	$(this).find('ul').stop().slideDown(100);
	// }).on('mouseleave', function(){
	// 	$(this).find('ul').stop().slideUp(100)

	// });
	
	
	$('.slide-data[data-id="'+$('.slide-menu.active').data('id')+'"]').slideDown(300);
	$('#contacts-page .offices .marker').click(function(){
		var $currentMarker = $(this);

		var id = $currentMarker.data('id');

		$('#contacts-page .offices .marker').removeClass('active');
		$currentMarker.addClass('active');

		$('#map-big').attr('src', '/themes/cactussoft/maps/map-'+id+'.php');
	});

	if($(".b-page_content__top").is(':visible')) {
		$('.b-page_content__top').parents('.b-page_content').removeClass('b-page_content__red-line').addClass('b-page_presents');
	}

	$('.js-scrollToSlider').off('click').on('click', function(event){
		event.preventDefault();
		offset = ($('#recent-works-slider').is(':visible')) ? $('#recent-works-slider').offset().top - 125 : $('.b-team-dev').offset().top - 80;


		$('body,html').animate({scrollTop: offset}, 400); return false;
	});

	mainPage.initGoPageTop($('#goToTop'));
	mainPage.initFilterPortfolio($('#filter'), $('#filterElement'));

    //news
    $(".b-news_image-item > img").click(function(){
        $(".b-news_image__main").attr("src",$(this).attr("src"));
        $(".b-news_image__main").attr("alt",$(this).attr("alt"));
        $(".b-news_image__main").attr("title",$(this).attr("title"));
    });

});
// }
// console.log($mobileDevice);


//MAIN ALEX
jQuery(function($){

    //С…РѕРІРµСЂ РЅР° РєРЅРѕРїРєСѓ attach
    $button_attach = $('.button__attach');
    $qq_upload_button = $('.qq-upload-button');

    $qq_upload_button
        .on('mouseenter', function(){
            $(this)
                .closest('.b-feedback_item')
                .find('.button__attach')
                .addClass('button__attach_hover');
        })
        .on('mouseleave', function(){
            $(this)
                .closest('.b-feedback_item')
                .find('.button__attach')
                .removeClass('button__attach_hover');
        });



    //Р»СѓРїР°
    $develop_x_ray = $('.ready-develop_x-ray');
    $circle_wrap = $('.ready-develop_x-ray_circle_wrap', $develop_x_ray);
    $x_ray_blocks = $('.ready-develop_x-ray_circle_wrap_in_blocks', $develop_x_ray);

    $develop_x_ray.on('mousemove', function(e){

        var parentOffset = $(this).parent().offset();
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;

        var magn_half_w = $circle_wrap.outerWidth(true) / 2;
        var magn_half_h = $circle_wrap.outerHeight(true) / 2;

        //var x_ray_wrap_w = $develop_x_ray.outerWidth(true);
        //var x_ray_wrap_h = $develop_x_ray.outerHeight(true);
        var x_ray_wrap_w = 480;
        var x_ray_wrap_h = 300;

        //console.log('relY: ' + relY + ' x_ray_wrap_h: ' + x_ray_wrap_h);

        if(relX > 0 && relX < x_ray_wrap_w && relY > 50 && relY < x_ray_wrap_h){

            $circle_wrap.moveXray({
                top: (relY-magn_half_h),
                left: (relX-magn_half_w)
            }).addClass('move');

        }
        else{
            $circle_wrap.moveXray().removeClass('move');
        }



    });

    //$develop_x_ray.on('mouseleave', function(e){
    //
    //    $circle_wrap.moveXray({
    //
    //    }).removeClass('move');
    //
    //});


    //inview
    $('.b-recent-works__prototyping').on('inview', function(){

        $circle_wrap.moveXray({
            'top'   :54,
            'left'  :180,
            'speed' :1000
        });

        $(this).off('inview');
    });


    //houses

    $city = $('#city');
    var speedX = 2000;
    var layers_left = 0;
    var distX = 5;

    var range = 1/16;
    var lastX = 0, nowX = 0, deltaX = 0;

    $city_layers = $('.layers_wrap', $city).children();

    $('.layers_wrap', $city).fullWidthToLeft().on('mousemove', function(e){
        var parentOffset = $(this).parent().offset();
        var relX = e.pageX;



        //var ratio = 1;
        if(relX < $(window).width()*range){

            layers_left = 0;

            //$city_layers.stop(true, false).animate({left: layers_left}, speedX, function(){
            //
            //});

            $(this).removeClass('right').addClass('left');

            //ratio = relX/($(window).width()-($(window).width()/2));
        }
        else if(relX > $(window).width() - $(window).width()*range){

            layers_left = -1*($($city_layers).width()-$(window).width());

            //$city_layers.stop(true, false).animate({left: layers_left}, speedX, function(){
            //
            //});

            $(this).removeClass('left').addClass('right');

            //ratio = $(window).width()/relX-1;
        }
        else{
            //if(!$city_layers.is(":animated")){
            //
            //    console.log('stop');
            //
            //
            //    nowX = relX;
            //    if(lastX > nowX){
            //        deltaX = -1;
            //        lastX = nowX;
            //
            //        layers_left +=distX;
            //
            //        //if(layers_left){
            //        //
            //        //}
            //
            //        $city_layers.css({
            //            left: layers_left
            //        })
            //    }
            //    else{
            //        deltaX = 1;
            //        lastX = nowX;
            //        layers_left -=distX;
            //
            //        $city_layers.css({
            //            left: layers_left
            //        })
            //    }
            //
            //}
        }

        //console.log(layers_left);

        //console.log('lastX:' + lastX + ' nowX:' + nowX + ' deltaX:' + deltaX);


        //$(this).children().css({
        //    'transition-duration': speedMin*ratio + 's'
        //});

        //console.log(ratio);

    });

    $b_careers_manager_bkg = $('.b-careers_manager_bkg');
    $b_careers_manager_bkg.fullWidthToLeft();

    $condition_wrap= $('.condition_wrap');
    $condition_wrap.fullWidthToLeft();

    $triple_gall = $('.triple_gall');
    //$triple_gall.multiSlideGall({});



    $(window).on('resize', function(e){
        $('.layers_wrap', $city).fullWidthToLeft();
        $b_careers_manager.fullWidthToLeft();
    });



    //click to tab on page load
    $('.b-tabs_ctrl-tab a[href="' + window.location.hash + '"]').trigger('click') ;

    /*$('.condition_list').one('inview', function(){
        $('.condition_list_item', this).each(function(i){
            var $this = $(this);
            setTimeout(function(){
                $this.addClass('inview');
            }, 150*i);
        });
    });*/

});


$.fn.fullWidthToLeft = function(){
    var $this = $(this);
    $this.css({
        position: 'absolute',
        left: '50%',
        width: $(window).width() + 'px',
        'margin-left': (-1 * $(window).width() / 2) + 'px'
    });
    return $this;
}

$.fn.multiSlideGall = function(options){
    var settings = $.extend( {
        'lines'   : 3,
        'items_in_line'  : 3,
        'links' : true,
        'delay' : 400,
        'speed' : 100
    }, options);

    var $this = $(this);
    var items = (settings.links) ? $('a', $this) : $('img', $this);
    var layer_cntr = settings.lines*settings.items_in_line;

    var multi_layer_wrap = $('<div class="multi_layer_wrap"></div>');
    var items_layer = $('<div class="items_layer"></div>');

    var gall = 0;
    items.each(function(i){

        if( i % layer_cntr == (layer_cntr-1) || i == (items.length-1)){
            $(this).clone().attr('rel', 'gall_'+gall).appendTo(items_layer).wrap('<span />');
            items_layer.appendTo(multi_layer_wrap);
            items_layer = $('<div class="items_layer"></div>');
            gall++;
        }
        else{
            $(this).clone().attr('rel', 'gall_'+gall).appendTo(items_layer).wrap('<span />');
        }

    });


    $this.empty().append(multi_layer_wrap).append($('<a class="arr_prev" href="#"></a><a class="arr_next" href="#"></a>'));

    $('.multi_layer_wrap img', $this).on('load', function(){
        $('.multi_layer_wrap', $this).carouFredSel({
    //            circular: false,
    //            infinite: false,
            responsive:true,
            auto: false,
                //width: 1024,
                //height: 700,
            scroll: {
    //                fx: 'crossfade' /* 'directscroll'*/,
                items: 1
            },
            items: {
                visible: 1
            },
            prev    : {
                button  : $('.arr_prev', $this)
            },
            next    : {
                button  : $('.arr_next', $this)
            }
        })

        .find('a')
        .fancybox({
            padding: [5,5,5,5]
        });
    });


    return $this;
};

$.fn.moveXray = function(options){
    var settings = $.extend( {
        'top'   : 56,
        'left'  : 182,
        'speed' : 400
    }, options);
    var $this = $(this);
    $this.stop(true,false).animate({top: settings.top, left:settings.left}, settings.speed);
    $('[class*="_blocks"]', $this).stop(true,false).animate({top: -1 * settings.top, left: -1 * settings.left}, settings.speed);
    return $this;
};

//$.fn.offsetForBkg = function(){
//    $this = $(this);
//    var scrollTop = $(window).scrollTop();
//    var offset = $this.offset().top;
//    var yBgPosition = Math.round(offset - scrollTop);
//    $this.css('background-position', 'center ' + yBgPosition + 'px');
//}