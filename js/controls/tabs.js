var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.tabs = function(_options){
	var self = this;
	var defaults = {
		container:"",
		tabs: [],
		tabs_left:[],
		width: "125px"
	};
	
	var default_tab = {
		id:'default', 
		callback: function(){
			alert('default');
		}, 
		label:'default',
		select: false
	}

	this.checkTinyContent = null;
	
	var container = null;
	
	var options = $.extend(defaults, _options);

    this.curtab = null;
	
	function init(){
		if(options.container){
			self.attachTo(options.container);
		}
	}
	 
	var selectTab = function(id){
        self.curtab = id;
        Hash.add('tab',id);
		$('li.item-active',container).removeClass("item-active")
		.addClass("item-inactive");
		$('#'+id).removeClass("item-inactive")
		.addClass("item-active");
	}

    this.selectTab = function(id){
        self.curtab = id;
        Hash.add('tab',id);
    };

	
	this.checkContent = function(checkTinyContent){
		if(checkTinyContent===true){
			return false;
		}
		var tiny;
		for(p in checkTinyContent){
			tiny = checkTinyContent[p][0];
			if(checkTinyContent[p][1]==null){
				checkTinyContent[p][1]="";
			}
			var ttt= tiny.getContent();
			if(checkTinyContent[p][1]!=tiny.getContent()){
				return true
			}
		}
		return false;
	}
		
	var createTabbar = function(){
		if(options.tabs_left){
			/*var left = $('\
			<div id="left-tab" ">\
				<a href="" class="fm-active">'+options.tabs_left.label+'</a>\
			</div>');
			container.append(left);*/
			$("#second-menu").css("border-left",options.width+" solid #8B9BA8");
			//var ttt = 125-parseInt(options.width)-108;
			//$("#left-tab").css("left",ttt+'px');
		}
		
		var ul = $('<ul></ul>');
		for(var i=0; i < options.tabs.length; i++){
			(function(i){
				var li = $('\
				<li id="'+container.attr('id')+'_'+options.tabs[i].id+'" class="item-inactive" >\
					<div class="second-menu-bord"></div><div class="second-menu-ang"></div><div class="second-menu-block"><a>'+options.tabs[i].label+'</a></div>\
				</li>')
				.click(function(){
						if(window.save_notification){
                            if(window.tinyContent && window.tinyContent.getType() && window.tinyContent.getType()=="assignment"){
                            var cont = $('<div id="dialog-confirm" title="">\
                                <p>'+dlang("save_dialog_text_tabbar","Do you want to save draft or save and also publish to pupils?")+'</p></div>');
                            $('body').append(cont);

                            cont.dialog({
                                autoOpen: true,
                                modal: true,
                                width: 400,
                                minHeight: 120,
                                resizable: false,
                                buttons: [
                                    {
                                        text: dlang("save_dialog_btn","Save"),
                                        click: function() {
                                            cont.dialog( "destroy" );
                                            cont.remove();
                                            window.save_notification = false;
                                            $('#save').click();
                                            return true;
                                        }
                                    },
                                    {
                                        text: dlang("savep_dialog_btn","Save and publish"),
                                        click: function() {
                                            cont.dialog( "destroy" );
                                            cont.remove();
                                            window.save_notification = false;
                                            window.no_publish_confirm = true;
                                            $('#save_publish').click();
                                            return false;
                                        }
                                    },
                                    {
                                        text: dlang("disc_dialog_btn","Discard"),
                                        click: function() {
                                            cont.dialog( "destroy" );
                                            cont.remove();
                                            window.save_notification = false;
                                            self.checkTinyContent = null;
                                            selectTab(container.attr('id')+"_"+options.tabs[i].id);
                                            options.tabs[i].callback();
                                            return false;
                                        }
                                    }
                                ],
                                beforeClose: function( event, ui ) {
                                    cont.dialog("destroy");
                                    cont.remove();
                                    window.save_notification = false;
                                    self.checkTinyContent = null;
                                    selectTab(container.attr('id')+"_"+options.tabs[i].id);
                                    options.tabs[i].callback();
                                }
                            });
                            }
						}else{
							selectTab(container.attr('id')+"_"+options.tabs[i].id);
							options.tabs[i].callback();
						}
				});
				
				li.appendTo(ul);
			})(i);
		};
		container.append(ul);
		
		for(var i=0; i < options.tabs.length; i++){
			if(options.tabs[i].select == true){
				$('#'+container.attr('id')+'_'+options.tabs[i].id).trigger('click'); 
			}
		}
	}

	this.setActiveTab = function(id){
		$('#'+id).trigger('click');
	}
	
	this.attachTo = function(id){
		container = $('#'+id);
		createTabbar();
	}

    this.bindMenuEvents = function(id, array){
        var i;
        if(id){
            for(i = 0;i < array.length; i++){
                if(array[i].hasOwnProperty('callback')){
                    $("#"+id+"_"+array[i]['id']).click(array[i]['callback'])
                }
            }
        }
    }
	
	init();
}
