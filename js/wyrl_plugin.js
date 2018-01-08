(function($){
	var html_winform = 	"<div class='topbar'>" +
							"<span class='title'></span>" +
							"<div class='controlbox' style='float:right;cursor: default;'>" +
								"<span class='minimize'>&#x23BD;</span>" +
								"<span class='maximize'>&#xE739;</span>" +
								"<span class='close'>&#xE106;</span>" +
							"</div>" +
						"</div>"



	function WinForm(id, $winform){
		var id = id;
		//var win_title = $winform.attr('win-title');
		
		var win_maximizes = [];
		var isMaximizeVisible = true;
		var maximize_toggle = false;

		var win_minimizes = [];
		var isMinimizeVisible = true;
		var minimize_toggle = false;
		
		var win_closes = [];
		var is_closed = true;

		var win_size = { width : 0, height : 0};
		var win_position = { top : 0, left : 0};

		var _this = this;

		var tempContentHtml = $winform.html();
		var newContent = '<div class="window-content">'+ tempContentHtml +'</div>';

		$winform.addClass('winform ui-widget-content');
		$winform.addClass('win-init');
		$winform.html(html_winform + newContent);

		checkTitle($winform, 15);

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
	        	$('.window-content').addClass('disable-mouse-events');
	        },
	        stop: function(event, ui){
	        	$('.window-content').removeClass('disable-mouse-events');

	        	win_position.top = ui.helper.position().top;
	        	win_position.left = ui.helper.position().left;
	        },
	        handle: '.topbar'
	    });

	    $winform.resizable({
			resize: function(event, ui){
				checkTitle($winform, 15);
			},
			start: function(event, ui){
				$('.window-content').addClass('disable-mouse-events');
			},
			stop: function(event, ui){
				$('.window-content').removeClass('disable-mouse-events');
				win_size.width = ui.helper.width();
				win_size.height = ui.helper.height();

				console.log('width: ' + ui.helper.width() + ', height: ' + ui.helper.height());
			}
		});

		var maximize = function(){
			if(!maximize_toggle){
				$winform.find('.maximize').html('&#xE923;');
				$winform.animate({
					top: 0,
					left: 0,
					height: window.innerHeight + "px",
					width:  window.innerWidth + "px"
				}, 'fast');

				$(window).bind('resize', function(){
					$winform.width(window.innerWidth);
					$winform.height(window.innerHeight);
				});

				enabledAll(false);
			}
			else{
				restore();
				enabledAll(true);
				$(window).unbind('resize');
				$winform.find('.maximize').html('&#xE739;');
			}
			maximize_toggle = !maximize_toggle;
		};

		var minimize = function(){
			if(!minimize_toggle){
				if(maximize_toggle){
					maximize_toggle = false;
					$winform.find('.maximize').html('&#xE739;');
				}

				enabledAll(false);

				$winform.find('.title').text($winform.attr('win-title').substring(0, 5) + "...");
				$winform.find('.minimize').html('&#xE923;');
				$winform.find('.maximize').hide();


				$winform.addClass('left-top-corner');
			}
			else{
				restore();

				enabledAll(true);

				$winform.removeClass('left-top-corner');

				checkTitle($winform, 15);

				$(window).unbind('resize');
				$winform.find('.minimize').html('&#x23BD;');
				if(isMaximizeVisible)
					$winform.find('.maximize').show();
			}


			minimize_toggle = !minimize_toggle;
		}

		var enabledAll = function(enable){
			if(!enable){
				$winform
					.css({
				    	'min-width': '150px',
				    	'min-height': '40px'
					})
					.resizable('disable')
					.draggable('disable');
			}
			else{
				$winform
					.css({
				    	'min-width': '250px',
				    	'min-height': '250px'
					})
					.resizable('enable')
					.draggable('enable');
			}
		}

		var restore = function(){
			$winform.animate({
				top: win_position.top,
				left: win_position.left,
				width: win_size.width + 'px',
				height: win_size.height + 'px'
			}, 'fast');
		}

		$winform.find('.minimize').click(function(){
			var isCancel = false;
			$.each(win_minimizes, function(index, win_minimize){
				if(index != 0){
					var enable = win_minimize.call(_this, !minimize_toggle);
					isCancel = win_minimize != null && $.isFunction(win_minimize) && enable != undefined && !enable
				}
			});
			if(!isCancel){
				minimize();
				win_minimizes[0].call(_this, minimize_toggle);
			}
		});


		$winform.find('.maximize').click(function(){
			var isCancel = false;
			$.each(win_maximizes, function(index, win_maximize){
				if(index != 0){
					var enable = win_maximize.call(_this, !maximize_toggle);
					isCancel = win_maximize != null && $.isFunction(win_maximize) && enable != undefined && !enable
				}
			});
			if(!isCancel){
				maximize();
				win_maximizes[0].call(_this, maximize_toggle);
			}
		});

		$winform.find('.close').click(function(){
			var isCancel = false;
			$.each(win_closes, function(index, win_close){
				if(index != 0){
					var enable = win_close.call();
					isCancel = win_close != null && $.isFunction(win_close) && enable != undefined && !enable
				}
			});
			if (!isCancel){
				closed();
				win_closes[0].call();
			}
		});

		var closed = function(){
			$winform.remove();
			is_closed = false;
		}


		return {
			getId : function(){
				return id;
			},
			setTitle : function(title){
				win_title = title;
			},
			getTitle : function(){
				return $winform.attr('win-title');
			},
			setSize : function(size){
				win_size = size;
			},
			setPosition : function(position){
				win_position = position;
			},
			addMinimize : function(options){
				win_minimizes.push(options.minimizing);
				if(options.visible)
					$winform.find('.minimize').show();
				else
					$winform.find('.minimize').hide();

				isMinimizeVisible = options.visible;
			},
			addMaximize : function(options){
				win_maximizes.push(options.maximizing);
				if(options.visible)
					$winform.find('.maximize').show();
				else
					$winform.find('.maximize').hid();

				isMaximizeVisible = options.visible;
			},
			addClose : function(options){
				win_closes.push(options.closing);
				if(options.visible)
					$winform.find('.close').show();
				else
					$winform.find('.close').hide();
			},
			closed : function(){
				closed()
			},
			isClosed : is_closed,
			isMinimized : minimize_toggle,
			isMaximized : maximize_toggle
		}
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
	function isJSON (something) {
	    if (typeof something != 'string')
	        something = JSON.stringify(something);

	    try {
	        JSON.parse(something);
	        return true;
	    } catch (e) {
	        return false;
	    }
	}

	var focusCount = 0;
	var minimizeList = [];
	var taskList = [];
	var win_id = 0;

	$.fn.winform = function(options){
		this.each(function(index, row){
			var $winform = $(row);
			$winform.attr('win-id', ++win_id);
			var $topbar = $winform.find('.topbar');
			var opts = $.extend({
					title : null,
					minimizing: null,
					maximizing: null,
					closing: null,
					'minimize-visible' : true,
					'maximize-visible' : true,
					'close-visible' : true,
				}, $.fn.winform, options);


			if(opts.title != null)
				$winform.attr('win-title', opts.title);

			var wf = new WinForm(win_id, $winform);
			taskList.push(wf);

			$winform.mousedown(function(){
				$(this).css('z-index', focusCount++);
			});

			wf.addMaximize({
				visible : true,
				maximizing : function(toggle){

				}
			});

			wf.addMinimize({
				visible : true,
				minimizing : function(toggle){
					if(toggle){
						minimizeList.push($winform);
					}
					else{
						remove(minimizeList, $winform);
					}
					animateTaskbar();
				}
			});

			wf.addClose({
				visible : true, 
				closing : function(){
					remove(minimizeList, $winform);
					remove(taskList, $winform);
					animateTaskbar();
					console.log('closed...');
				}
			});

			wf.addMinimize({
				visible : opts['minimize-visible'],
				minimizing : (opts.minimizing != null ? opts.minimizing : function(){return true;})
			});

			wf.addMaximize({
				visible : opts['maximize-visible'],
				maximizing : (opts.maximizing != null ? opts.maximizing : function(){return true;})
			});

			
		});
	}

	$.fn.winclose = function(f){
		var isJSOnOrArray = isJSON(f) || $.isArray(f);

		return this.each(function(){
			if($(this).hasClass('win-init')){
				var wf = findWinFormById($(this).attr('win-id'));
				
				if(wf != null){
					var options;

					if(typeof f == 'boolean')
						options = {closing : function() { return f}};
					else if(typeof f == 'string')
						options = {closing : function() { return f != 'false'}}
					else if($.isFunction(f))
						options = {closing : f};
					else if (isJSOnOrArray){
						options = f;
					}

					if(f != undefined){
						var opts = $.extend({
							visible : true,
							closing : null
						}, $.fn.winclose, options);
						//console.log(opts.visible);

						wf.addClose(opts);
					}
					else{
						wf.closed();
					}
				}
			}
		})
	}
	$.fn.winminimize = function(f){

	}

})(jQuery);

$(function(){
	//$('.winform').addWinForm();
	//$('.winform').winform.init();
	$('.winform').winform();
	$('#test1').winclose(function(){
		alert('Sorry! can\'t closed.');
		return false;
	});
	$('.winform').winminimize(function(){

	});
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