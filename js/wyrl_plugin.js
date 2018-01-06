(function($){
	var focusCount = 0;
	var minimizeList = [];


	var html_winform = 	"<div class='topbar'>" +
							"<span class='title'></span>" +
							"<div class='controlbox' style='float:right;cursor: default;'>" +
								"<span class='minimize'>&#x23BD;</span>" +
								"<span class='maximize'>&#xE739;</span>" +
								"<span class='close'>&#xE106;</span>" +
							"</div>" +
						"</div>"

	$.fn.addWinForm = function(title){
		var $winform = $(this);
		if(arguments.length >= 1){
			$winform.attr('win-title', arguments[0]);
		}


		$winform.addClass('winform ui-widget-content');
		$winform.prepend(html_winform);

		checkTitle($winform, 15);


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
	        handle: '.topbar'
	    });

	    $winform.css({
	    	'min-width': '250px',
	    	'min-height': '250px'
		
		}).resizable({
			resize: function(event, ui){
				checkTitle($winform, 15);
			}
		});

		$winform.mousedown(function(){
			$(this).css('z-index', focusCount++);
		});


		$winform.find('.minimize').click(function(){
			if($winform.attr('minimize') == undefined || 
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
			}

		});

		$winform.find('.maximize').click(function(){
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

		$winform.find('.close').click(function(){
			remove(minimizeList, $winform);
			$winform.remove();
			animateTaskbar();
		});
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

})(jQuery);

$(function(){
	$('.winform').each(function(index, row){
		$(this).addWinForm();
	});
})