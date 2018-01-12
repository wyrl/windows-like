$(function(){
	$('#test2').winform();
	///$('#test2').winclose(false);
	//$('#test2').winminimize(false);
	//$('#test2').winmaximize(false);

	$('#test3').winform({
		type: 'win7',
		title : 'My name is',
	});

	$('#test1').winform('ubuntu');
	/*$('#test1').winclose(false);
	$('#test1').winminimize(false);
	$('#test1').winmaximize(false);*/


});