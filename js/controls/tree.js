var schoolmule = window.schoolmule || {};
schoolmule.controls = schoolmule.controls || {};
schoolmule.instances = schoolmule.instances || {};

schoolmule.controls.tree = function(_options) {
	var self = this;

	var defaults = {
		control_id : "",
		connector : "connectors/connector.php",
		drag_mode : "",
		drag_condition : function(id, tree, treeObj) {
			return true;
		},
		drop_condition : function(id, tree, id_dst, tree_dst) {
			return true;
		},
		select : function(id, tree) {
		},
		load : function(tree) {
		},
		checkMenu : function(id) {
			return true;
		},
        onEditStart : function(){
            return true
        },
        oncheck : function(){
            return true
        },
		select_mode : false,
		multiselect : false,
		editable : false,
		treeImagePath : "dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/",
		menuIconsPath : "dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_schoolmule/",
		popup : null,
		autoLoading : false,
        checkboxes:false
	};
	var options = $.extend(defaults, _options);
	var dhx = {
		tree : null,
		menu : null
	};
	var container = null;
	var curr_popup_data = null;
	var actionFunctions = null;
	var detailsItem = null;
	var drop_items = [];
	var ctrl = false;
	var selContM = false;
    var selectAfterLoad = true;

    this.control_id = options.control_id;

	this.drag_items = null;
    this.inserted_id = null;
	this.server_script = options.connector + (options.connector.indexOf("?") == -1 ? "?" : "&") + "control_id=" + options.control_id;

	function init() {
	};


	function createContextArea(id_context_area) {
		$(container).append('<div id="' + id_context_area + '" style="position:absolute" ></div>');
		$(container).parent().attr("oncontextmenu", "return false;");
	}

    /*after load sort function*/
    function treeSortFunc(idA,idB){
        var a = parseInt((dhx.tree.getUserData(idA,'sort_order')));
        var b = parseInt((dhx.tree.getUserData(idB,'sort_order')));
        if(idA.split('_')[0] == 'member'){
            return 1;
        }
        if(idB.split('_')[0] == 'member'){
            return -1;
        }
        if(/* a==0 ||*/ a=='undefined'){
            return -1;
        }
        if(a==b){
            return 0;
        }
        return a>b?1:-1;
    }

    function initMenu() {
		var menu_id = "tree_context_menu_" + (new Date()).valueOf();
		createContextArea(menu_id);
		dhx.menu = new dhtmlXMenuObject();
		dhx.menu.setIconsPath(options.menuIconsPath);
		dhx.menu.renderAsContextMenu();
		dhx.menu.addContextZone(menu_id);
		//setItemsMenu(options.popup);
		dhx.menu.attachEvent("onClick", function(id, casState) {
			selContM=false;
			var zoneId = dhx.tree.contextID;
			//dhx.tree.setItemStyle(zoneId,"font-weight:normal;");
			for (var i = 0; i < curr_popup_data.length; i++) {
				if (curr_popup_data[i].id == id) {
					curr_popup_data[i].action.call(self, zoneId, dhx.tree, self.server_script);
					drop_items = [];
				}
			}
		});
		dhx.menu.attachEvent("onHide", function(id) {
			selContM = false;
			var zoneId = dhx.tree.contextID;
			dhx.tree.setItemStyle(zoneId, "font-weight:normal;");
		});
	}

    function deselectAllItems(){
		if(dhx.tree.getSelectedItemId){
			var select_ids = dhx.tree.getSelectedItemId().split(',');
			for (var i=0; i < select_ids.length; i++) {
				
				dhx.tree.setItemStyle(select_ids[i],"background-color: transparent; border:0px solid #696969; color:#666;");
				if(select_ids[i]==detailsItem){
					dhx.tree.setItemStyle(select_ids[i],"background-color:#fff; border:1px solid #696969; color:#666;");
				}else{
					dhx.tree.clearSelection(select_ids[i]);
				}
			};
			self.drag_items = null;
		}

	}

    function initTree(){
		if(!options.treewindow){
            $("#overview-body").empty();
            $("#overview-body").append("<div class='no-select-tree-item-message'><div>"+dlang("deteails_no_select","Select item in navigation tree")+"</div><div>");
            $("#overview-body").css('background-color','rgb(145, 144, 144)');
		}

		dhx.tree = new dhtmlXTreeObject(container, "100%", "100%", 0);
		dhx.tree.setImagePath(options.treeImagePath);
		dhx.tree.setIconSize('16px', '16px');
        dhx.tree.setCustomSortFunction(treeSortFunc);
        if(options.checkboxes){
            dhx.tree.enableCheckBoxes(true);
        }

		if (options.drag_mode != "") {
			dhx.tree.enableDragAndDrop(true, false);
			dhx.tree.setDragBehavior(options.drag_mode);
		}
		if (options.editable) {
			dhx.tree.enableItemEditor(options.editable);
		}
		var autoload = "";
		if (options.autoLoading) {
			dhx.tree.setXMLAutoLoading(self.server_script);
			autoload = "&id=0&autoload=true";
		}else{
			autoload = "&id=0&autoload=false";
		}
		
		dhx.tree.loadXML(self.server_script + autoload, function() {
			$('body').click(function(){
				if(dhx.tree.stopEdit){
					dhx.tree.stopEdit();
				}
				deselectAllItems();
			});
			$('.containerTableStyle').click(function(event){
			    event.stopPropagation();
			 });
			 
			$(window).keydown(function(event){
				if(event.keyCode==17){
					ctrl = true;
				}
			})

			$(window).keyup(function(event){
				if(event.keyCode==17){
					ctrl = false;
				}
			})
			//dhx.tree.openAllItems(0);
			//var table_div = $('div.containerTableStyle', $(container));
			//table_div = $('table tbody tr>td table', table_div).attr('style', 'width:100%');
		});
		dhx.tree.enableContextMenu(dhx.menu);
		dhx.tree.enableMultiselection(options.multiselect, options.select_mode);
        dhx.tree.attachEvent("onXLE", function(){
            var hashValues = Hash.get();
            if(!hashValues.search || hashValues.search=='0'){
                if(!hashValues.itemtype){
                    dhx.tree.loadOpenStates(options.control_id);
                    if(schoolmule.controls.tree.inserted_id){
                        dhx.tree.selectItem(schoolmule.controls.tree.inserted_id,true)
                        dhx.tree.saveSelectedItem(options.control_id);
                        schoolmule.controls.tree.inserted_id = null;
                    }else{
                        dhx.tree.restoreSelectedItem(options.control_id+"_selected");
                    }
                }

                if(!dhx.tree.getSelectedItemId() && !hashValues.itemtype){
                    if(options.selectFirstItem){
                        options.selectFirstItem(dhx.tree);
                    }
                }
            }
            options.load(dhx.tree);
            dhx.tree.sortTree(0, 'ASC', true);
        });

		dhx.tree.attachEvent("onEdit", function(state, id, tree, value) {
            if(schoolmule.main.user_role == 'pupil' || schoolmule.main.user_role == 'parent'){
                return false;
            }
			if (state == 0) {
				if (!options.edit_condition(id)) {
					return false;
				}
			}
			if (state == 1) {


				dhx.tree.setItemStyle(id,"border:0;");
				$('.intreeeditRow').blur(function() {
					//dhx.tree.stopEdit();
				});
                return options.onEditStart(id, value, dhx.tree);


			}

			if (state == 2) {
                if(window.tinyContent && window.tinyContent.getType() && window.tinyContent.getType()=="assignment" && window.save_notification){
                    var save_edit = $('<div id="save_tree" title=""><p>'+dlang("save_dialog_text_tabbar","Do you want to save draft or save and also publish to pupils?")+'</p></div>');

                    $('body').append(save_edit);

                    save_edit.dialog({
                        autoOpen: true,
                        modal: true,
                        width: 400,
                        minHeight: 120,
                        resizable: false,
                        buttons: [
                        ],
                        beforeClose: function( event, ui ) {
                            save_edit.dialog("destroy");
                            save_edit.remove();
                        }
                    });

                    save_edit.dialog( "option", "buttons", [
                        {
                            text: dlang("save_dialog_btn","Save"),
                            click: function() {

                                window.save_notification = false;
                                save_edit.dialog( "destroy" );
                                save_edit.remove();
                                options.onEdit(id, value, dhx.tree, self.server_script, options.select, actionFunctions);
                                $('#save').click();
                                return true;
                            }
                        },
                        {
                            text: dlang("savep_dialog_btn","Save and publish"),
                            click: function() {
                                window.no_publish_confirm = true;
                                window.save_notification = false;
                                save_edit.dialog( "destroy" );
                                save_edit.remove();
                                options.onEdit(id, value, dhx.tree, self.server_script, options.select, actionFunctions);
                                $('#save_publish').click();
                                return true;
                            }
                        },
                        {
                            text: dlang("disc_dialog_btn","Discard"),
                            click: function() {
                                window.save_notification = false;
                                save_edit.dialog("destroy");
                                save_edit.remove();
                            }
                        }
                    ] );

                    return true;
                }
                return options.onEdit(id, value, dhx.tree, self.server_script, options.select, actionFunctions);
			}
			return true;
		});

		dhx.tree.attachEvent("onBeforeContextMenu", function(zoneId){
            if(schoolmule.main.user_role == 'pupil' || schoolmule.main.user_role == 'parent'){
                return false;
            }
			if(!options.checkMenu(zoneId)){
				return false;
			}
			var select_ids = dhx.tree.getSelectedItemId().split(',');
			if(detailsItem==zoneId){
				dhx.tree.setItemStyle(detailsItem,"background-color:#bbb; border:1px solid #696969; color:#FFF;");
			}else if(detailsItem!=select_ids[0]){
				dhx.tree.setItemStyle(detailsItem,"background-color:#fff; border:1px solid #696969; color:#666;");
			}
			if (select_ids.length <= 1) {
				if(select_ids!=detailsItem && select_ids!=zoneId){
					dhx.tree.setItemStyle(select_ids,"background-color:#fff; border:0px solid #696969; color:#666;");
				}else if(detailsItem!=zoneId){
					dhx.tree.setItemStyle(zoneId,"background-color:#bbb; border:0px solid #696969; color:#fff;");
				}
				selContM = true;
				dhx.tree.selectItem(zoneId,false,false);
			}
			//dhx.tree.setItemStyle(zoneId,"font-weight:bold;");
			return self.showPopup(zoneId, options.popup, dhx.menu);
		});

		dhx.tree.attachEvent("onBeforeDrag", function(sId) {
            if(schoolmule.main.user_role == 'pupil' || schoolmule.main.user_role == 'parent'){
                return false;
            }
			return options.drag_condition(sId, dhx.tree, self);
		});

		dhx.tree.attachEvent("onDragIn", function(dId, lId, sObject, tObject) {
			return options.drop_condition(lId, tObject, dId, sObject);
		});

		dhx.tree.attachEvent("onOpenEnd", function(id,state){
            dhx.tree.saveOpenStates(options.control_id);
			return true;
		});
        dhx.tree.attachEvent("onCheck", function(id,state){
            return options.oncheck(id,state, dhx.tree);
        });
		
		dhx.tree.attachEvent("onDrag", function(sId, tId, id, sObject, tObject) {
			drop_items.push(sId);
			if (options.onDrag) {
				return options.onDrag.call(self, sId, tId, sObject, tObject, id);
			} else {
				return true;
			}

		});
		
		dhx.tree.attachEvent("onClick", function(id){
            if(window.comet_messager){
                window.comet_messager.stop();
                window.comet_messager = null;
            }

			var select_ids = dhx.tree.getSelectedItemId().split(',');
			if (select_ids.length !== 0) {
				if (select_ids[0].split("_")[0] !== id.split("_")[0]) {
					dhx.tree.clearSelection(id);
					if (_.indexOf(select_ids, id) != -1) {
						select_ids.pop(id);
					}
				}
			};
		});

        dhx.tree.attachEvent("onBeforeSelect", function(id){
            return false;
        });

		dhx.tree.attachEvent("onSelect", function(id){
            if(options.select===false){
                return;
            }
            var temp = id.split(',');
			if(!selContM){
				if(self.drag_items && temp.length==1){
					for(var i=0; i<self.drag_items.length;i++){
						dhx.tree.setItemStyle(self.drag_items[i],"background-color: transparent; border:0px solid #696969; color:#666;");
					}		
				}
			}

			self.drag_items = id.split(',');
			if(self.drag_items.length==1){
				if(detailsItem!=id)
					dhx.tree.setItemStyle(self.drag_items[self.drag_items.length-1],"background-color:#bbb; border:0px solid #696969; color:#FFF;");
				if(!selContM){
					var tdItem = options.select(id, dhx.tree, actionFunctions, detailsItem,ctrl);
                    updateTreePath(dhx.tree, id);
                    if(tdItem){
                        $("#overview-body").css('background-color','#FFFFFF');
                    }
                    window.tinyContent = false;
                    window.tinyDescription = false;
                    window.tinyGrading = false;
                    if(detailsItem != tdItem){
                        if(selectAfterLoad){
                            $('#'+container.id).parent().scrollTo(dhx.tree._globalIdStorageFind(id).htmlNode,1000,{offset:{top:-($('#'+container.id).parent().height()/2)}});
                            selectAfterLoad = false;
                        }

                        dhx.tree.saveSelectedItem(options.control_id+"_selected");
                        detailsItem = tdItem;
                    }
				}
				selContM=false;
			}else{
				if(self.drag_items[0] == detailsItem){
					dhx.tree.setItemStyle(self.drag_items[0],"background-color:#bbb; border:1px solid #696969; color:#FFF;");
				}
				for(var i=1; i<self.drag_items.length;i++){
					dhx.tree.setItemStyle(self.drag_items[i],"background-color:#bbb; border:0px solid #696969; color:#FFF;");
				}
			}
            return true;
		});
	}


    /**
     * This is an unattached (static) function that adds two integers together.
     * @param {int} One The first number to add
     * @param {int http://jsdoc.sourceforge.net/} Two The second number to add
     */
    this.getActiveIds = function() {
		return drop_items;
	};

    /**
     * This is an unattached (static) function that adds two integers together.
     * @param {int} One The first number to add
     * @param {int http://jsdoc.sourceforge.net/} Two The second number to add
     */
    this.setDetailsItem = function(id){
        detailsItem = id;
    }


    /**
     * This is an unattached (static) function that adds two integers together.
     * @param {int} One The first number to add
     * @param {int http://jsdoc.sourceforge.net/} Two The second number to add
     */
    var setItemsMenu = function(items) {
		dhx.menu.clearAll();

		for (var i = 0; i < items.length; i++) {
			dhx.menu.addNewChild(null, i, items[i].id, items[i].label);
		}
	}
	/******************************************************************/
	// public functions
	/*******************************************************************/

    /**
     * This is an unattached (static) function that adds two integers together.
     * @param {int} One The first number to add
     * @param {int http://jsdoc.sourceforge.net/} Two The second number to add
     */
    this.showPopup = function(zoneId, items) {
		curr_popup_data = items;
		setItemsMenu(items);
		for (var i = 0; i < items.length; i++) {
			if (!items[i].visible || items[i].visible(zoneId, dhx.tree)) {
				dhx.menu.showItem(items[i].id);
			} else {
				dhx.menu.hideItem(items[i].id);
			}
			if (items[i].enabled && !items[i].enabled(zoneId, dhx.tree)) {
				dhx.menu.setItemDisabled(items[i].id);
			} else {
				dhx.menu.setItemEnabled(items[i].id);
			}
			var el = dhx.tree._idpull[zoneId].htmlNode;
			var offset = $(el).offset();
			dhx.menu.showContextMenu(offset.left, offset.top);
		};
		return true;

	}

    /*Refresh all items in tree*/
    this.refreshAllTree = function(){
        dhx.tree.smartRefreshBranch(0,this.server_script);
    }

    /**
     * This is an unattached (static) function that adds two integers together.
     * @param {int} One The first number to add
     * @param {int http://jsdoc.sourceforge.net/} Two The second number to add
     */
    this.hidePopup = function(id, items) {
		//dhx.menu.hideContextMenu();
	}

    /**
     * This is an unattached (static) function that adds two integers together.
     * @param {int} One The first number to add
     * @param {int http://jsdoc.sourceforge.net/} Two The second number to add
     */
    this.getTree = function() {
		return dhx.tree;
	}

    /**
     * This is an unattached (static) function that adds two integers together.
     * @param {int} One The first number to add
     * @param {int http://jsdoc.sourceforge.net/} Two The second number to add
     */
    this.getDetailsItem = function() {
        return detailsItem;
    }

	/*******************************************************************/

    /**
     * This is an unattached (static) function that adds two integers together.
     * @param {int} One The first number to add
     * @param {int http://jsdoc.sourceforge.net/} Two The second number to add
     */
    this.attachTo = function(id, funcs) {
		actionFunctions = funcs;
		container = document.getElementById(id);
		initMenu();
		initTree();
	}

    this.createNewItemDialog = function(text,value,ok){
        var cont = $('<div id="dialog-prompt" title="">\
            <p>'+text+'</p>\
            <input id="prompt_input" value="'+value+'" style="width: 98%; margin-top: 10px;" type="text"/>\
        </div>');
        $('body').append(cont);
        var Ok = dlang("button_ok","Ok");
        var Cancel = dlang("button_cancel","Cancel");

        var save_item = function(){
            var val = $('#prompt_input').val();
            cont.dialog( "destroy" );
            cont.remove();
            if(ok){
                ok(val);
            }
            return true;
        }

        $('#prompt_input').keydown(function(event){
            if(event.keyCode==13){
                save_item();
            }
        });

        cont.dialog({
            autoOpen: true,
            modal: true,
            minWidth: 300,
            minHeight: 100,
            resizable: false,
            buttons: [
                {
                    text: Ok,
                    click: function() {
                        return save_item();
                    }
                },
                {
                    text: Cancel,
                    click: function() {
                        cont.dialog( "destroy" );
                        cont.remove();
                        if(cancel){
                            cancel();
                        }

                        return false;
                    }
                }
            ],
            beforeClose: function( event, ui ) {
                cont.dialog( "destroy" );
                cont.remove();
                cancel();
            }
        });
    }

	init();
};

