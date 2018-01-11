$(document).ready(function(){
	console.log("header-banner-height: " + $("#header-banner").height());
	console.log("document width: " + $(document).width());
	var navbar_width = $("#navbar").width();
	$(window).scroll(function(){
		var top = $(document).scrollTop();
		var header_height = $("#header-banner").height();
		//console.log(top);
		if(top > header_height && $(document).width() > 755){
			$("#navbar").addClass("navbar-fixed");
			$("#navbar").width(navbar_width);
			$("#header-banner").addClass("header-toggle");
		}
		else{
			$("#navbar").removeClass("navbar-fixed");
			$("#header-banner").removeClass("header-toggle");	
		}

	});
});