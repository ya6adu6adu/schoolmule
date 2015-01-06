var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.window_popup = function(_options){
	var self = this;
	var dialog;

	var defaults = {
		sub_title : " ",
		onBeforeShow : function(){},
		title: "Dialog window",
		autoOpen: false,
		modal: true,
		width: 360,
		resizable: false
	};
	
	this.dstate = null;

    //schoolmule.instances.grid_assignments.dialog_state = null;
	this.win_dialog = null;
	
	this.storage = {
						tree : "",
						callback: ""
				   };
	
	var options = $.extend(defaults,_options);

	function createWindowHtml(id){
		var title=null;
		
		if(options.sub_title){
			title = '\
				<div class="dialog-content-title">'+options.sub_title+'</div>\
				<div class="add-box"></div>';
		}
		
		var html = title?'<div class="dialog_class" id="'+id+'">'+title+'</div>':'<div class="dialog_class" id="'+id+'"></div>';
		
		$('body').append(html);
		return $('#'+id);
	}
	
	this.show =function (settings){
		var time = new Date().getTime();
		var id = 'window-dialog'+time;
		self.id = id;

		win_dialog = createWindowHtml(id);
		win_dialog.dialog({
			title: options.title,
			autoOpen: options.autoOpen,
			modal: options.modal,
			width: options.width,
			resizable: options.resizable,
			buttons: options.buttons,
			self : self,
			beforeClose: function( event, ui ) {
                if(schoolmule.instances.grid_assignments){
                    schoolmule.instances.grid_assignments.dialog_state = false;
                }
                self.win_dialog.dialog( "destroy" );
                self.win_dialog.remove();
			}
		});
		
		self.win_dialog = win_dialog;
		
		$(".add-box").attr('id',settings.container+time);
		options.onBeforeShow(settings.container+time,settings,self,options.connector);
		win_dialog.dialog('open');
	}
	
	this.hide = function(){
        if(schoolmule.instances.grid_assignments){
            schoolmule.instances.grid_assignments.dialog_state = false;
        }
		self.win_dialog.dialog( "destroy" );
		self.win_dialog.remove();
		this.storage.tree = null;
		this.storage.callback = null;
	}
			
	function init(){
	};	
	init();
};
