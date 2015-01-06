var cnt = 0; // count of dynamically added color fields
var he = true; // hide Details box flag
var hs = true; // hide submissions box flag
var row = null; // additional data for dialog events

function setInputFocus(id, initColor, focusColor, value) {
	$(id).css("color",initColor);
	$(id).attr("value",value);
	$(id).focus(function () {
		if (!$(id).hasClass("was-focused")) {
			$(this).attr("value","");
			$(this).css("color",focusColor);
			$(id).addClass("was-focused");
		}
	});		
}

function mainContentFullScreen() {
	if (he) {
		document.getElementById("navigation").style.display="none";
		document.getElementById("second-menu").style.display="none";
		document.getElementById("first-menu").style.display="none";
		document.getElementById("header").style.display="none";
		document.getElementById("hide-navigation").src="../../images/expand.png";
		document.getElementById("main-content").style.left="16px";
		document.getElementById("main-content").style.top="6px";
	}
	else {
		document.getElementById("navigation").style.display="block";
		document.getElementById("second-menu").style.display="block";
		document.getElementById("first-menu").style.display="block";
		document.getElementById("header").style.display="block";
		document.getElementById("hide-navigation").src="../../images/collapse.png";
		document.getElementById("main-content").style.left="324px";
		document.getElementById("main-content").style.top="93px";
	}
	he = !he;
	resizeMainBoxBody();
	resizeTiny();
	resizeGrid();
}

function initHideButton() {
	$('#hide-navigation').click(function () {
		mainContentFullScreen();
	});
	$(document).keyup(function(e) {
	  if (e.keyCode == 27) {
		mainContentFullScreen();
	  }
	});
}

function initHideSubmissions() {
	$('#hide-sbm-img').click(function () {
		hideSubmissions();
	});
}

// Hides or shows Details box
function hideSubmissions() {
	if (hs) {
		document.getElementById("sbm-box").style.display="none";
		document.getElementById("sbm-grid-wrap").style.width="100%";
		document.getElementById("hide-sbm-img").src="../../images/collapse.png";
		resizeGrid();
	}
	else {
		document.getElementById("sbm-box").style.display="block";
		document.getElementById("sbm-grid-wrap").style.width="70%";
		document.getElementById("hide-sbm-img").src="../../images/expand.png";
		resizeGrid();
	}
	hs = !hs;
	console.log(hs);
}

// Hides or shows Details box
function hideElement() {
	if (he) {
		document.getElementById("details").style.display="none";
		document.getElementById("hide-details").src="../../images/collapse.png";
		document.getElementById("overview").style.right="16px";
	}
	else {
		document.getElementById("details").style.display="block";
		document.getElementById("hide-details").src="../../images/expand.png";
		document.getElementById("overview").style.right="324px";
	}
	he = !he;
}

// Hides or shows accordion box
function hideNavigation() {
	if (he) {
		document.getElementById("navigation").style.display="none";
		document.getElementById("hide-navigation").src="../../images/expand.png";
		document.getElementById("main-content").style.left="16px";
	}
	else {
		document.getElementById("navigation").style.display="block";
		document.getElementById("hide-navigation").src="../../images/collapse.png";
		document.getElementById("main-content").style.left="324px";
	}
	he = !he;
	resizeTiny();
}

function menu1click(x) {
	var e=document.getElementById("left-tab");
	e.innerHTML=x.innerHTML;
	var w=x.offsetWidth;
	var s=new String();
	s=6+w+'px solid #8B9BA8';
	e.parentNode.style.borderLeft=s;
	s=-w+10+"px";
	e.style.left=s;
}

function menu2click(x) {
	var i;
	var items=document.getElementById("second-menu").childNodes[1].childNodes;
	for (i in items) items[i].className="item-inactive";
	x.className="item-active";
}

function menu3click(x) {
	var i;
	var e = document.getElementById("overview-tabs");
	if (!e) e = document.getElementById("details-tabs");
	var items = e.childNodes[1].childNodes;
	for (i in items) {
		if ((items[i].nodeName == "LI")&&(items[i].className != "divider")) {
		if (items[i].childNodes[0].nodeName == "A")
			items[i].childNodes[0].className="tab tab-inactive";
		}
	}
	x.className="tab tab-active";
}

