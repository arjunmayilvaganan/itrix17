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
			if(data.trim() == 'true'){
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
$(".window").draggable({ handle: '.titleInside, .title-mac, .tab, #toolbar', refreshPositions: true, containment: 'window', start: function(event, ui) { $(this).css("z-index", a++); } });


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
	req.clg = $("#clg").val();
	req.dept = $("#dept").val();
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

$(function() {
	var colleges = ["A V S Engineering College", "A.C. College of Engineering and Technology (Autonomous)", "A.C.T. College of Engineering and Technology", "A.K.T. Memorial College of Engineering and Technology", "A.R. College of Engineering and Technology", "A.R. Engineering College", "A.R.J College of Engineering and Technology", "A.S.L. Pauls College of Engineering and Technology", "A.V.C College of Engineering", "Aaa College of Engineering and Technology", "Aalim Muhammed Salegh Academy of Architecture", "Aalim Muhammed Salegh College of Engineering", "Adhi College of Engineering and Technology", "Adhiparasakthi College of Engineering", "Adhiparasakthi Engineering College", "Adhiyamaan College of Engineering (Autonomous)", "Adithya Institute of Technology", "Agni College of Technology", "Agni School of Architecture and Design Excellence (ASADE)", "Aishwarya College of Engineering and Technology", "Akshaya College of Engineering & Technology", "Aksheyaa College of Engineering", "Al-Ameen Engineering College", "Alpha College of Engineering", "Anand Institute of Higher Technology", "Anand School of Architecture", "Angel College of Engineering and Technology", "Anjalai Ammal Mahalingam Engineering College", "Annai College of Engineering and Technology", "Annai Mathammal Sheela Engineering College", "Annai Mira College of Engineering and Technology", "Annai Teresa College of Engineering", "Annai Vailankanni College of Engineering", "Annai Veilankanni's College of Engineering", "Annamalaiar College of Engineering", "Annapoorana Engineering College", "Apollo Engineering College", "Apollo Priyadarshanam Institute of Technology", "Arasu Engineering College", "Arignar Anna Institute of Science and Technology", "Aringer Anna College of Engineering and Technology", "Ariyalur Engineering College", "Arjun College of Technology", "ARM College of Engineering and Technology", "ARS College of Engineering", "Arulmigu Meenakshi Amman College of Engineering", "Arulmurugan College of Engineering", "Arunachala College of Engineering for Women", "Arunai College of Engineering", "Arunai Engineering College", "As-Salam College of Engineering and Technology", "Asan Memorial College of Engineering and Technology", "Asian College of Engineering and Technology", "AVS College of Technology", "Balaji Institute of Engineering and Technology", "Bannari Amman Institute of Technology (Autonomous)", "Bethlahem Institute of Engineering", "Bhajarang Engineering College", "Bharath Niketan Engineering College", "Bharathidasan Engineering College", "Bharathiyar Institute of Engineering for Women", "C M S College of Engineering and Technology", "C.A.R.E School of Architecture", "C.A.R.E. Group of Institutions", "C.Abdul Hakeem College of Engineering and Technology", "C.K. College of Engineering and Technology", "C.R. Engineering College", "C.S.I. Institute of Technology", "Cape Institute of Technology", "Capital College of Architecture", "Cauvery College of Engineering and Technology", "Central Electrochemical Research Institute (CSIR) Karaikudi", "Central Institute of Plastics Engineering and Technology", "Chandy College of Engineering", "Chendhuran College of Engineering and Technology", "Chendu College of Engineering and Technology", "Chennai Academy of Architecture and Design", "Chennai Institute of Technology", "Cheran College of Engineering", "Cheran School of Architecture", "Chettinad College of Engineering and Technology", "Christ the King Engineering College", "Christian College of Engineering and Technology", "CMS College of Engineering", "Coimbatore Institute of Engineering and Technology", "Coimbatore Institute of Technology (Autonomous)", "CSI College of Engineering", "D M I College of Engineering", "Da Vinci School of Design and Architecture", "Designed Environment Academy and Research Institute", "Dhaanish Ahmed College of Engineering", "Dhaanish Ahmed Institute of Technology", "Dhanalakshmi College of Engineering", "Dhanalakshmi Srinivasan College of Engineering", "Dhanalakshmi Srinivasan College of Engineering", "Dhanalakshmi Srinivasan College of Engineering and Technology", "Dhanalakshmi Srinivasan Engineering College", "Dhanalakshmi Srinivasan Institute of Research and Technology", "Dhanalakshmi Srinivasan Institute of Technology", "Dhirajlal Gandhi College of Technology", "DMI Engineering College", "Dr. Mahalingam College of Engineering & Technology (Autonomous)", "Dr. Pauls Engineering College", "Dr. G.U. Pope College of Engineering", "Dr. N G P Institute of Technology", "Dr. Nagarathinam's College of Engineering", "Dr. Nallini Institute of Engineering and Technology", "Dr. Navalar Nedunchezhiyan College of Engineering", "Dr. Sivanthi Aditanar College of Engineering", "E.G.S. Pillay Engineering College", "E.S Engineering College", "Easa College of Engineering and Technology", "Easwari Engineering College", "Einstein College of Engineering", "Elizabeth College of Engineering and Technology", "Er. Perumal Manimekalai College of Engineering", "Erode Builder Educational Trust's Group of Institutions", "Erode Sengunthar Engineering College", "Excel College of Architecture and Planning", "Excel College of Engineering and Technology", "Excel Engineering College", "Fatima Michael College of Engineering and Technology", "Francis Xavier Engineering College", "G.G.R. College of Engineering", "G.K.M. College of Engineering and Technology", "Ganadipathy Tulsi's Jain Engineering College", "Ganapathy Chettiar College of Engineering and Technology", "Ganesh College of Engineering", "Global Institute of Engineering and Technology", "Gnanamani College of Engineering", "Gnanamani College of Technology", "Gojan School of Business and Technology", "Gopal Ramalingam Memorial Engineering College", "Government College of Engineering – Bargur", "Government College of Engineering – Dharmapuri", "Government College of Engineering – Salem (Autonomous)", "Government College of Engineering – Srirangam", "Government College of Engineering – Thanjavur", "Government College of Engineering – Tirunelveli", "Government College of Engineering, Bodiyanayakkanur", "Government College of Technology, Coimbatore (Autonomous)", "GRT Institute of Engineering and Technology", "Haji Sheik Ismail Engineering College", "Hindhusthan School of Architecture", "Hindusthan College of Engineering and Technology", "Hindusthan Institute of Technology", "Holy Cross Engineering College", "Hosur Institute of Technology and Science", "Idhaya Engineering College for Women", "IFET College of Engineering", "Imayam College of Engineering", "Immanuel Arasar J J College of Engineering", "Indian Institute of Handloom Technology", "Indira Gandhi College of Engineering and Technology for Women", "Indira Institute of Engineering and Technology", "Indra Ganesan College of Engineering", "Infant Jesus College of Engineering", "Info Institute of Engineering", "Institute of Road and Transport Technology", "J C T College of Engineering and Technology", "J E I Mathaajee College of Engineering", "J K K Munirajah College of Technology", "J P College of Engineering", "J.J. College of Engineering and Technology", "J.K College of Architecture", "J.K.K Munirajah School of Architecture", "J.K.K. Nattraja College of Engineering and Technology", "Jainee College of Engineering and Technology", "Jairupaa College of Engineering", "James College of Engineering and Technology", "Jansons Institute of Technology", "Jawahar Engineering College", "Jawahar School of Architecture, Planning and Design", "Jay Shriram Group of Institutions", "Jaya College of Engineering and Technology", "Jaya Engineering College", "Jaya Institute of Technology", "Jaya Sakthi Engineering College", "Jaya Suriya Engineering College", "Jayalakshmi Institute of Technology", "Jayam College of Engineering and Technology", "Jayamatha Engineering College", "Jayaraj Annapackiam CSI College of Engineering", "Jayaram College of Engineering and Technology", "Jeppiaar Engineering College", "Jeppiaar Institute of Technology", "Jeppiaar Maamallan Institute of Technology", "Jeppiaar SRR Engineering College", "Jerusalem College of Engineering", "JNN Institute of Engineering", "Joe Suresh Engineering College", "John Bosco Engineering College", "K N S K College of Engineering", "K P R Institute of Engineering and Technology", "K S R Institute for Engineering and Technology", "K. Ramakrishnan College of Engineering", "K.C.G. College of Technology", "K.K.C College of Engineering and Technology", "K.L.N. College of Engineering", "K.L.N. College of Information Technology", "K. Ramakrishnan College of Technology", "K.S.K College of Engineering and Technology", "K.S.R. College of Engineering (Autonomous)", "K.S. Rangasamy College of Technology (Autonomous)", "Kalaivani College of Technology", "Kalasalingam Institute of Technology", "Kamaraj College of Engineering and Technology", "Kanchi Pallavan Engineering College", "Karpaga Vinayaga College of Engineering and Technology", "Karpagam College of Engineering (Autonomous)", "Karpagam Institute of Technology", "Karur College of Engineering", "Kathir College of Engineering", "KGISL Institute of Technology", "King College of Technology", "Kings College of Engineering", "Kings Engineering College", "Kingston Engineering College", "KIT & KIM Technical Campus", "KIT - Kalaignar Karunanidhi Institute of Technology", "Knowledge Institute of Technology", "Kongu Engineering College", "Kongu School of Architecture", "Kongunadu College of Engineering and Technology", "Krishnasamy College of Engineering and Technology", "KRS College of Engineering", "KTVR Knowledge Park for Engineering and Technology", "Kumaraguru College of Technology (Autonomous)", "Kurinji College of Engineering and Technology", "Latha Mathavan Engineering College", "Lord Ayyappa Institute of Engineering and Technology", "Lord Jegannath College of Engineering and Technology", "Lord Venkateshwaraa Engineering College", "Lourdes Mount College of Engineering and Technology", "Loyola - ICAM College of Engineering and Technology", "Loyola Institute of Technology", "Loyola Institute of Technology and Science", "M A M School of Architecture", "M R K Institute of Technology", "M.A.M College of Engineering", "M.A.M College of Engineering and Technology", "M.A.M. School of Engineering", "M.A.R. College of Engineering and Technology", "M.E.T Engineering College", "M.I.E.T Engineering College", "M. Kumarasamy College of Engineering (Autonomous)", "M.P. Nachimuthu M. Jaganathan Engineering College", "Madha Engineering College", "Madha Institute of Engineering and Technology", "Madurai Institute of Engineering and Technology", "Magna College of Engineering", "Maha Barathi Engineering College", "Mahakavi Bharathiyar College of Engineering and Technology", "Mahalakshmi Engineering College", "Maharaja Engineering College", "Maharaja Engineering College for Women", "Maharaja Institute of Technology", "Maharaja Prithvi Engineering College", "Mahath Amma Institute of Engineering and Technology", "Mahendra College of Engineering", "Mahendra Engineering College", "Mahendra Engineering College for Women", "Mahendra Institute of Engineering and Technology", "Mahendra Institute of Technology", "Mailam Engineering College", "Mangayarkarasi College of Engineering", "Mar Ephraem College of Engineering and Technology", "Marg Institute of Design & Architecture Swarnabhoomi (Midas)", "Maria College of Engineering and Technology", "Marthandam College of Engineering and Technology", "Mcgan's Ooty School of Architecture", "Measi Academy of Architecture", "Meenakshi College of Engineering", "Meenakshi Ramaswamy Engineering College", "Meenakshi Sundararajan Engineering College", "Mepco Schlenk Engineering College (Autonomous)", "Misrimal Navajee Munoth Jain Engineering College", "Misrimal Navajee Munoth Jain School of Architecture", "MNSK College of Engineering", "Mohamed Sathak A.J. Academy of Architecture", "Mohamed Sathak A.J.College of Engineering", "Mohamed Sathak Engineering College", "Mookambigai College of Engineering", "Mother Terasa College of Engineering and Technology", "Mount Zion College of Engineering and Technology", "Muthayammal College of Engineering", "Muthayammal Engineering College", "N P R College of Engineering and Technology", "N.R. School of Architecture", "N.S.N. College of Engineering and Technology", "Nadar Saraswathi College of Engineering & Technology", "Nandha College of Technology", "Nandha Engineering College (Autonomous)", "Narasu's Sarathy Institute of Technology", "Narayanaguru College of Engineering", "Narayanaguru Siddhartha College of Engineering", "National College of Engineering", "National Engineering College (Autonomous)", "Nehru Institute of Engineering and Technology", "Nehru Institute of Technology", "Nehru School of Architecture", "Nelliandavar Institute of Technology", "New Prince Shri Bhavani College of Engineering and Technology", "OAS Institute of Technology and Management, Group of Institutions", "Odaiyappa College of Engineering and Technology", "Oxford College of Engineering", "Oxford Engineering College", "P A College of Engineering and Technology", "P G P College of Engineering and Technology", "P.B. College of Engineering", "P.R. Engineering College", "P.S.G. College of Technology (Autonomous)", "P.S.R Engineering College (Autonomous)", "P.S.R. Rengasamy College of Engineering for Women", "P.S.V. College of Engineering and Technology", "P.T. Lee Chengalvaraya Naicker College of Engineering and Technology", "P.T.R. College of Engineering and Technology", "Paavai College of Engineering", "Paavai Engineering College (Autonomous)", "Pallava Raja College of Engineering", "Pallavan College of Engineering", "Pandian Saraswathi Yadav Engineering College", "Panimalar Engineering College", "Panimalar Institute of Technology", "Pannai College of Engineering and Technology", "Parisutham Institute of Technology and Science", "Park College of Engineering and Technology", "Park College of Technology", "Park Institute of Architecture", "Pavai College of Technology", "Pavendar Bharathidasan College of Engineering and Technology", "Pavendar Bharathidasan Institute of Information Technology", "PERI Institute of Technology", "PET Engineering College", "PMR Engineering College", "Podhigai College of Engineering and Technology", "Pollachi Institute of Engineering and Technology", "Ponjesly College of Engineering", "PPG Institute of Technology", "Prahar School of Architecture", "Prathyusha Engineering College", "Prime College of Architecture and Planning", "Prince Dr. K. Vasudevan College of Engineering and Technology", "Prince Shri Venkateshwara Padmavathy Engineering College", "Priyadarshini Engineering College", "Professional Group of Institutions", "PSG Institute of Technology and Applied Research", "PSN College of Engineering and Technology (Autonomous)", "PSN Engineering College", "PSN Institute of Technology and Science", "PSNA College of Engineering and Technology", "R V S College of Engineering and Technology", "R.M.D. Engineering College", "R.M.K. College of Engineering and Technology", "R.M.K. Engineering College", "R.V.S. College of Engineering", "R.V.S. Padhmavathy College of Engineering & Technology", "R.V.S. School of Architecture", "R.V.S. School of Architecture", "R.V.S. School of Engineering and Technology", "Raja College of Engineering and Technology", "Rajalakshmi Engineering College", "Rajalakshmi Institute of Technology", "Rajalakshmi School of Architecture", "Rajas Engineering College", "Rajas International Institute of Technology for Women", "Rajiv Gandhi College of Engineering", "Ramco Institute of Technology", "Ranganathan Architecture College", "Ranganathan Engineering College", "Ranippettai Engineering College", "Rathinam Technical Campus", "Renganayagi Varatharaj College of Engineering", "Roever College of Engineering and Technology", "Roever Engineering College", "Rohini College of Engineering and Technology", "RRASE College of Engineering", "RVS KVK School of Architecture", "RVS Padmavathy School of Architecture", "RVS Technical Campus – Coimbatore", "S N S College of Engineering", "S R S College of Engineering and Technology", "S V S College of Engineering", "S V S School of Architecture", "S.A. Engineering College", "S.K.P. Engineering College", "S.K.P. Institute of Technology", "S.K.R. Engineering College", "S.R.I College of Engineering and Technology", "S.S.M. College of Engineering", "S. Veerasamy Chettiar College of Engineering and Technology", "SACS M.A.V.M.M Engineering College", "Sakthi Mariamman Engineering College", "Salem College of Engineering and Technology", "Sams College of Engineering and Technology", "San Academy of Architecture", "Sapthagiri College of Engineering", "Saranathan College of Engineering", "Saraswathi Velu College of Engineering", "Saraswathy College of Engineering & Technology", "Sardar Raja College of Engineering", "Sasi Creative School of Architecture", "Sasurie Academy of Engineering", "Sasurie College of Engineering", "Satyam College of Engineering and Technology", "Saveetha Engineering College", "SBM College of Engineering and Technology", "SCAD College of Engineering and Technology", "SCAD Institute of Technology", "School of Architecture Coimbatore Institute of Engineering and Technology", "Selvam College of Technology", "Sembodai Rukmani Varatharajan Engineering College", "Sengunthar College of Engineering", "Sengunthar Engineering College", "Sethu Institute of Technology (Autonomous)", "Shanmuganathan Engineering College", "Shivani College of Engineering and Technology", "Shivani Engineering College", "Shree Sathyam College of Engineering and Technology", "Shree Venkateshwara Hi-Tech Engineering College", "Shreenivasa Engineering College", "Shri Andal Alagar College of Engineering", "Shri Angalamman College of Engineering and Technology", "Shri Sapthagiri Institute of Technology", "Sigma College of Architecture", "Sir Issac Newton College of Engineering and Technology", "Sivaji College of Engineering and Technology", "Skandha School of Architecture", "SMK Fomra Institute of Technology", "SMR East Coast College of Engineering and Technology", "SNS College of Technology (Autonomous)", "Sona College of Technology", "Sree Krishna College of Engineering", "Sree Sakthi Engineering College", "Sree Sastha College of Engineering", "Sree Sastha Institute of Engineering and Technology", "Sree Sowdambika College of Engineering", "SRG Engineering College", "Sri Aravindar Engineering College", "Sri Balaji Chockalingam Engineering College", "Sri Bharathi Engineering College for Women", "Sri Eshwar College of Engineering", "Sri Jayaram Institute of Engineering and Technology", "Sri Krishna College of Engineering", "Sri Krishna College of Engineering & Technology (Autonomous)", "Sri Krishna College of Technology (Autonomous)", "Sri Krishna Engineering College", "Sri Krishna Institute of Technology", "Sri Lakshmi Ammal Engineering College", "Sri Muthukumaran Institute of Technology", "Sri Nandhanam College of Engineering and Technology", "Sri Raaja Raajan College of Engineering and Technology", "Sri Ramakrishna College of Engineering", "Sri Ramakrishna Engineering College (Autonomous)", "Sri Ramakrishna Institute of Technology", "Sri Ramana Maharishi College of Engineering", "Sri Ramanathan Engineering College", "Sri Ramanujar Engineering College", "Sri Ranganathar Institute of Engineering & Technology", "Sri Rangapoopathi College of Engineering", "Sri Renugambal College of Architecture", "Sri Sai Ram Institute of Technology", "Sri Sairam Engineering College", "Sri Shakthi Institute of Engineering and Technology", "Sri Shanmugha College of Engineering and Technology", "Sri Sivasubramaniya Nadar College of Engineering", "Sri Subramanya College of Engineering and Technology", "Sri Venkateshwara Institute of Engineering", "Sri Venkateswara College of Engineering", "Sri Venkateswara College of Engineering and Technology", "Sri Venkateswara Institute of Science and Technology", "Sri Venkateswaraa College of Technology", "Sri Vidya College of Engineering & Technology", "Sriguru Institute of Technology", "Srinivasan Engineering College", "Sriram Engineering College", "SSM Institute of Engineering and Technology", "St. Anne's College of Engineering and Technology", "St. Joseph College of Engineering", "St. Joseph's College of Engineering and Technology", "St. Joseph's Institute of Technology", "St. Peter's College of Engineering and Technology", "St. Joseph's College of Engineering", "St. Michael College of Engineering & Technology", "St. Mother theresa Engineering College", "St. Xavier's Catholic College of Engineering", "Star Lion College of Engineering and Technology", "Stella Mary's College of Engineering", "Sudharsan Engineering College", "Suguna College of Engineering", "Sun College of Engineering and Technology", "Sureya College of Engineering", "Surya Engineering College", "Surya Group of Institutions", "Surya School of Architecture", "Syed Ammal Engineering College", "T.J. Institute of Technology", "T.J.S. Engineering College", "T.S.M. Jain College of Technology", "Tagore Engineering College", "Tagore Institute of Engineering and Technology", "Tamilnadu College of Engineering", "Tamilnadu School of Architecture", "Tamizhan College of Engineering and Technology", "Tejaa Shakthi Institute of Technology for Women", "Thamirabharani Engineering College", "Thangavelu Engineering College", "Thanthai Periyar Govt. Institute of Technology", "The Kavery College of Engineering", "The Kavery Engineering College", "Theni Kammavar Sangam College of Technology", "Thiagarajar College of Engineering (Autonomous)", "Thirumalai Engineering College", "Thiruvalluvar College of Engineering and Technology", "Trichy Engineering College", "TRP Engineering College", "Udaya School of Engineering", "Ultra College of Engineering and Technology for Women", "United Institute of Technology", "Universal College of Engineering & Technology", "University College of Engineering, Ariyalur", "University College of Engineering, Arni", "University College of Engineering, Dindigul", "University College of Engineering, Kanchipuram", "University College of Engineering, Nagercoil", "University College of Engineering, Panruti", "University College of Engineering, Pattukkottai", "University College of Engineering, Ramanathapuram", "University College of Engineering, Thirukkuvalai", "University College of Engineering, Tindivanam", "University College of Engineering, Tiruchirappalli", "University College of Engineering, Villupuram", "University Departments of Anna University, Chennai – ACT Campus", "University Departments of Anna University, Chennai – CEG Campus", "University Departments of Anna University, Chennai – MIT Campus", "University Departments of Anna University, Chennai – SAP Campus", "University VOC College of Engineering, Thoothukudi", "Unnamalai Institute of Technology", "V K S College of Engineering and Technology", "V S A Educational and Charitable Trust's Group of Institutions", "V V College of Engineering", "V.P.M.M. College of Architecture for Women", "V.P.Muthaiah Pillai Meenakshi Ammal Engineering College for Women", "V.R.S. College of Engineering and Technology", "V.S.B. College of Engineering Technical Campus", "V.S.B. Engineering College", "Vaigai College of Engineering", "Valliammai Engineering College", "Vandayar Engineering College", "Varuvan Vadivelan Institute of Technology", "Vedhantha Institute of Technology", "Veerammal Engineering College", "Vel Tech", "Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College", "Vel Tech Multi Tech Dr.Rangarajan Dr.Sakunthala Engineering College", "Velalar College of Engineering and Technology", "Velammal College of Engineering and Technology", "Velammal Engineering College", "Velammal Institute of Technology", "Vetri Vinayaha College of Engineering and Technology", "Vi Institute of Technology", "Vickram College of Engineering", "Vidhya Mandhir Institute of Technology", "Vidyaa Vikas College of Engineering and Technology", "Vins Christian College of Engineering", "Vins Christian Women's College of Engineering", "Vishnu Lakshmi College of Engineering and Technology", "Vivekanandha College of Engineering for Women (Autonomous)", "Vivekanandha College of Technology for Women", "Vivekanandha Institute of Engineering & Technology for Women", "VPV College of Engineering"];
	$( "#clg").autocomplete({
		source: colleges
	});
});

$(function() {
	var departments = ["Aeronautical Engineering", "Agriculture Engineering", "Apparel Technology", "Architecture", "Automobile Engineering", "Bio-Medical Engineering", "Bio-Technology", "Chemical Engineering", "Civil Engineering", "Computer Science and Engineering", "Ceramic Technology", "Electronics and Communication Engineering", "Electrical and Electronics Engineering", "Environmental Engineering", "Electronics and Instrumentation Engineering", "Food Technology", "Fashion Technology", "Geo-Informatics", "Handloom and Textile Technology", "Industrial Bio-Technology", "Instrumentation and Control Engineering", "Industrial Engineering", "Information Technology", "Leather Technology", "Material Science and Engineering", "Mechatronics", "Medical Electronics Engineering", "Mechanical Engineering", "Mining Engineering", "Manufacturing Engineering", "Marine Engineering", "Metallurgical Engineering", "Mechanical and Automation Engineering", "Nano Science and Technology", "Plastic Technology", "Petro Chemical Technology", "Petroleum Technology", "Pharmaceutical Technology", "Polymer Technology", "Production Engineering", "Printing Technology", "Robotics and Automation", "Rubber and Plastic Technology", "Textile Chemistry", "Textile Technology"];
	$( "#dept").autocomplete({
		source: departments
	});
});

$(function() {
	$("#regForm").validate({
		rules: {
			firstname: "required",
			lastname: "required",
			sex: "required",
			email: {
				required: true,
				email: true,
			},
			clg: "required",
			dept: "required",
			year: "required"
		},
		messages: {
			firstname: "*First Name is required",
			lastname: "*Last Name is required",
			sex: "*Required",
			email: "*Valid email is required",
			clg: "*College is required",
			dept: "*Branch of study is required",
			year: "*Year is required"
		},
		submitHandler: function(form) {	
			form.submit();
			var req = {};
			req.fname = $("#first_name").val();
			req.lname = $("#last_name").val();
			req.mobile = $("#mobile").attr('value');
			req.gender = $('input[name=sex]:checked').val();
			req.email = $("#email").val();
			req.clg = $("#clg").val();
			req.dept = $("#dept").val();
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
	});
});

