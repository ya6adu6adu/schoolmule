var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.grid = function(_options){
	var self = this;
	
	var defaults = {
		id: "my_id",
		connector : "my_connector",
		multirows: true,
		gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
		menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
		popup: null
	};
	var options = $.extend(defaults, _options);
	var dhx = {
		grid: null,
		menu: null,	
	};
	var dialog;
	var container = null;
	var curr_popup_data = null;
	/******************************************************************/
	// privatefunctions
	/*******************************************************************/
	
	var createContextArea = function(id_context_area){
		var contextArea = document.createElement('div');
		contextArea.id = id_context_area;
		contextArea.style = "position: absolute;";
		container.appendChild(contextArea);
	}
	
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
					options.popup[i].action(data[0],dhx.grid);
				}
			};
				
			//alert(data[0]);
			//alert(data[1]);
			return true;
			
		});
		for(var i=0; i< options.popup.length; i++) {
			dhx.menu.addNewChild(null, 0, options.popup[i].id, options.popup[i].label);    
		};
		
	}
	
	var initGrid = function(){
		dhx.grid = new dhtmlXGridObject(container);
		dhx.grid.selMultiRows = options.multirows;
		dhx.grid.setImagePath(options.gridImagePath);
		dhx.grid.setHeader("Assignment result units,Max,Pass,Mandatory,Course,Course objectives,");
		dhx.grid.setInitWidthsP("25,15,15,10,15,15,5");
		dhx.grid.setColTypes("co,ed,ed,ch,ed,ed,img");
		dhx.grid.enableContextMenu(dhx.menu);
		dhx.grid.init();
		dhx.grid.setSkin("dhx_skyblue");
		dhx.grid.loadXML(options.connector+"&i=0");
		//var combo = dhx.grid.getColumnCombo(0);
		//combo.loadXML("&i=0");
		var myDataProcessor = new dataProcessor(options.connector+"&i=0");
		myDataProcessor.init(dhx.grid);
		
		dhx.grid.attachEvent("onRowCreated", function(rId){	
			if(rId==1) {
				dhx.grid.cells(1,6).setValue("dhtmlx/dhtmlxGrid/codebase/imgs/plus.gif");
			} else {
				dhx.grid.cells(rId,6).setValue("dhtmlx/dhtmlxGrid/codebase/imgs/minus.gif");
			}
		});  
		dhx.grid.attachEvent("onRowSelect", function(id,ind){
			if(ind==5 || ind==4){
				for(var i=0; i< options.popup.length; i++) {
					if(options.popup[i].id=="edit_course"){
						options.popup[i].action(id,ind);
					}
				};	
			}
			if(ind==6){
				if(id==1){
					//dialog.confirm("Add new?",function(res,but_id){
					//	if(but_id=="ok"){
							dhx.grid.addRow(id+1,"1,0,0,0,0,0", id);
						//} 
							
					//});
				}else{
					//dialog.confirm("Delete?",function(res,but_id){
						//if(but_id=="ok"){
						if(confirm('Delete?')){
							dhx.grid.deleteRow(id);
						}
						//} 
							
					//});
					
				}
			}
		 
		});
	}
	
	/******************************************************************/
	// public functions
	/*******************************************************************/
	this.showPopup = function(zoneId, items){	
	
		dhx.menu.clearAll();
		curr_popup_data = items;
		for(var i=0; i< items.length; i++) {
			dhx.menu.addNewChild(null, 0, items[i].id, items[i].label);    
			dhx.menu.showContextMenu(offset.left,offset.top);
		};
			
		return true;	
	}
	this.hidePopup = function(id, items){
		//dhx.menu.hideContextMenu();
	}
	
	/*******************************************************************/
	this.attachTo = function(id){
		container = document.getElementById(id);
		//dialog = new Dialog();
		initMenu();
		initGrid();	
	};
	
	
}