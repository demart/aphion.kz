(function($) {
    var buttonType = 'button_quote';

    $.extContactForm = {
		ajaxPath: globalBasePath + 'form_contact_request',
		parentPopupClass: '.feedback-form',
		// popup init
		
        freeContact: function(){
		    var _self = this;

		    $.ajaxSetup({
				error: $.proxy(function(x, e, t) {
					    //console.log(x, e, t);

					    var errorVal = '';

					    if (x.status == 0) {
							errorVal = (globalLangVar == 'ru') ? "Р’С‹ РѕС„С„Р»Р°Р№РЅ!! РџРѕР¶Р°Р»СѓР№СЃС‚Р° РїСЂРѕРІРµСЂСЊС‚Рµ РІР°С€Рµ СЃРѕРµРґРёРЅРµРЅРёРµ СЃ СЃРµС‚СЊСЋ РёРЅС‚РµСЂРЅРµС‚..." : "You are offline! Please check your connection to the internet ...";
					    } else if (x.status == 404) {
							errorVal = (globalLangVar == 'ru') ? "Р—Р°РїСЂРѕС€РµРЅРЅС‹Р№ URL РЅРµ РЅР°Р№РґРµРЅ." : "The requested URL was not found.";
					    } else if (x.status == 500) {
							errorVal = (globalLangVar == 'ru') ? "Р’РЅСѓС‚СЂРµРЅРЅСЏСЏ РѕС€РёР±РєР° СЃРµСЂРІРµСЂР°." : "Internal Server Error";
					    } else if (e == 'parsererror') {
							errorVal = (globalLangVar == 'ru') ? "РћС€РёР±РєР° РїСЂРё РѕР±СЂР°Р±РѕС‚РєРµ JSON Р·Р°РїСЂРѕСЃР°." : "Error handling JSON request.";
					    } else if (e == 'timeout') {
							errorVal = (globalLangVar == 'ru') ? "РўР°Р№РјР°СѓС‚." : 'Timeout.';
					    } else {
							errorVal = (globalLangVar == 'ru') ? "РќРµРѕРїРѕР·РЅР°РЅРЅР°СЏ РѕС€РёР±РєР°. " + x.responseText : 'Unspecified error. ' + x.responseText;
					    }

					    $('<div class="tpl-error">' + errorVal + '</div>').insertAfter(_self.parentPopupClass + ' .btn_contact');
					}, this)
		    });
            
            $('.btn_contact').click(function(event) {
                event.stopPropagation();
                event.preventDefault();
                
                var parentPopup = $(this).parents('.feedback-form'),
                    inputItem = parentPopup.find('input, textarea'),
                    counterErrors = 0, 
                    emailError = 0, 
                    errorVal = _self.errorsObj.errorStandart,

                    userName = $('[name="name"]').val(),
                    email = $('[name="email"]').val(),
                    mess = $('[name="mess"]').val();
                
                $('.tpl-error').remove();
                
                inputItem.each(function() {
                    if ($(this).val() == '') {
                        $(this).addClass('g-borders-error');
                        counterErrors++;
                    } else {
                        $(this).removeClass('g-borders-error');
                    }
                    if ($(this).attr('name') == 'email' && !_self.isValidEmail($(this).val())) {

                        $(this).addClass('g-borders-error');
                        counterErrors++;
                        emailError = 1; 
                    }
                });
                
                if (counterErrors) {
                    if (emailError) {
                        errorVal = _self.errorsObj.errorStandart + '<br/>' + _self.errorsObj.errorMail;
                    }

                    $('<div class="tpl-error">'+ errorVal + '</div>').insertAfter(_self.parentPopupClass+ ' .btn_contact');
                } else {
                    var $jsData = {};
                    $jsData['name'] = userName;
                    $jsData['email'] = email;
					$jsData['ta'] = mess;
                    
                    var encoded = $.toJSON($jsData);
                    $('.tpl-error').remove();
                    $('<div class="tpl-error">' + ((buttonType == 'request-vacancies' ? 'РџРѕРґРѕР¶РґРёС‚Рµ...' : (globalLangVar == 'ru') ? 'РџРѕРґРѕР¶РґРёС‚Рµ...' : 'Wait...')) + '</div>')
						.insertAfter(_self.parentPopupClass+ ' .btn_contact');
                    
                    $.post(globalBasePath + "form_contact_request",
                            'jsonData=' + encoded,
                            $.proxy(function(result) {
                                var errors = false;
                                if (result.errors_count > 0) {
                                    errors = true;
                                    var id, message;
                                    var errorVal = '';

                                    for (id in result.errors) {
                                        errorVal = result.errors[id] + '<br />' + errorVal;
                                    }

                                    $('.tpl-error').html(errorVal);
                                } else if (!result.result) {
                                    errors = true;
                                }

                                if (errors) {
                                    //
                                } else {
                                    
                                    $('.tpl-error').remove();
                                    
                                    popupAlert = {
                                        'title': 'Р’Р°С€Рµ РїРёСЃСЊРјРѕ СѓСЃРїРµС€РЅРѕ РґРѕСЃС‚Р°РІР»РµРЅРѕ!<br />РњС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ Р’Р°РјРё РІ С‚РµС‡РµРЅРёРµ 24 С‡Р°СЃРѕРІ.',
                                        'contacts': 'Р•СЃС‚СЊ СЃСЂРѕС‡РЅС‹Рµ РІРѕРїСЂРѕСЃС‹? РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РїРѕР·РІРѕРЅРёС‚Рµ РјРЅРµ<br />РїРѕ С‚РµР».: +375 (33) 556-54-57;<br />Skype: cs.iryna.parkhomenko',
                                        'image': 'themes/cactussoft/img/contact/av2/Iryna-Parkhomenko.png',
                                        'name': 'РСЂРёРЅР° РџР°СЂС…РѕРјРµРЅРєРѕ',
                                        'info': 'HR РґРёСЂРµРєС‚РѕСЂ'
                                    };

                                    $('.b-popup__message .b-popup_title').html(popupAlert.title);
                                    $('.b-popup__message .b-popup_contacts').html(popupAlert.contacts);
                                    $('.b-popup__message .b-popup_image').attr('src', popupAlert.image);
                                    $('.b-popup__message .b-popup_name').html(popupAlert.name);
                                    $('.b-popup__message .b-popup_info').html(popupAlert.info);	

                                    $.magnificPopup.open({
                                        showCloseBtn:true,
                                        items: {
                                            src: '.b-popup__message', 
                                            type: 'inline'
                                        }
                                    });
                                }
                            }, 
                        this));
                }
                
            });
            
		},
        
		isValidEmail: function isValidEmail(emailAddress) {
		    var pattern = new RegExp(
			    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		    return pattern.test(emailAddress);
		},

		// error obj
		errorsObj: {
		    errorStandart: (globalLangVar == 'ru') ? '* РџРѕР¶Р°Р»СѓР№СЃС‚Р°, Р·Р°РїРѕР»РЅРёС‚Рµ РѕС‚РјРµС‡РµРЅРЅС‹Рµ РїРѕР»СЏ' : '* Please fill in all marked fields',
		    errorMail: (globalLangVar == 'ru') ? '* РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РїСЂРѕРІРµСЂСЊС‚Рµ Р’Р°С€ e-mail Р°РґСЂРµСЃ' : '* Please check your E-mail address'
		},

		// path form detection
		pathForm: function(obj) {}
    };

})(jQuery);

jQuery(document).ready(function(){
	$.extContactForm.freeContact();
});