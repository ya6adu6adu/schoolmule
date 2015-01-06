(function(){


// config options
scheduler.xy.nav_height = 0; // header height is set to 0 (as it is not displayed either way)
scheduler.xy.menu_width = 0;
scheduler.config.details_on_create = false;
scheduler.config.details_on_dblclick = false;
scheduler.config.scroll_hour = 8;
scheduler.config.drag_create = true;
scheduler.config.drag_move = true;
scheduler.config.drag_resize = true;
scheduler.config.time_step = 5;
scheduler.config.hour_size_px = 72;
scheduler.config.event_duration = 40;

// menu config options
scheduler.config.menu_links = { // id: link
	"go_courceroom": "http://bing.com",
	"set_attendance": "http://google.com"
};
scheduler.config.menu_disabled_items = []; // list of ids which should be blocked

scheduler.config.display_absence_section = true;


scheduler.attachEvent("onClick", function(event_id) {
	if (scheduler._selected_id && event_id != scheduler._selected_id) { // if there is already selected event we need to remove selection
		var prev_selected = scheduler._selected_id;
		scheduler._selected_id = null;
		scheduler.updateEvent(prev_selected);
	}
	if (event_id && event_id != scheduler._selected_id) {
		scheduler._selected_id = event_id; // setting up select id
		scheduler.updateEvent(event_id);
	}
	return true;
});
scheduler.templates.event_class = function(start_date, end_date, ev) {
	if (ev.id == scheduler._selected_id) // if it's selected event -> assign special CSS class
		return "dhx_selected_event";
	return "";	
};
scheduler.attachEvent("onViewChange", function (mode, date){
	scheduler._selected_id = null; // clearing select id when view was changed
});

// adding week number to week start section on Month View
var getWeekNumber = scheduler.date.date_to_str("%W");
scheduler.templates.month_day = function(day) {
	var week_start = (scheduler.config.start_on_monday)?1:0;
	if (day.getDay() == week_start && scheduler._mode == "month") {
		return "<span class='dhx_week_number'>Week "+getWeekNumber(day)+"</span>"+day.getDate();
	}
	return day.getDate(); // default option
}

// we should not display absence events in scheduler
scheduler.filter_day = scheduler.filter_week = scheduler.filter_month = scheduler.filter_year = function(id, event) {
	if (id.toString().match(/_a/))
		return false; // there is '_a' part in id -> absence event
	return true; // will be displayed, default	
};

scheduler.absence_types = scheduler.serverList("absence_types");
// adding absence time section in the event text
scheduler.templates.event_text = function(start, end, event) {
	var mode = scheduler._mode;
	html = event.text; // default one

	if ( event._is_timetable && scheduler.config.display_absence_section && (mode == "day" || mode == "week") ) {
		var holder = scheduler.locate_holder(event._sday);	

		var total_width=Math.floor(holder.clientWidth/event._count);
		if (!event._inner) total_width=total_width*(event._count-event._sorder);
		total_width -= 4;

		var minutes = Math.floor((end - start)/60000);
		var pixels_in_minute = total_width/minutes;

		html += "<div class='dhx_absence_time' style='width: "+total_width+"px;'>";

		var absence_events = [];
		var evs = scheduler.getEvents(start,end); // get events which are occuring at the same time
		
		// now need to filter actual absence events for rendered event
		for (var i = evs.length - 1; i >= 0; i--) {
			var t_ev = evs[i];
			if (t_ev.parent_event == event.id) {
				absence_events.push(t_ev);
			}
		};

		for (var i = absence_events.length - 1; i >= 0; i--) {
			t_ae = absence_events[i];
			var minutes_from_start = Math.floor((t_ae.start_date - start)/60000);
			var left = Math.floor(minutes_from_start * pixels_in_minute) + 7; // event left border + padding + absence time left border
			var duration = Math.floor((t_ae.end_date - t_ae.start_date)/60000);
			var width = Math.ceil(duration * pixels_in_minute);
			var color = scheduler.getOption(scheduler.absence_types, t_ae.absence_type).label;
			html += "<div class='dhx_absence_section' style='left: "+left+"px; width: "+width+"px; background-color: "+color+";'></div>";
		};

		html += "</div>";		
	}

	return html;
}

// customization
scheduler.attachEvent("onTemplatesReady", function(){
	$("#second-menu").find("li").each(function(index, el){
		el = $(el);
		var date = scheduler.getState().date;
		var text = el.text().toLowerCase();
		if (text == "event") {
			el.click(function(){
				window.open('calendar-add-event.html', '_self');
			})
		}
		else if (text == "schedule assistant") {
			el.click(function(){
				window.open('calendar-schedule-assistant.html', '_self');
			})
		}
		else {
			el.click(function(){
				scheduler.setCurrentView(date, text);
			})
		}
	});	
	// scheduler should be refreshed if we are hiding/displaying left section
	$("#hide-navigation").click(function(){
		scheduler.setCurrentView();	
	});
	// minicalendar should be displayed when we are clicking calendar icon
	$("#dhx_cal_navigation").click(function(){
		if (scheduler.isCalendarVisible()) {
			scheduler.destroyCalendar();
		}
		else {
			scheduler.renderCalendar({
				position: "dhx_cal_navigation",
				date: scheduler._date,
				navigation: true,
				handler: function(date,calendar){
					scheduler.setCurrentView(date);
					scheduler.destroyCalendar()
				}
			});				
		}
	});

	// adding menu icon to event header
	var old_event_header = scheduler.templates.event_header;
	scheduler.templates.event_header = function(start_date, end_date, ev){
		var header = "<span class='dhx_title_time'>"+old_event_header(start_date, end_date, ev)+"</span>";
		return header + "<div class='dhx_event_menu_arrow'></div>";	
	};

	var menu = new dhtmlXMenuObject();
	menu.zIndInit = 10002;
	menu.setIconsPath("../../dhtmlx/imgs/dhxmenu_dhx_schoolmule/");
	menu.renderAsContextMenu();
	menu.loadXML("../../dhtmlx/sheduler/xml/event_menu.xml?e="+new Date().getTime(), function(){
		for(var i=0; i<scheduler.config.menu_disabled_items.length; i++) {
			menu.setItemDisabled(scheduler.config.menu_disabled_items[i]);
		}		
	});
	menu.attachEvent("onClick", function(id){
		var ev = scheduler.getEvent(scheduler._selected_id);
		switch(id) {
			case "set_type_task":
			case "set_type_meeting":
				ev._is_timetable = false;
				scheduler.updateEvent(scheduler._selected_id);
				menu.setItemDisabled("set_attendance");
				menu.setItemDisabled("go_courceroom");
				break;
			case "set_type_timetable":
				ev._is_timetable = true;
				scheduler.updateEvent(scheduler._selected_id);
				menu.setItemEnabled("set_attendance");
				menu.setItemEnabled("go_courceroom");
				break;
			case "delete_event":
				var c=scheduler.locale.labels.confirm_deleting; 
				if (!c||confirm(c)) {
					scheduler.deleteEvent(scheduler._selected_id);
					scheduler._selected_id = null;		
					if (scheduler._lightbox_id) {
						scheduler.cancel_lightbox();
					}			
				}
				break;
			default: 
				window.open(scheduler.config.menu_links[id]+"?event_id="+scheduler._selected_id);
		}
	});
	$(document).delegate('.dhx_event_menu_arrow', 'click', function(e){
		e.stopPropagation();
		menu.showContextMenu(e.pageX-1, e.pageY-1);
	})


	// making navigation buttons work
	var prev_period = $(".dhx_cal_prev_button")[0];
	prev_period.onclick = function() {
		scheduler.setCurrentView(
			scheduler.date.add(scheduler.date[scheduler._mode+"_start"](scheduler._date),-1,scheduler._mode)
		);
	}
	var next_period = $(".dhx_cal_next_button")[0];
	next_period.onclick = function() {
		scheduler.setCurrentView(
			scheduler.date.add(scheduler.date[scheduler._mode+"_start"](scheduler._date),1,scheduler._mode)
		);
	}
	var current_period = $(".dhx_cal_today_button")[0];
	current_period.onclick = function() {
		scheduler.setCurrentView(new Date());
	}	


	var date_picker_callback = function(arg) {
		scheduler.setCurrentView(arg.date);
	}
	var date_picker_opts = {
		formElements:{"dhx_cal_date_picker":"d-sl-m-sl-Y"},
		showWeeks:true,
		statusFormat:"l-cc-sp-d-sp-F-sp-Y",
		// The function "showEnglishDate" is declared below
		callbackFunctions:{"dateset":[date_picker_callback]}
	};
	datePickerController.createDatePicker(date_picker_opts);

});

dhtmlxEvent(document,(_isOpera?"keypress":"keydown"),function(e){
	e=e||event;
	if ( (e.keyCode == 8 || e.keyCode == 46) && scheduler._selected_id && (scheduler._selected_id != scheduler._edit_id) ) { // delete or backspace
		e.cancelBubble = true;
		var c=scheduler.locale.labels.confirm_deleting; 
		if ( !c || confirm(c) ) {
			scheduler.deleteEvent(scheduler._selected_id);	
		} 
	}
});

// helper function
scheduler.getOption = function(options, id) {
	if (!options || !id)
		return false;
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		if(options[i].key == id)
			return option;
	}
	return false;
};

scheduler.attachEvent("onEventLoading", function(event_object){
	event_object._is_timetable = true;
	return true;
});



}());