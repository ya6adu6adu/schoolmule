var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.grid = function(_options){
	var self = this;
	
	var defaults = {
		id: "my_id",
		connector : "connectors/connector.php",
		multirows: true,
		gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
		menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
		popup: null,
		addRow:function(){},
		selectRow:function(){},
		editCell:function(){
            return true;
        },
		load:function(){return 1},
		showMenu: function(){return 1},
		beforeSelectRow:  function(){return 1},
        rowDblClicked:  function(){return 1},
        openEnd:  function(){return 1},
        mouseOver:  function(){return 1},
		lng:"en,de",
		row_id: "0",
		dp:true,
        save_state:true
	};
	var options = $.extend(defaults, _options);
	var dhx = {
		grid: null,
		menu: null
	};
	var dialog;
	var myDataProcessor;
	var container = null;
	var curr_popup_data = null;
	var actions = null;
	var keysel = false;
	this.row_id = null;
	this.server_script = options.connector+'?control_id='+options.id+'&lng='+options.lng;
    this.dialog_state = false;

	/******************************************************************/
	// private functions
	/*******************************************************************/

    /*Create area for grid context menu*/
	var createContextArea = function(id_context_area){
		var contextArea = $('<div id="'+id_context_area+'" style="position: absolute;"></div>');
		//contextArea.id = id_context_area;
		//contextArea.style = "position: absolute;";
		$('#'+container).append(contextArea);
	}

    /*Initialization grid context menu*/
	var initMenu = function(){
		createContextArea("grid_context_menu");
		dhx.menu = new dhtmlXMenuObject();
		dhx.menu.setIconsPath(options.menuIconsPath);
		dhx.menu.renderAsContextMenu();
		dhx.menu.addContextZone("grid_context_menu");
		dhx.menu.attachEvent("onClick", function(id, casState){
			var data = dhx.grid.contextID.split("_");
			for(var i=0; i< options.popup.length; i++) {
				if(options.popup[i].id==id)  {
					options.popup[i].action(data[0],dhx.grid,self,data[1],{tree_item:self.row_id},data[2]);
				}
			};
			return true;
		});

		for(var i=0; i< options.popup.length; i++) {
			if(options.popup[i]){
				dhx.menu.addNewChild(null, 0, options.popup[i].id, options.popup[i].label);
			}
			  
		};
		
	}

    /*Initialization grid*/
	var initGrid = function(){
		$("*").keydown(function(event){
			if (event.keyCode == 38 || event.keyCode == 40) {
				keysel = event.keyCode;
			}
		});

		dhx.grid = new dhtmlXGridObject(container);
		dhx.grid.selMultiRows = options.multirows;
		dhx.grid.setImagePath(options.gridImagePath);
		dhx.grid.enableContextMenu(dhx.menu);
		dhx.grid.enableMultiselect(false);
		//dhx.grid.enableAutoWidth(true);
      	//dhx.grid.enableAutoHeight(true);
      	
		if(options.setConfig){
			options.setConfig(dhx.grid,options.connector+'?control_id='+options.id,self.row_id);
		}
		dhx.grid.init();
		dhx.grid.setSkin("dhx_skyblue");
		if(!options.setConfig){
			dhx.grid.loadXML(options.connector+"?i=0"+'&control_id='+options.id+'&lng='+options.lng+'&item_id='+self.row_id,function(){
				//options.load(dhx.grid);
			});
		}
		//var combo = dhx.grid.getColumnCombo(0);
		//combo.loadXML("&i=0");
		if(options.dp){
			myDataProcessor = new dataProcessor(options.connector+"?i=0"+'&control_id='+options.id+'&lng='+options.lng+'&item_id='+self.row_id);
			myDataProcessor.enableDataNames(true);
			myDataProcessor.init(dhx.grid);			
		}
		
		dhx.grid.attachEvent("onXLE", function(rId){
            /*
            $('.objbox , body').click(function(){
                if(dhx.grid.clearSelection){
                    dhx.grid.clearSelection();
                    if(options.save_state){
                        deleteCookie(options.id+'_select');
                    }
                }
            });
            */
            var hashValues = Hash.get();
            if(!hashValues.search || hashValues.search=='0'){
                    if(options.save_state){
                    dhx.grid.loadOpenStates(options.id+'_open');
                    var selected = getCookie(options.id+'_select');
                    if(selected){
                        dhx.grid.selectRowById(selected,true,true,true);
                    }
                }
            }

            if(!dhx.grid.getSelectedRowId()){
                if(options.selectFirstItem){
                    options.selectFirstItem(dhx.grid);
                }
            }else{
                /*FIXME Hot solution for production - need make it no on main controls*/
                var _id = dhx.grid.getSelectedRowId().split("_");
                if((_id[0]=="p" || _id[0]=="a")){
                    if(options.selectFirstItem){
                        options.selectFirstItem(dhx.grid);
                    }
                }
            }
			options.load(dhx.grid, selected);
		});  
		
		dhx.grid.attachEvent("onRowCreated", function(rId){
			options.addRow(rId,dhx.grid.getColumnsNum()-1,dhx);
		});  
		dhx.grid.attachEvent("onRowSelect", function(id,ind){
            if(options.save_state){
                setCookie(options.id+'_select', id);
            }
            //if(id === 'addresultbtn'){
            //    this.callEvent("onRowDblClicked",[id,ind]);
            //}
            keysel = false;
			options.selectRow(ind, id, dhx, options, self.row_id, actions, self.row_id);
		});
		
		dhx.grid.attachEvent("onBeforeSelect", function(new_row,old_row){
            return options.beforeSelectRow(new_row,dhx,keysel,self.row_id, old_row);
		});

        dhx.grid.attachEvent("onRowDblClicked", function(rId,cInd){
            return options.rowDblClicked(rId,cInd);
        });

        dhx.grid.attachEvent("onMouseOver", function(id,ind){
            return options.mouseOver(id,ind);
        });

		dhx.grid.attachEvent("onOpenStart", function(id,state){
			options.openTree(id,dhx,state,self.row_id);
			return true;
		});


        dhx.grid.attachEvent("onOpenEnd", function(id,state){
            if(options.save_state){
                dhx.grid.saveOpenStates(options.id+'_open');
            }
            options.openEnd(id,state,dhx.grid);
            return true;
        });
		
		dhx.grid.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue){
            if(schoolmule.main.user_role == 'pupil' || schoolmule.main.user_role == 'parent'){
                return false;
            }
			return options.editCell(stage,rId,cInd,nValue,oValue,dhx.grid,self,self.row_id);
		});
		
		dhx.grid.attachEvent("onBeforeContextMenu", function(zoneId){
			if(options.showMenu){
				//return options.showMenu(zoneId);
			}
			return self.showPopup(zoneId, options.popup, dhx.menu);
		});
	}
	
	/******************************************************************/
	// public functions
	/*******************************************************************/

    /*Getting grid rows number*/
    this.getNumRows = function(){
		return dhx.grid.getRowsNum();
	}

    /*Getting menu items*/
	function setItemsMenu(items) {
		dhx.menu.clearAll();
		for (var i = 0; i < items.length; i++) {
			dhx.menu.addNewChild(null, i, items[i].id, items[i].label);
		}
	}

    /*Set visibility menu items*/
	this.showPopup = function(zoneId, items){
		dhx.menu.clearAll();
		curr_popup_data = items;
		setItemsMenu(items);
		for (var i = 0; i < items.length; i++) {
			if (!items[i].visible || items[i].visible(zoneId, dhx.grid)) {
				dhx.menu.showItem(items[i].id);
			} else {
				dhx.menu.hideItem(items[i].id);
			}
			if (items[i].enabled && !items[i].enabled(zoneId, dhx.grid)) {
				dhx.menu.setItemDisabled(items[i].id);
			} else {
				dhx.menu.setItemEnabled(items[i].id);
			}
			
		};
		dhx.menu.showContextMenu();
		//for(var i=0; i< items.length; i++) {
		//	dhx.menu.addNewChild(null, 0, items[i].id, items[i].label);    
		//	dhx.menu.showContextMenu(offset.left,offset.top);
		//};
			
		return true;	
	}

    /*Hide context menu*/
	this.hidePopup = function(id, items){
		//dhx.menu.hideContextMenu();
	}

    /*Refresh grid under parent sizes, when window size is changed*/
	this.refresh = function(){
        dhx.grid.setSizes();
		//dhx.grid.clearAll();
		//dhx.grid.load(options.connector+'?control_id='+options.id+'&lng='+options.lng);
	}

    /*Refresh grid under parent sizes, when expand/collapse*/
	this.refreshExpand = function(){
		this.refresh();
	}

    /*Get dhtmlx grid object*/
	this.getGrid = function(){
		return {grid:dhx.grid,dp:myDataProcessor};
	}
		
	/*******************************************************************/

    /*Attach grid to block*/
	this.attachTo = function(id, row, externalFuncs){
		actions = externalFuncs;
		self.row_id = row;
		container = id;
		//dialog = new Dialog();
		initMenu();
		initGrid();	
	};
}

/*define new cell type (button) in dhtmlx grid */
function eXcell_button(cell){                                    //excell name is defined here
    if (cell){                                                     //default pattern, just copy it
        this.cell = cell;
        this.grid = this.cell.parentNode.grid;
    }
    this.edit = function(){
        return true;
    }                                //read-only cell doesn't have edit method
    this.isDisabled = function(){ return true; }      // the cell is read-only, that's why it is always in the disabled state
    this.setValue=function(val){
        this.setCValue("<button  class='button' type='button' style='width: 100%'>"+dlang("Reset","Reset")+"</button>",val);
    }
}
eXcell_button.prototype = new eXcell;    // nest all other methods from base class