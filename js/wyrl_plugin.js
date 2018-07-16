(function($){
	var theme = {
		win7 : {
			controlbox : {
				minimize : {
					index : 0,
					symbol : '<img src="../images/min.png" />'
					//symbol : '&#xE921;'
				},
				maximize :{
					index : 1,
					symbol : '<img src="../images/max.png" />'
					//symbol : '&#xE922;'
				},
				win_close :{
					index : 2,
					symbol : '<img src="../images/close.png" />'
					//symbol : '&#xE711;',
					//icon : 'close.png'
				},
				restore : {
					index : 3,
					symbol : '<img src="../images/restore.png" />'
					//symbol : '&#xE923;',
				}
			}
		},
		win10 : {
			/*controlbox : [
				{
					name : 'minimize',
					symbol : '&#xE949;',
				},
				{
					name : 'maximize',
					symbol : '&#xE739;'
				},
				{
					name : 'close',
					symbol : '&#xE106;'
				},
				{
					name : 'restore',
					symbol : '&#xE923;'
				}
			]*/
			controlbox : {
				minimize : {
					index : 0,
					symbol : '&#xE949;'
				},
				maximize :{
					index : 1,
					symbol : '&#xE739;'
				},
				win_close :{
					index : 2,
					symbol : '&#xE106;'
				},
				restore : {
					index : 3,
					symbol : '&#xE923;'
				}
			}
		},
		ubuntu : {
			/*controlbox : [
				{
					name : 'close',
					symbol : '&#xE711;',
				},
				{
					name : 'minimize',
					symbol : '&#xE738;'
				},
				{
					name : 'maximize',
					symbol : '&#xE739;'
				},
				{
					name : 'restore',
					symbol : '&#xE923;'
				}
			]*/
			controlbox: {
				win_close : {
					index : 0,
					symbol : '&#xE711;'
				},
				minimize : {
					index : 1,
					symbol : '&#xE738;'
				},
				maximize : {
					index : 2,
					symbol : '&#xE739;'
				},
				restore : {
					index : 3,
					symbol : '&#xE923;'
				}

			}
		}
	};



	/*var html_winform = 	"<div class='topbar'>" +
							"<span class='title'></span>" +
							"<div class='controlbox'>" +
								"<span class='minimize'>&#xE738;</span>" +
								"<span class='maximize'>&#xE739;</span>" +
								"<span class='close'>&#xE106;</span>" +
							"</div>" +
						"</div>"*/



	function WinForm(id, type,$winform){
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

		//console.log(type);

		var cbKey1 = Object.keys(theme[type].controlbox)[0];
		var cbKey2 = Object.keys(theme[type].controlbox)[1];
		var cbKey3 = Object.keys(theme[type].controlbox)[2];


		var html_winform = 	"<div class='topbar'>" +
							"<span class='title'></span>" +
							"<div class='controlbox'>" +
								"<span class='"+ cbKey1 +"'>"+ theme[type].controlbox[cbKey1].symbol +"</span>" +
								"<span class='"+ cbKey2 +"'>"+ theme[type].controlbox[cbKey2].symbol +"</span>" +
								"<span class='"+ cbKey3 +"'>"+ theme[type].controlbox[cbKey3].symbol +"</span>" +
							"</div>" +
						"</div>";

		var tempContentHtml = $winform.html();
		var newContent = '<div class="window-content">'+ tempContentHtml +'</div>';

		$winform.addClass('ui-widget-content');
		$winform.addClass(type);
		$winform.addClass('winform');
		$winform.addClass('win-init');

		$winform.html(html_winform + newContent);

		checkTitle($winform, 15);

		$winform.css({
	    	'min-width': '250px',
	    	'min-height': '250px'
		});

		$winform.draggable({     
	        helper: function(){
	            return $('<div></div>').css('opacity',0).css('position', 'fixed');
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
				$winform.find('.maximize').html(theme[type].controlbox.restore.symbol);
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
				$winform.find('.maximize').html(theme[type].controlbox.maximize.symbol);
			}
			maximize_toggle = !maximize_toggle;
		};

		var minimize = function(){
			if(!minimize_toggle){
				if(maximize_toggle){
					maximize_toggle = false;
					$winform.find('.maximize').html(theme[type].controlbox.maximize.symbol);
				}

				enabledAll(false);

				$winform.find('.title').text($winform.attr('win-title').substring(0, 5) + "...");
				$winform.find('.minimize').html(theme[type].controlbox.restore.symbol);
				$winform.find('.maximize').hide();


				$winform.addClass('left-top-corner');
			}
			else{
				restore();

				enabledAll(true);

				$winform.removeClass('left-top-corner');

				checkTitle($winform, 15);

				$(window).unbind('resize');
				$winform.find('.minimize').html(theme[type].controlbox.minimize.symbol);
				if(isMaximizeVisible)
					$winform.find('.maximize').show();
			}


			minimize_toggle = !minimize_toggle;
		}

		var closed = function(){
			$winform.remove();
			is_closed = false;
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
					var enable = win_minimize(!minimize_toggle);
					isCancel = win_minimize != null && $.isFunction(win_minimize) && enable != undefined && !enable
				}
			});
			if(!isCancel){
				minimize();
				win_minimizes[0](minimize_toggle);
			}
		});


		$winform.find('.maximize').click(function(){
			var isCancel = false;
			$.each(win_maximizes, function(index, win_maximize){
				if(index != 0){
					var enable = win_maximize(!maximize_toggle);
					isCancel = win_maximize != null && $.isFunction(win_maximize) && enable != undefined && !enable
				}
			});
			if(!isCancel){
				maximize();
				win_maximizes[0](maximize_toggle);
			}
		});

		$winform.find('.win_close').click(function(){
			var isCancel = false;
			$.each(win_closes, function(index, win_close){
				if(index != 0){
					var enable = win_close();
					isCancel = win_close != null && $.isFunction(win_close) && enable != undefined && !enable
				}
			});
			if (!isCancel){
				closed();
				win_closes[0]();
			}
		});

		


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
					$winform.find('.maximize').hide();

				isMaximizeVisible = options.visible;
			},
			addClose : function(options){
				win_closes.push(options.closing);
				if(options.visible)
					$winform.find('.win_close').show();
				else
					$winform.find('.win_close').hide();
			},
			maximized : function(){
				maximize();
			},
			minimized : function(){
				minimize();
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
		return taskList.find(v => v.getId() == Number(id));
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

	var focusCount = 1000;
	var minimizeList = [];
	var taskList = [];
	var win_id = 0;

	$.fn.winform = function(options){
		this.each(function(index, row){
			var $winform = $(row);
			if(!$winform.hasClass('win-init')){
				$winform.attr('win-id', ++win_id);
				var $topbar = $winform.find('.topbar');
				var opts = $.extend({
						type : 'win10',
						title : null,
						minimizing: null,
						maximizing: null,
						closing: null,
						'minimize-visible' : true,
						'maximize-visible' : true,
						'close-visible' : true,
					}, $.fn.winform, options);

				if(typeof options == 'string')
					opts.type = options;


				if(opts.title != null)
					$winform.attr('win-title', opts.title);

				var wf = new WinForm(win_id, opts.type, $winform);
				taskList.push(wf);

				$winform.css('z-index', focusCount);

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
						if(opts.closing != null)
							opts.closing();
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
			}
			
		});
	}

	$.fn.winclose = function(f){
		var isJSOnOrArray = isJSON(f) || $.isArray(f);

		return this.each(function(){
			if($(this).hasClass('win-init')){
				var wf = findWinFormById($(this).attr('win-id'));
				
				if(wf != undefined){
					var options;

					if(typeof f == 'boolean')
						options = {closing : function() { return f}};
					else if(typeof f == 'string'){
						if(f == 'show' || f == 'hide'){
							options = {visible : f == 'show'};
						}
						else if(f == 'enable' || f == 'disable'){
							options = {closing : function() { return f == 'enable'}}
						}
					}
					else if($.isFunction(f))
						options = {closing : f};
					else{ //if (isJSOnOrArray){
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
		var isJSOnOrArray = isJSON(f) || $.isArray(f);

		return this.each(function(){
			if($(this).hasClass('win-init')){
				var wf = findWinFormById($(this).attr('win-id'));

				if(wf != undefined){
					var options;

					if(typeof f == 'boolean')
						options = {minimizing : function() { return f}};
					else if(typeof f == 'string'){
						if(f == 'hide' || f == 'show'){
							options = {visible : f == 'show'};
						}
						else if(f == 'false' || f == 'true'){
							options = {minimizing : function() { return f == 'true'; }};
						}
					}
					else if($.isFunction(f))
						options = {minimizing : f};
					else{ //if (isJSOnOrArray){
						options = f;
					}

					if(f != undefined){
						var opts = $.extend({
							visible : true,
							minimizing : null
						}, $.fn.winminimize, options);
						//console.log(opts.visible);

						wf.addMinimize(opts);
					}
					else{
						wf.minimized();
					}
				}
			}
		});
	}

	$.fn.winmaximize = function(f){
		var isJSOnOrArray = isJSON(f) || $.isArray(f);

		return this.each(function(){
			if($(this).hasClass('win-init')){
				var wf = findWinFormById($(this).attr('win-id'));

				if(wf != undefined){
					var options;

					if(typeof f == 'boolean')
						options = {maximizing : function() { return f}};
					else if(typeof f == 'string'){
						if(f == 'hide' || f == 'show'){
							options = {visible : f == 'show'};
						}
						else if(f == 'false' || f == 'true'){
							options = {maximizing : function() { return f == 'true'; }};
						}
					}
					else if($.isFunction(f))
						options = {maximizing : f};
					else{ //if (isJSOnOrArray){
						options = f;
					}

					if(f != undefined){
						var opts = $.extend({
							visible : true,
							maximizing : null
						}, $.fn.winmaximize, options);
						//console.log(opts.visible);

						wf.addMaximize(opts);
					}
					else{
						wf.maximized();
					}
				}
			}
		});
	}

})(jQuery);

$(function(){
	$('.winform').winform();
});