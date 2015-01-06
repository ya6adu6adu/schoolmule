var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.html = function(_options){

	var self = this;
	
	var defaults = {
		//onAppend: function(container){},
		onDrow: function(){},
		onGetTemplate: function(){},
		onGetDefaultData: function(){}
	};
	var options = $.extend(defaults, _options);
	
	var default_data = options.onGetDefaultData();//$.extend(true,{},onGetDefaultData());
	var template = options.onGetTemplate();
	
	var container = null;
	
	var setContent = function(new_data){ 
		var html = $(_.template(template,new_data));
		$(html).find('select').change(function () {
			$(this).parent().find('span').text($('option:selected',this).val());
			
        });
		container.empty().append(html);
	}
	
	this.setValues = function(values){
		var inputs = $(":input",container);
		inputs.each(function(){
			for(key in values){
				if($(this).attr('id')==key){
					$('option:contains('+values[key]+')',this).attr('selected', 'selected');
					$(this).change();
				}
			}
		});
	}
	
	this.getValues = function(){
		var values = {};
		var inputs = $(":input",container);
		inputs.each(function(){
			values[$(this).attr('id')] = $('option:selected',this).val();//$(this).parent().find('span').text();
			
		});
	}
	
	this.attachTo = function(id,data){
		container = $('#'+id);
		var new_data; 
		if(data){
			new_data = $.extend(true, {}, default_data, data);
		} else {
			new_data = default_data;
		}
		setContent(new_data);
		options.onDrow.call(self);
	}
}
