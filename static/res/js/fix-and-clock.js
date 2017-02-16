$(document).ready(function() {
//-----------------------------------------------------------------------------------
//	0.	Modernizr test
//-----------------------------------------------------------------------------------
if (Modernizr.cssanimations) {
	$('#fail').remove();
}
else {
	$('#fail').addClass('visible');
}

//-----------------------------------------------------------------------------------
//	1.	Clock
//-----------------------------------------------------------------------------------

var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]; 
var dayNames= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

var newDate = new Date();
newDate.setDate(newDate.getDate());
$('#DateAbbr').html(dayNames[newDate.getDay()].substr(0,3) + " ");

setInterval( function() {
	var minutes = new Date().getMinutes();
	$(".min, .mins").html(( minutes < 10 ? "0" : "" ) + minutes);
    },1000);
	
setInterval( function() {
	var hours = new Date().getHours();
	$(".hours, .hour").html(( hours < 10 ? "0" : "" ) + hours);
    }, 1000);
	
//-----------------------------------------------------------------------------------
//	2.	Fix Classes after Validate Login
//-----------------------------------------------------------------------------------

$(".submit").click(function(e) {
	e.preventDefault();
	if($('#number').attr('data-rel') == 'initotp'){
		var number = $('#number').val();
		if(number.length == 10)
		{
			var req = {"number": number};
			$.get('/checkregistered', req, function(data) {
				if(data == 'registered')
				{
					redirectPage();
				}
				else
				{
					$('#number').addClass('valid');
					$('.submit').removeClass('submit').addClass('charge');
					$('#number').attr('placeholder', "Enter the OTP");
					$('#number').attr('data-rel', 'initreg');
					$('#number').attr('number', number);
					$('#number').val('');	
					$('#mobile').attr('value', number);
				}
			});
		}
	}
	else if($('#number').attr('data-rel') == 'initreg'){
		var otp = $('#number').val();
		var number = $('#number').attr('number');
		var req = {"otp": otp, "number": number };
		$.get('/verifyotp', req, function(data) {
			if(data == 'true'){
				$("number").addClass('valid');
				$('.submit').removeClass('submit').addClass('charge');
				$('#pageLogin').addClass('initLog').delay(1900).queue(function() { $(this).removeClass('initLog').addClass('initLogExit'); $(this).dequeue(); }); 
				$('#register').delay(2500).queue(function() { $(this).addClass('vis'); $(this).addClass('vis'); $(this).dequeue(); });
			}	
			else {
				$("#number").select();
				$(".validate").addClass('error').delay(210).queue(function() { $(this).removeClass('error'); $(this).dequeue(); });
				return false;
			}
		});
    }
});

//-----------------------------------------------------------------------------------
//	3.	Draggable Windows
//-----------------------------------------------------------------------------------

$('.content').remove();

var a = 3;
$('.content,.specific,.project,.share').draggable({ handle: '.title-inside', start: function(event, ui) { $(this).css("z-index", a++); }});
$(".window").draggable({ handle: '.titleInside, .title-mac, .tab', refreshPositions: true, containment: 'window', start: function(event, ui) { $(this).css("z-index", a++); } });


//-----------------------------------------------------------------------------------
//	4.	Dock
//-----------------------------------------------------------------------------------

$('.dock ul li').hover(
	function(){
		$(this).addClass('ok').prev().addClass('prev').prev().addClass('prev-ancor');
		$(this).addClass('ok').next().addClass('next').next().addClass('next-ancor');
	},
	function(){
		$('.dock ul li').removeClass('ok prev next next-ancor prev-ancor');
	}
);

//-----------------------------------------------------------------------------------
//	5.	Hide and Close
//-----------------------------------------------------------------------------------
var left = 50 + '%';
var top = 15 + '%';
var item = $('<div class="fresh"></div>').hide();
var itemR = $('<div class="fresh"></div>').hide();

$("a[data-rel=close]").click(function(e) {
    e.preventDefault();
    $(this.hash).fadeOut(200, function() {
		$(this).css({ top: top, left: left });
	});
});

$("a[data-rel=show]").click(function(e) {
    e.preventDefault();
    $(this.hash).show();
});

$(".dock li a[data-rel=showOp]").click(function(e) {
    e.preventDefault();
	$(this).addClass('bounce').delay(1600).queue(function() { $(this).removeClass('bounce'); $(this).append(item); item.fadeIn(500); $(this).dequeue(); });
    $("#finder").delay(1630).queue(function() { $(this).show(); $(this).dequeue(); });
});

$("#finder a[data-rel=close]").click(function(e) {
    e.preventDefault();
	item.fadeOut(500);
    $(this.hash).hide();
});

$("#number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
		}
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
});

$("ul#sidebarlinks li").click(function(e) {
    e.preventDefault();
    console.log('your message');
    $("ul#sidebarlinks li.current_page").removeClass("current_page");
    $(this).addClass("current_page");
    $('#content').show();
});

// folder click 

$("#content span").click(function(e) {
		e.stopPropagation();
		if (e.shiftKey) {
				//Shift-Click
				$(this).addClass("focus");
		} else {
				$(".focus").removeClass("focus");
				$(this).addClass("focus");
		}
});
$("body:not(#content span)").click(function() {
		$("#content span").removeClass("focus");

});

$("#content span").dblclick(function() {
	$('#about-this-mac').show();
	$('#finder').css('zIndex', '-1');

});

$(".dock li a[data-rel=showOpTrash]").click(function(e) {
    e.preventDefault();
	$(this).addClass('bounce').delay(1600).queue(function() { $(this).removeClass('bounce'); $(this).append(itemR); itemR.fadeIn(500); $(this).dequeue(); });
    $("#trash").delay(1630).queue(function() { $(this).show(); $(this).dequeue(); });
});

$("#trash a[data-rel=close]").click(function(e) {
    e.preventDefault();
	itemR.fadeOut(500);
    $(this.hash).hide();
});


});

//-----------------------------------------------------------------------------------
//	6.	Fix Classes after Register
//-----------------------------------------------------------------------------------

function redirectPage(){
	var req = {};
	req.fname = $("#first_name").val();
	req.lname = $("#last_name").val();
	req.mobile = $("#mobile").attr('value');
	req.gender = $('input[name=sex]:checked').val();
	req.email = $("#email").val();
	req.clg = $("#clg").find(":selected").text();
	req.dept = $("#dept").find(":selected").text();
	req.year = $("#year").val();
	$.post('/register', req, function(data) {
		console.log(data)
	});
	$('#register').addClass('initReg').delay(1900).queue(function() { $(this).removeClass('initReg').addClass('initRegExit'); $(this).dequeue(); });;
	$('#page').addClass('target');
	$('#head').addClass('target');
	$('.window').addClass('target');
	$('#page, #head').delay(2500).queue(function() { $(this).addClass('vis'); $(this).dequeue(); });
	$('.window').delay(3000).queue(function() { $(this).addClass('windows-vis'); $(this).dequeue(); });
	$('#finder').hide();
	$('#content').hide();
	event.preventDefault();
}