function addField(x) {
	var clone = x.cloneNode(true);
	clone.childNodes[1].childNodes[1].innerHTML = '';
	clone.childNodes[1].childNodes[3].value = '';
	var e = $('<span class="pointer minus" title="delete"></span>').click({row: clone}, function(event){
			row = event.data.row;
			$('#delete-row-dialog').dialog('open');
			$('#delete-row-dialog').css('min-height', '20px');
			return false;
		});
	$(clone.childNodes[1].childNodes[3]).after(e);
	x.parentNode.appendChild(clone); // add new field to DOM
}

function deleteField(x) {
	x.parentNode.removeChild(x);
}

function addDual(x) {
	var clone = x.cloneNode(true);
	clone.childNodes[1].childNodes[1].innerHTML = '';
	clone.childNodes[1].childNodes[3].value = '';
	clone.childNodes[3].childNodes[1].innerHTML = '';
	clone.childNodes[3].childNodes[3].value = '';
	var e = $('<span class="pointer minus" title="delete"></span>').click({row: clone}, function(event){
			row = event.data.row;
			$('#delete-row-dialog').dialog('open');
			$('#delete-row-dialog').css('min-height', '20px');
			return false;
		});
	$(clone.childNodes[3].childNodes[3]).after(e);
	x.parentNode.appendChild(clone); // add new field to DOM
}

function addAbsenceReason(x) {
	var clone = x.cloneNode(true);
	clone.childNodes[1].childNodes[1].innerHTML = '';
	clone.childNodes[1].childNodes[3].value = '';
	clone.childNodes[3].childNodes[1].innerHTML = '';
	clone.childNodes[3].childNodes[3].value = '';
	clone.childNodes[3].childNodes[3].style.backgroundColor = '#f7f7f7';
	var e = $('<span class="pointer minus" title="delete"></span>').click({row: clone}, function(event){
			row = event.data.row;
			$('#delete-row-dialog').dialog('open');
			$('#delete-row-dialog').css('min-height', '20px');
			return false;
		});
	$(clone.childNodes[3].childNodes[3]).after(e);
	cnt++;
	clone.childNodes[3].childNodes[3].setAttribute('id', 'name'+cnt);
	//clone.childNodes[3].childNodes[3].setAttribute('name', 'name'+cnt);
	x.parentNode.appendChild(clone); // add new field to DOM
	new jscolor.color(document.getElementById('name'+cnt), {});
}

function addSelect(x) {
	var clone = x.cloneNode(true);
	clone.childNodes[1].childNodes[1].innerHTML = '';
	// ������ name ������� � id ����� (span id = 'select' + name �������)
	clone.childNodes[1].childNodes[3].childNodes[2].setAttribute('name', 'newselect');
	clone.childNodes[1].childNodes[3].childNodes[1].id = 'selectnewselect';
	var e = $('<span class="pointer minus" title="delete"></span>').click({row: clone}, function(event){
			row = event.data.row;
			$('#delete-row-dialog').dialog('open');
			$('#delete-row-dialog').css('min-height', '20px');
			return false;
		});
	$(clone).find('select').after(e);
	x.parentNode.appendChild(clone); // add new field to DOM
}

function setLeftTab(index) {
	var e=document.getElementById("left-tab");
	if (e != null) {
		var x=document.getElementById("first-menu").childNodes[index]; // Change index to select other menu item
		e.innerHTML=x.innerHTML;
		var w=x.offsetWidth;
		var s=new String();
		s=6+w+'px solid #8B9BA8';
		e.parentNode.style.borderLeft=s;
		s=-w+10+"px";
		e.style.left=s;
	}
}

document.write('<style type="text/css">select.styled { position: relative; opacity: 0; filter: alpha(opacity=0); z-index: 5; } </style>');

