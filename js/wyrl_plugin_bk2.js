(function($){
	function WinForm(id, $winform){
		var id = id;
		var win_title = $winform.attr('win-title');
		var win_maximize = '';
		var win_minimizes = [];
		var win_closes = [];

		var win_size = { width : 0, height : 0};
		var win_position = { top : 0, left : 0};

		var closed = function(){
			$winform.remove();
			//remove(minimizeList, $winform);
		}

		$winform.find('.close').click(function(){
			/*var enable = win_close.call()
			console.log('enable: ' + enable);
			var isCancel = win_close != null && $.isFunction(win_close) && enable != undefined && !enable
			if (!isCancel){
				close();
			}*/
			/*var isCancel = true;
			console.log(win_closes.length);
			$.each(win_closes, function(key, win_close){
				console.log(win_close);
				var enable = win_close.call();
				console.log('enable: ' + enable);
				isCancel = win_close != null && $.isFunction(win_close) && enable != undefined && !enable
			});
			if (!isCancel){
				closed();
			}*/
			var isEnabled;
			$.each(win_closes, function(key, win_close_opts){
				isEnabled = win_close_opts.enabled;
				console.log(isEnabled);
				if (win_close_opts.closing != undefined)
					win_close_opts.closing.call();

				if(isEnabled){
					closed();
				}
			});

			//animateTaskbar();
		});


		return {
			getId : function(){
				return id;
			},
			setTitle : function(title){
				win_title = title;
			},
			getTitle : function(){
				return win_title;
			},
			setSize : function(size){
				win_size = size;
			},
			setPosition : function(position){
				win_position = position;
			},
			addMinimize : function(f){
				win_minimizes.push(f);
			},
			setMaximize : function(state){
				win_maximize = state;
			},
			addClose : function(options){
				win_closes.push(options);
				//win_close = f;
				//win_closes.push(f.closing);
			},
			closed : function(){
				closed()
			}
		}
	}


	var focusCount = 0;
	var minimizeList = [];
	var taskList = [];
	var win_id = 0;


	var html_winform = 	"<div class='topbar'>" +
							"<span class='title'></span>" +
							"<div class='controlbox' style='float:right;cursor: default;'>" +
								"<span class='minimize'>&#x23BD;</span>" +
								"<span class='maximize'>&#xE739;</span>" +
								"<span class='close'>&#xE106;</span>" +
							"</div>" +
						"</div>"

	$.fn.addWinForm = function(options){
		
	}

	function checkTitle($el, length){
		if($el.attr('win-title') == undefined || $el.attr('win-title') == '')
			$el.attr('win-title', 'Untitled');
		if(($el.attr('win-title').length * 10) + $el.find('.controlbox').width() >= $el.width()){
			var str1 = $el.attr('win-title');
			$el.find('.title').text(str1.substring(0, length) + "...");
		}
		else{
			$el.find('.title').text($el.attr('win-title'));
		}
	}

	function findWinFormById(id){
		for (var i = 0; i < taskList.length; i++)
			if(Number(taskList[i].getId()) == Number(id))
				return taskList[i];
		return null;
	}

	function setTempAttr($winform){
		$winform.attr('temp-width', $winform.width());
		$winform.attr('temp-height', $winform.height());
		$winform.attr('temp-top', Number($winform.offset().top) - window.scrollY);
		$winform.attr('temp-left', Number($winform.offset().left) - window.scrollX);
	}
	function restoreTempAttr($winform){
		$winform.animate({
			top: $winform.attr('temp-top'),
			left: $winform.attr('temp-left'),
			width: $winform.attr('temp-width') + 'px',
			height: $winform.attr('temp-height') + 'px'
		}, 'fast');
	}

	function remove(array, element){
		const index = array.indexOf(element);
    	array.splice(index, 1);
	}

	function animateTaskbar(){
		for(var i = 0; i < minimizeList.length; i++){
			var $winform = minimizeList[i];
			var index = i;

			$winform.animate({
					top: (window.innerHeight - 45),
					left: 152 * i,
					height: "40px",
					width: "150px"
				}, 'fast');

				

				$(window).bind('resize', function(){
					if($winform != undefined){
						$winform.offset({
							top: (window.innerHeight - 45),
							left: 153 * index,
						});
					}
				});
		}
	}
	/*$.fn.winform = function(options){
		return this.each(function(){

		});
	}*/
	/*$.fn.winform = {
		init : function(options){
			var opts = $.extend({
				title : null,
				minimize: null,
				maximize: null,
				close: null
			}, $.fn.winform, options);

			$.fn.winform.minimize = function(){

			}
			console.log($(this).length);
		},
		close : function(){
			$.fn.winform.each(function(){
				console.log('wew...');
			});
		}
	}*/
	$.fn.winform = function(options){
		this.each(function(index, row){
			var $winform = $(row);
			$winform.attr('win-id', ++win_id);
			var $topbar = $winform.find('.topbar');
			var opts = $.extend({
					title : null,
					minimize: null,
					maximize: null,
					close: null
				}, $.fn.winform, options);


			if(opts.title != null)
				$winform.attr('win-title', opts.title);

			var tempContentHtml = $winform.html();
			var newContent = '<div class="window-content">'+ tempContentHtml +'</div>';

			$winform.addClass('winform ui-widget-content');
			$winform.addClass('win-init');
			$winform.html(html_winform + newContent);

			checkTitle($winform, 15);

			var wf = new WinForm(win_id, $winform);
			taskList.push(wf);

			$winform.css({
		    	'min-width': '250px',
		    	'min-height': '250px'
			});

			$winform.draggable({     
		        helper: function(){
		            return $('<div></div>').css('opacity',0);
		        },
		        drag: function(event, ui){
		            $(this).stop().animate({
		                top: ui.helper.position().top,
		                left: ui.helper.position().left
		            }, 'fast','easeOutCirc');
		        },
		        start: function(event, ui){
		        	//$winform.find('.window-content').addClass('disable-mouse-events');
		        	$('.window-content').addClass('disable-mouse-events');
		        },
		        stop: function(event, ui){
		        	//$winform.find('.window-content').removeClass('disable-mouse-events');
		        	$('.window-content').removeClass('disable-mouse-events');
		        	wf.setPosition({
		        		top : ui.helper.position().top,
		        		left: ui.helper.position().left
		        	});
		        },
		        handle: '.topbar'
		    });

		    
			$winform.resizable({
				resize: function(event, ui){
					checkTitle($winform, 15);
				},
				start: function(event, ui){
					//$winform.find('.window-content').addClass('disable-mouse-events');
					$('.window-content').addClass('disable-mouse-events');
				},
				stop: function(event, ui){
					//$winform.find('.window-content').removeClass('disable-mouse-events');
					$('.window-content').removeClass('disable-mouse-events');
					wf.setSize({
						width : ui.helper.width(),
						height : ui.helper.height()
					});
					console.log('width: ' + ui.helper.width() + ', height: ' + ui.helper.height());
				}
			});

			$winform.mousedown(function(){
				$(this).css('z-index', focusCount++);
			});

			$winform.find('.minimize').click(function(){
				/*if($.isFunction(opts.minimize))
					opts.minimize.call(this,$winform.attr('minimize') == undefined || 
					$winform.attr('minimize') == 'false');*/

				var wf = findWinFormById($winform.attr('win-id'));

				/*if($winform.attr('minimize') == undefined || 
					$winform.attr('minimize') == 'false'){

					
					if($winform.attr('maximize') == undefined ||
						$winform.attr('maximize') == 'false')
							setTempAttr($winform);
					else{
						$winform.attr('maximize', 'false');
						$winform.find('.maximize').html('&#xE739;');
					}

					minimizeList.push($winform);
					animateTaskbar();
					$winform
						.css({
					    	'min-width': '150px',
					    	'min-height': '40px'
						})
						.resizable('disable')
						.draggable('disable');

					$winform.find('.title').text($winform.attr('win-title').substring(0, 5) + "...");
					$winform.find('.minimize').html('&#xE923;');
					$winform.find('.maximize').hide();


					$winform.addClass('left-top-corner');

					$winform.attr('minimize', 'true');
				}
				else{
					$winform.attr('minimize', 'false');

					restoreTempAttr($winform);

					$winform
						.css({
					    	'min-width': '250px',
					    	'min-height': '250px'
						})
						.resizable('enable')
						.draggable('enable');

					$winform.removeClass('left-top-corner');

					checkTitle($winform, 15);

					$(window).unbind('resize');
					$winform.find('.minimize').html('&#x23BD;');
					$winform.find('.maximize').show();
					remove(minimizeList, $winform);
					animateTaskbar()
				}*/

			});

			$winform.find('.maximize').click(function(){

				if($.isFunction(opts.maximize))
					opts.maximize.call(this, $winform.attr('maximize') == undefined ||
					$winform.attr('maximize') == 'false');

				if($winform.attr('maximize') == undefined ||
					$winform.attr('maximize') == 'false'){
					$winform.attr('maximize', 'true');
					setTempAttr($winform);
					$winform.find('.maximize').html('&#xE923;');

					$winform.animate({
						top: 0,
						left: 0,
						height: window.innerHeight + "px",
						width:  window.innerWidth + "px"
					}, 'fast');
				}
				else{
					$winform.attr('maximize', 'false');
					restoreTempAttr($winform);
					$winform.find('.maximize').html('&#xE739;');
				}
				
			});

			/*$winform.find('.close').click(function(){
				$winform.remove();
				remove(minimizeList, $winform);
				animateTaskbar();
			});*/
		});
	}
	$.fn.winclose = function(f){


		this.each(function(){
			if($(this).hasClass('win-init')){
				var wf = findWinFormById($(this).attr('win-id'));
				
				if(wf != null){
					var options;

					if(typeof f == 'boolean')
						options = {enabled : f};
					else if($.isFunction(f))
						options = {closing : f};
					else if ($.isArray(f))
						options = f;

					if(f != undefined){
						var opts = $.extend({
							visible : true,
							enabled : true,
							closing : null
						}, $.fn.winclose, options);


						wf.addClose(options);
					}
					else{
						wf.closed();
					}
				}
			}
		})
	}

})(jQuery);

$(function(){
	//$('.winform').addWinForm();
	//$('.winform').winform.init();
	$('.winform').winform();
	$('.winform').winclose(false);
	$('.winform').winclose(true);
});

/*$(function(){
	$('.winform').each(function(index, row){
		$(this).addWinForm({
			minimize: function(toggle){
				console.log('minimize ' + toggle);
			},
			maximize: function(toggle){
				console.log('maximize ' + toggle);
			}
		});
	});
})*/