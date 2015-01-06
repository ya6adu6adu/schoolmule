var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.scheduler = function(container,_options){
	var self = this;
	
	var defaults = {
		// an array of objects
		
	};
	
	var options = $.extend(defaults,_options);

	function createSchedulerHtml(){
		var html='\
			<div id="' +container+'" class="dhx_cal_container" style="width:100%; height:100%;">\
				<div class="dhx_cal_navline">\
					<div class="dhx_cal_prev_button">&nbsp;</div>\
					<div class="dhx_cal_next_button">&nbsp;</div>\
					<div class="dhx_cal_today_button"></div>\
					<div class="dhx_cal_date"></div>\
					<div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div>\
					<div class="dhx_cal_tab" name="week_tab" style="right:140px;"></div>\
					<div class="dhx_cal_tab" name="month_tab" style="right:76px;"></div>\
				</div>\
				<div class="dhx_cal_header">\
				</div>\
				<div class="dhx_cal_data">\
				</div>\
			</div>';
		$('#'+container).append(html);
	}
			
	function init(){
		createSchedulerHtml();
		scheduler.init(container,null,"week");
		scheduler.load(options.events);
	};
	
	init();
};