var Custom = {
	init: function() {
		var inputs = document.getElementsByTagName("select"), span = Array(), textnode, option, active;
		for(a = 0; a < inputs.length; a++) {
			if(inputs[a].className == "styled") {
				option = inputs[a].getElementsByTagName("option");
				active = option[0].childNodes[0].nodeValue;
				textnode = document.createTextNode(active);
				for(b = 0; b < option.length; b++) {
					if(option[b].selected == true) {
						textnode = document.createTextNode(option[b].childNodes[0].nodeValue);
					}
				}
				span[a] = document.createElement("span");
				span[a].className = "select";
				span[a].style.width = inputs[a].offsetWidth - 23 + "px";
				span[a].id = "select" + inputs[a].name;
				span[a].appendChild(textnode);
				inputs[a].parentNode.insertBefore(span[a], inputs[a]);
				if(!inputs[a].getAttribute("disabled")) {
					inputs[a].onchange = Custom.choose;
				} else {
					inputs[a].previousSibling.className = inputs[a].previousSibling.className += " disabled";
				}
			}
		}
		// this code is for Attendance grid selects init coloring
		for(a = 0; a < inputs.length; a++) {
			if(inputs[a].name.slice(0,6) == "reason") {
				var spanId = 'selectselect'+inputs[a].name.slice(6,10);
				if ( inputs[a].selectedIndex != -1)
				{
					if (inputs[a].options[inputs[a].selectedIndex].value == "Green") {
						document.getElementById(spanId).style.backgroundColor = '#84e48b';
					}
					if (inputs[a].options[inputs[a].selectedIndex].value == "Yellow") {
						document.getElementById(spanId).style.backgroundColor = '#ffee7b';
					}
					if (inputs[a].options[inputs[a].selectedIndex].value == "Red") {
						document.getElementById(spanId).style.backgroundColor = '#ff8484';
					}
				}
			}
		}
		// end of Attendance grid selects init coloring
	},
	treegridInit: function() {
		var tds = $('td:has(select)');
		for(c = 0; c < tds.length; c++) {
			if ($(tds[c]).children('span').length > 0) continue;
			else {
				var inputs = $(tds[c]).children('select'), span = Array(), textnode, option, active;
				for(a = 0; a < inputs.length; a++) {
					if(inputs[a].className == "styled") {
						option = inputs[a].getElementsByTagName("option");
						active = option[0].childNodes[0].nodeValue;
						textnode = document.createTextNode(active);
						for(b = 0; b < option.length; b++) {
							if(option[b].selected == true) {
								textnode = document.createTextNode(option[b].childNodes[0].nodeValue);
							}
						}
						span[a] = document.createElement("span");
						span[a].className = "select";
						span[a].style.width = inputs[a].offsetWidth - 23 + "px";
						span[a].id = "select" + inputs[a].name;
						span[a].appendChild(textnode);
						inputs[a].parentNode.insertBefore(span[a], inputs[a]);
						if(!inputs[a].getAttribute("disabled")) {
							inputs[a].onchange = Custom.choose;
						} else {
							inputs[a].previousSibling.className = inputs[a].previousSibling.className += " disabled";
						}
					}
				}
			}
		}						
	},
	choose: function() {
		option = this.getElementsByTagName("option");
		for(d = 0; d < option.length; d++) {
			if(option[d].selected == true) {
				document.getElementById("select" + this.name).childNodes[0].nodeValue = option[d].childNodes[0].nodeValue;
				// this code is for Attendance grid selects coloring
				if(this.name.slice(0,6) == "reason") {
					var spanId = 'selectselect'+this.name.slice(6,10);
					switch(d)
					{
					case 0:
					  document.getElementById(spanId).style.backgroundColor = '#84e48b';
					  break;
					case 1:
					  document.getElementById(spanId).style.backgroundColor = '#ffee7b';
					  break;
					case 2:
					  document.getElementById(spanId).style.backgroundColor = '#ff8484';
					  break;
					}
				}
				// end of Attendance grid selects coloring
			}
		}
		if (this.name.slice(0, 6) == "gr-sel") fillGrades();
	}
}

window.onload = Custom.init;