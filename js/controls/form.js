var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.form = function(_options){
	var self = this;
	
	var defaults = {
		id: "my_id",
		connector : "connectors/connector.php",
		gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
		menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
		lng:"en,de"
	};
	var options = $.extend(defaults, _options);
	var dhx = {
		form: null,
		dp: null
	};
	var container = null;
	var content = null;
	var dialog;
	var myDataProcessor;
	var curr_popup_data = null;
	this.current_user = 1;
	//AnchorDialog

	this.initForm = function(container){
		var config = options.setFormConfig();
		dhx.dp = new dataProcessor(options.connector+'?control_id='+options.id);		
		dhx.form = new dhtmlXForm(container,config);
		dhx.form.setSkin('dhx_web');	
		dhx.form.load(options.connector+'?id='+this.current_user+'&control_id='+options.id);
		dhx.form.attachEvent("onBeforeSave", function (id, values){
		    content.showLoader();
			return true;
		});
		dhx.form.attachEvent("onAfterSave", function (id, values){
		 	content.hideLoader();
		});
		
		dhx.dp.init(dhx.form);
	}

	this.saveData = function (cont){
		content = cont;
		if(options.saveForm){
			options.saveForm();
		}else{
			dhx.form.save();	
		}
	}
	
	this.refresh = function(){
	}
	
	this.refreshExpand = function(){
	}
	
	this.getForm = function(){
		return {grid:dhx.form,dp:myDataProcessor};
	}
	
	this.attachTo = function(id){
		options.container = id;
		this.initForm(id);
	};
}