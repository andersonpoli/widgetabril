	$(document).ready(function() {
		$(".config-button").click(function() {
			$("#materias").slideToggle();
			$("#config").slideToggle();
		});
		$(".close-config").click(function() {
			$("#config").slideToggle();
			$("#materias").slideToggle();
		});
		$("#config ul li").click(function() {
			$(this).toggleClass("ativo");
		});
	});