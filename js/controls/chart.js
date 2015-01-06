var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.chart = function(_options){
	var self = this;
	var chart;
	var defaults = {
		load:function(chart){}
		// an array of objects
	};
	var container = null;
	
	var options = $.extend(defaults,_options);

	function init(){
	}

	this.setData = function(data, format){
        console.log(data);
		chart.parse(data,format);
        /*
		$("#"+options.settings.container+"_main .dhx_canvas_text.dhx_axis_item_y").each(function (i) {
			switch(i){
				case 0: 
					var top = parseInt($(this).css("top")); 
					var next = parseInt($(this).next().css("top"));
					var raxn = parseInt((top-next)/4);
					$(this).css("top",(top-raxn-20)+'px');
					$(this).css("height",'35px');
					break;
				case 1: 
					var top = parseInt($(this).css("top")); 
					var next = parseInt($(this).next().css("top"));
					var raxn = parseInt((top-next)/4);
					$(this).css("top",(top+raxn)+'px');
					break;
				default:
					var top = parseInt($(this).css("top")); 
					$(this).css("top",(top+10)+'px');
			}
		})
		*/

	}
	
	this.refresh = function(){
		$('#'+options.settings.container).parent().css('width',options.width);
		$('#'+options.settings.container).parent().css('height',options.height);
		chart.refresh();
        /*
		$("#"+options.settings.container+"_main .dhx_canvas_text.dhx_axis_item_y").each(function (i) {
			switch(i){
				case 0: 
					var top = parseInt($(this).css("top")); 
					var next = parseInt($(this).next().css("top"));
					var raxn = parseInt((top-next)/4);
					$(this).css("top",(top-raxn-5)+'px');
					$(this).css("height",'35px');
					break;
				case 1: 
					var top = parseInt($(this).css("top")); 
					var next = parseInt($(this).next().css("top"));
					var raxn = parseInt((top-next)/4);
					$(this).css("top",(top+raxn)+'px');
					break;
				default:
					var top = parseInt($(this).css("top")); 
					$(this).css("top",(top+10)+'px');
			}
		})
		*/

	}
		
	this.appendTo = function(cont,maxday){
		options.settings.container = cont;
        options.settings.xAxis.units.end = maxday;
		chart =  new dhtmlXChart(options.settings);
		options.load(chart);
	}

	init();
};