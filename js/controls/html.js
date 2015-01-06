var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.html = function(_options){

	var self = this;
	
	var defaults = {
		//onAppend: function(container){},
		onDraw: function(){},
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
            if(options.standart_process){
                $(this).parent().find('span').text($('option:selected',this).val());
            }
        });
		container.empty().append(html);
	}

	this.setContent = function(new_data){ 
		var html = $(_.template(template,new_data));
		$(html).find('select').change(function () {
            if($('option:selected',this).val()){
                if(options.standart_process){
                    $(this).parent().find('span').text($('option:selected',this).val());
                }
            }
        });
		container.empty().append(html);
	}
	
	this.setValues = function(values){
		var inputs = $(":input",container)
		.each(function(){
			for(key in values){
				if($(this).attr('id')==key){
					$('option:contains('+values[key]+')',this).attr('selected', 'selected');
					$(this).change();
				}
			}
		});
		var divs = $("div > div > div",container)
		.each(function(){
			for(key in values){
				if($(this).attr('id')==key){
					$(this).find('span').text(values[key]);
				}
			}
		});

        if(values.photo){
            $("#photo img",container).attr('src',values.photo);
        }
	}
	
	this.getValues = function(){
		var values = {};
		var inputs = $(":input",container);
		inputs.each(function(){
			values[$(this).attr('id')] = $('option:selected',this).val();//$(this).parent().find('span').text();
		});
	}
	
	this.attachTo = function(id,data,values){
		container = $('#'+id);
		var new_data; 
		if(data){
			new_data = $.extend(true, {}, default_data, data);
		} else {
			new_data = default_data;
		}
		
		if(values){
			setContent(new_data);
		}
		
		this.setValues(values);
		options.onDraw.call(self);
	}
}
