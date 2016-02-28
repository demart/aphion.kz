

(function($) {
    var buttonType = 'button_quote';

    $.extJQForm = {
		ajaxPath: globalBasePath + 'form_quote_request',
		parentPopupClass: '.b-popup__request',
		// popup init
		popupInit: function() {
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

					    $('<div class="tpl-error">' + errorVal + '</div>').insertAfter(_self.parentPopupClass + ' .buttons.button-submit');
					}, this)
		    });

		    if ($('.b-popup').length > 0) {

				$('.button_quote, .b-careers-vacancy_button').click(function(event) {
					event.preventDefault();

					var buttonQuote = ($(this).hasClass('button_quote')) ? true : false;

					if (!buttonQuote) {
						_self.errorsObj.errorStandart = '* РџРѕР¶Р°Р»СѓР№СЃС‚Р°, Р·Р°РїРѕР»РЅРёС‚Рµ РѕС‚РјРµС‡РµРЅРЅС‹Рµ РїРѕР»СЏ';
						_self.errorsObj.errorMail = '* РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РїСЂРѕРІРµСЂСЊС‚Рµ Р’Р°С€ e-mail Р°РґСЂРµСЃ';
					}

					$('.qq-upload-list').html('');
					$('.tpl-error').remove();
					$('#name').val('');
					$('#email').val('');
					$('#phone').val('');
					$('#ta').val('');

					event.stopPropagation();

					if (_self.uploader != undefined) {
						_self.uploader._handler.cancelAll();
						delete _self.uploader;
					};

					var element = (buttonQuote) ? $('.b-popup__request .upload').get(0) : $('.b-popup__career .upload').get(0),
						action = globalBasePath + ((buttonQuote) ? 'form_quote_request' : 'form_vacancy_request');

					_self.uploadFile(element, action);

					var popupId = (buttonQuote) ? "#requestPopup" : "#vacancyPopup";

					if (!buttonQuote)  {
						var vacancy = $(this).parent("div").children("h2").text(),
							city = $('li.tab-active a.button em').text(),
							vacancy_title = city + " : " + vacancy;

						$('#area').val(vacancy_title);
					}

					$.magnificPopup.open({
						showCloseBtn:true,
						items: {
							src: popupId, 
							type: 'inline'
						}
					});
				});

				$('.b-popup .b-popup_form .b-popup_button').click(function(event) {
					event.stopPropagation();
					event.preventDefault();

					var parentPopup = $(this).parents('.b-popup'), 
						inputItem = parentPopup.find('.b-popup_item .b-popup_lable span').parent().next().find('.b-popup_input, .b-popup_textarea'), 
					    counterErrors = 0, 
					    emailError = 0, 
					    errorVal = _self.errorsObj.errorStandart,

						userName = $('#name').val(),
						email = $('#email').val(),
						phone = $('#phone').val(),
						company = $('#company').val(),
						ta = $('#ta').val(),
						area = $('#area').val();

                    if (parentPopup.hasClass('b-popup__career')) {
                        var f_name = $('#vacancyPopup .qq-upload-file input').val();
                    }else if(parentPopup.hasClass('b-popup__request')){
                        var f_name = $('#quote .qq-upload-file input').val();
                    }
                    
					// check current class popup
					if (parentPopup.hasClass('b-popup__career')) {
						_self.parentPopupClass = '.b-popup__career';
					} else {
						_self.parentPopupClass = '.b-popup__request';
					}

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

						$('<div class="tpl-error">'+ errorVal + '</div>').insertAfter(_self.parentPopupClass+ ' .b-popup_button');
					} else {
						var inputform = parentPopup.find('.b-popup-form').find('input, textarea'),
							$jsData = {};
                        
						inputform.each(function() {
                            if ($(this).val()) {
								if ($(this).attr('type') == 'checkbox' && !$(this).is(':checked')) {

								} else {
								    $jsData[$(this).attr('name')] = $(this).val();
								}

						    }
						});
						$jsData['name'] = userName;

						if (parentPopup.hasClass('b-popup__career')) {
						    $jsData['vacancy'] = area;
						    $jsData['email'] = email;
						    $jsData['city'] = $('li.b-tabs_ctrl-tab a.b-tabs_ctrl-link').attr('href');
                            $jsData['phone'] = phone;
                            $jsData['ta'] = ta;
                            $jsData['files'] = [];
                            if (f_name) {
                                $('#vacancyPopup .qq-upload-file input').each(function(i) {
                                    $jsData['files'][i] = $(this).val();
                                });
                            }
						}else if(parentPopup.hasClass('b-popup__request')){
						    $jsData['email'] = email;
						    $jsData['phone'] = phone;
						    $jsData['company'] = company;
						    $jsData['ta'] = ta;
                            $jsData['files'] = [];
                            if (f_name) {
                                $('#quote .qq-upload-file input').each(function(i) {
                                    $jsData['files'][i] = $(this).val();
                                });
                            }
						}



						var encoded = $.toJSON($jsData);

						//console.log(_self.parentPopupClass);
						$('.tpl-error').remove();
						$('<div class="tpl-error">' + ((buttonType == 'request-vacancies' ? 'РџРѕРґРѕР¶РґРёС‚Рµ...' : (globalLangVar == 'ru') ? 'РџРѕРґРѕР¶РґРёС‚Рµ...' : 'Wait...')) + '</div>')
						.insertAfter(_self.parentPopupClass + ' .b-popup_button');
						if (parentPopup.hasClass('b-popup__career')) {
						    $.post(globalBasePath + "form_vacancy_request",
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
									    parentPopup.hide();

									    if ($jsData['city'].indexOf('grodno') >= 0) {

											popupAlert = {
											    'title': 'Р’Р°С€Рµ РїРёСЃСЊРјРѕ СѓСЃРїРµС€РЅРѕ РґРѕСЃС‚Р°РІР»РµРЅРѕ!<br />РњС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ Р’Р°РјРё РІ С‚РµС‡РµРЅРёРµ 24 С‡Р°СЃРѕРІ.',
											    'contacts': 'Р•СЃС‚СЊ СЃСЂРѕС‡РЅС‹Рµ РІРѕРїСЂРѕСЃС‹? РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РїРѕР·РІРѕРЅРёС‚Рµ РјРЅРµ<br />РїРѕ С‚РµР».: +375 (33) 312-69-04;<br />Skype: cs.oksana.trusilo',
											    'image': 'themes/cactussoft/img/contact/av2/Oksana-Trusilo.png',
											    'name': 'РћРєСЃР°РЅР° РўСЂСѓСЃРёР»Рѕ',
											    'info': 'HR РјРµРЅРµРґР¶РµСЂ'
											};
									    } else {

											popupAlert = {
											    'title': 'Р’Р°С€Рµ РїРёСЃСЊРјРѕ СѓСЃРїРµС€РЅРѕ РґРѕСЃС‚Р°РІР»РµРЅРѕ!<br />РњС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ Р’Р°РјРё РІ С‚РµС‡РµРЅРёРµ 24 С‡Р°СЃРѕРІ.',
											    'contacts': 'Р•СЃС‚СЊ СЃСЂРѕС‡РЅС‹Рµ РІРѕРїСЂРѕСЃС‹? РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РїРѕР·РІРѕРЅРёС‚Рµ РјРЅРµ<br />РїРѕ С‚РµР».: +375 (33) 556-54-57;<br />Skype: cs.iryna.parkhomenko',
											    'image': 'themes/cactussoft/img/contact/av2/Iryna-Parkhomenko.png',
											    'name': 'РСЂРёРЅР° РџР°СЂС…РѕРјРµРЅРєРѕ',
											    'info': 'HR РґРёСЂРµРєС‚РѕСЂ'
											};
									    }

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
						} else {
						    _gaq.push(['_trackEvent', 'zapolnenie_formi', 'otpravka']);
                            //submit from main page
						    $.post(globalBasePath + "form_quote_request",
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
									    ga('send', 'event', 'zapolnenie_formi', 'otpravka');
									    $('.tpl-error').remove();

									    parentPopup.hide();

									    $('.b-popup__message .b-popup_title').html((globalLangVar == 'ru') ? 'РЎРїР°СЃРёР±Рѕ, С‡С‚Рѕ РѕР±СЂР°С‚РёР»РёСЃСЊ Рє РЅР°Рј!<br />РњС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ РІР°РјРё РІ С‚РµС‡РµРЅРёРµ 24 С‡Р°СЃРѕРІ.' : 'Thank you for reaching out to us! <br />You will be contacted within 24 hours. ');
									    $('.b-popup__message .b-popup_contacts').html((globalLangVar == 'ru') ? 'Р’Р°С€ Р·Р°РїСЂРѕСЃ Р±СѓРґРµС‚ РЅР°РїСЂР°РІР»РµРЅ РЅР° СЂР°СЃСЃРјРѕС‚СЂРµРЅРёРµ Рє РЅР°С€РёРј С‚РµС…РЅРёС‡РµСЃРєРёРј СЃРїРµС†РёР°Р»РёСЃС‚Р°Рј.<br />РљСЂРѕРјРµ С‚РѕРіРѕ, РјС‹ Р±СѓРґРµРј СЂР°РґС‹, РµСЃР»Рё РІС‹ РїРѕР·РІРѕРЅРёС‚Рµ РёР»Рё РЅР°РїРёС€РµС‚Рµ РЅР°Рј:<br />+375 (17) 334 35 07<br />info@cactussoft.biz' : 'Your request will be forwarded to our technical team for detailed treatment.<br />In the meantime, feel free to give us a call or send an e-mail:<br />+375 (17) 334 35 07<br />info@cactussoft.biz');
									    $('.b-popup__message .b-popup_image').attr('src', 'themes/cactussoft/img/contact/av2/Yan-Oreschenkov.png');
									    $('.b-popup__message .b-popup_name').html((globalLangVar == 'ru') ? 'РЇРЅ РћСЂРµС‰РµРЅРєРѕРІ' : 'Yan Oreshchenkov');
									    $('.b-popup__message .b-popup_info').html((globalLangVar == 'ru') ? 'РўРµС…РЅРёС‡РµСЃРєРёР№ РґРёСЂРµРєС‚РѕСЂ' : 'Chief Technical Officer');	

										$.magnificPopup.open({
											showCloseBtn:true,
											items: {
												src: '.b-popup__message', 
												type: 'inline'
											}
										});
									}
						    }, this));
						}

					};
				});

				$(_self.parentPopupClass).find('.b-popup_form input').find('[disabled]').each(function() {
				    $(this).parent().addClass('disabled');
				});

				$(_self.parentPopupClass).find('input, .popup textarea').each(function() {

				    $(this).keyup(function() {
						if ($(this).val().length) {
						    $(this).parent().addClass('inputText');
						} else {
						    $(this).parent().removeClass('inputText');
						}
				    });
				});
		    }
		},

		uploadFile : function(element, action) {
			var _self = this;
            
			_self.uploader = new qq.FileUploader({
				element: element,
				action: action,
				params: {
					'action': 'upload'
				},
				sizeLimit: 0,
				minSizeLimit: 0,
				maxConnections: 1,
				allowedExtensions: ['jpg', 'jpeg', 'png', 'rar', 'zip', 'doc', 'pdf', 'xls', 'docx'],
				template:
					'<div class="qq-upload-drop-area">' +
					'   <span>Drop files here to upload</span>' +
					'</div>' +
					'<div class="qq-upload-button" style=" /*width: 335px;*/">' + (buttonType == 'b-careers-vacancy_button' ? 'РџСЂРёРєСЂРµРїРёС‚СЊ С„Р°Р№Р»' : (globalLangVar == 'ru' ? 'РџСЂРёРєСЂРµРїРёС‚СЊ С„Р°Р№Р»' : 'Attach')) + ' <span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> </div>' +
					'<ul class="qq-upload-list"></ul><div style="clear:both"></div>',
					fileTemplate: '<li>' +
					'<span class="qq-upload-file"></span>' +
					'<span class="qq-upload-spinner"></span>' +
					'<span class="qq-upload-size"></span>' +
					'<a class="qq-upload-cancel" href="#">Cancel</a>' +
					'<span class="qq-upload-failed-text" style="display:none;">Failed</span>' +
					'</li>',
				messages: {
					typeError: "{file} has invalid extension. Only {extensions} are allowed.",
					sizeError: "{file} is too large, maximum file size is {sizeLimit}.",
					minSizeError: "{file} is too small, minimum file size is {minSizeLimit}.",
					emptyError: "{file} is empty, please select files again without it.",
					onLeave: "The files are being uploaded, if you leave now the upload will be cancelled."
				},
				showMessage: function(message) {
					alert(message);
				},
				onSubmit: $.proxy(function(id, fileName) {
                    $('.qq-upload-button').addClass('onProgress');
                    $(document).on('click','.onProgress', function(e){
                        e.preventDefault();
                    });
                }, this),
				onComplete: $.proxy(function(id, fileName, result) {
                    $(document).off('click','.onProgress');
                    $('.qq-upload-button').removeClass('onProgress');
					var item = _self.uploader._getItemByFileId(id);
					var file = _self.uploader._find(item, 'file');
					if (result.success) {
						$(file).html('<input type="checkbox" name="' + result.filename + '" id="' + result.filename + '" value="' + result.id + '" checked="checked"><label for="' + result.filename + '">' + fileName + '</label>');
                    }
				}, this),
				onProgress: $.proxy(function(id, fileName, loaded, total) {
                    
					var item = _self.uploader._getItemByFileId(id);
					var size = _self.uploader._find(item, 'size');
					size.style.display = 'inline';

					var text;
					if (loaded != total) {
						text = Math.round(loaded / total * 100) + '% from ' + _self.uploader._formatSize(total);
					} else {
						text = _self.uploader._formatSize(total);
					}

					qq.setText(size, '(' + text + ')');
				}, this),
				onCancel: $.proxy(function(id, fileName) {
				}, this),
				debug: false
			});
		},
		isValidEmail: function isValidEmail(emailAddress) {
		    var pattern = new RegExp(
			    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		    return pattern.test(emailAddress);
		},

		freeQoute : function() {
			var _self = this;

			$('.b-feedback_form .b-feedback_button').click(function(event) {
				event.stopPropagation();
				event.preventDefault();

				var parentForm = $(this).parents('.b-feedback_form'), 
					inputItem = parentForm.find('.b-feedback_input, .b-feedback_teaxtarea'), 
				    counterErrors = 0, 
				    emailError = 0, 
				    f_name = $('.b-feedback_form .qq-upload-file input').val(),
				    $jsData = {},
				    errorVal = _self.errorsObj.errorStandart;

				$('.tpl-error').remove();

				inputItem.each(function() {

                     if ($(this).attr('name') == 'name' && $(this).val() == '' || $(this).attr('name') == 'ta' && $(this).val() == '' /*|| $(this).attr('name') == 'company' && $(this).val() == ''*/) {        
					    $(this).addClass('g-borders-error');
					    counterErrors++;
					} else {
					    $(this).removeClass('g-borders-error');

						$jsData[$(this).attr('name')] = $(this).val();
					}

					if ($(this).attr('name') == 'email' && !_self.isValidEmail($(this).val())) {

						$(this).addClass('g-borders-error');
						counterErrors++;
						emailError = 1; 
					}

					if (f_name) {
                        $jsData['files'] = [];
						$('.b-feedback_form .qq-upload-file input').each(function(i) {
							$jsData['files'][i] = $(this).val();
						});
					}

				});

				if (counterErrors) {

					if (emailError) {
					    errorVal = _self.errorsObj.errorStandart + '<br/>' + _self.errorsObj.errorMail;
					}

					$('<div class="tpl-error">'+ errorVal + '</div>').insertAfter('.b-feedback_form .b-popup_button');
				} else {
					var encoded = $.toJSON($jsData);

					$('.tpl-error').remove();
					$('<div class="tpl-error">' + ((buttonType == 'request-vacancies' ? 'РџРѕРґРѕР¶РґРёС‚Рµ...' : (globalLangVar == 'ru') ? 'РџРѕРґРѕР¶РґРёС‚Рµ...' : 'Wait...')) + '</div>')
					.insertAfter('.b-feedback_form .b-popup_button');

				    _gaq.push(['_trackEvent', 'zapolnenie_formi', 'otpravka']);
                    //submit from services page
				    $.post(globalBasePath + "form_quote_request",
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
							    ga('send', 'event', 'zapolnenie_formi', 'otpravka');
							    $('.tpl-error').remove();

							    $('.b-popup__message .b-popup_title').html((globalLangVar == 'ru') ? 'РЎРїР°СЃРёР±Рѕ, С‡С‚Рѕ РѕР±СЂР°С‚РёР»РёСЃСЊ Рє РЅР°Рј!<br />РњС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ РІР°РјРё РІ С‚РµС‡РµРЅРёРµ 24 С‡Р°СЃРѕРІ.' : 'Thank you for reaching out to us! <br />You will be contacted within 24 hours. ');
							    $('.b-popup__message .b-popup_contacts').html((globalLangVar == 'ru') ? 'Р’Р°С€ Р·Р°РїСЂРѕСЃ Р±СѓРґРµС‚ РЅР°РїСЂР°РІР»РµРЅ РЅР° СЂР°СЃСЃРјРѕС‚СЂРµРЅРёРµ Рє РЅР°С€РёРј С‚РµС…РЅРёС‡РµСЃРєРёРј СЃРїРµС†РёР°Р»РёСЃС‚Р°Рј.<br />РљСЂРѕРјРµ С‚РѕРіРѕ, РјС‹ Р±СѓРґРµРј СЂР°РґС‹, РµСЃР»Рё РІС‹ РїРѕР·РІРѕРЅРёС‚Рµ РёР»Рё РЅР°РїРёС€РµС‚Рµ РЅР°Рј:<br />+375 (17) 334 35 07<br />info@cactussoft.biz' : 'Your request will be forwarded to our technical team for detailed treatment.<br />In the meantime, feel free to give us a call or send an e-mail:<br />+375 (17) 334 35 07<br />info@cactussoft.biz');
							    $('.b-popup__message .b-popup_image').attr('src', 'themes/cactussoft/img/contact/av2/Yan-Oreschenkov.png');
							    $('.b-popup__message .b-popup_name').html((globalLangVar == 'ru') ? 'РЇРЅ РћСЂРµС‰РµРЅРєРѕРІ' : 'Yan Oreshchenkov');
							    $('.b-popup__message .b-popup_info').html((globalLangVar == 'ru') ? 'РўРµС…РЅРёС‡РµСЃРєРёР№ РґРёСЂРµРєС‚РѕСЂ' : 'Chief Technical Officer');	

								$.magnificPopup.open({
									showCloseBtn:true,
									items: {
										src: '.b-popup__message', 
										type: 'inline'
									}
								});

								parentForm.find('input:not([type="submit"]), textarea').each(function(){
									$(this).val('');
								});
								parentForm.find('.qq-upload-list').html(' ');
							}
				    }, this));


				};
			});
		},

		// error obj
		errorsObj: {
		    errorStandart: (globalLangVar == 'ru') ? '* РџРѕР¶Р°Р»СѓР№СЃС‚Р°, Р·Р°РїРѕР»РЅРёС‚Рµ РѕС‚РјРµС‡РµРЅРЅС‹Рµ РїРѕР»СЏ' : '* Please fill in all marked fields',
		    errorMail: (buttonType == 'request') ? ((globalLangVar == 'ru') ? '* РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РїСЂРѕРІРµСЂСЊС‚Рµ Р’Р°С€ e-mail Р°РґСЂРµСЃ' : '* Please check your E-mail address') : '* РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РїСЂРѕРІРµСЂСЊС‚Рµ Р’Р°С€ e-mail Р°РґСЂРµСЃ'
		},

		// path form detection
		pathForm: function(obj) {}
    };

})(jQuery);

$(document).ready(function(){
	$.extJQForm.popupInit();
	$.extJQForm.freeQoute();

	if($('.b-feedback').is(':visible')) {
		var element = $('.button__attach').parents('.b-feedback_item').find('.upload').get(0),
			action = globalBasePath +  'form_quote_request';
		$.extJQForm.uploadFile(element, action);	
	};
});