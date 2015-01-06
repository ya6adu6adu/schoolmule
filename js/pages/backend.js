$(function(){
    showBackend();
/*	schoolmule.main.callback = showBackend;
	if(schoolmule.main.user_id==null){
		schoolmule.main.showLogin();
	}else{

	}*/
});

function showBackend(){
	var content = null;
    var hashValues = Hash.get();
    var default_select = true;
    if(hashValues.tab){
        default_select = false;
    }

	var tabbar = new schoolmule.controls.tabs({
		container:"second-menu",
		tabs_left:{
				id:'left-tab', 
				callback: function(){
				}, 
				label:'Backend setup',
				select: false
			},
		tabs: [
			{
				id:'settings', 
				callback: function(){
					addSettings();
				}, 
				label:'Settings',
				select: true
			},
			{
				id:'customers', 
				callback: function(){
					addCustomersGrid();
				}, 
				label:'Customers',
				select: false
			},
			{
				id:'educational_entities', 
				callback: function(){
					addEntitiesGrid();
				}, 
				label:'Educational entities',
				select: false
			},
			{
				id:'administrators', 
				callback: function(){
					addAdminGrid();

				}, 
				label:'Administrators',
				select: false
			}
		]
	
	});

    if(hashValues.tab){
        tabbar.setActiveTab(hashValues.tab);
    }

	
	function addAdminGrid(){
		if(content){
			content.destroy();
		}
		content = new schoolmule.controls.layout({
		cellsBlock: {
					display_footer_right: true,
					cells_right:[
									{													
										cells:[
										{
											id : "grid_admins",
											title: "Administrators",
											width: '100%',
											height: '100%'
										}
										]
									}
							     ]
			  }
		});
		schoolmule.instances.grid_admins.attachTo("grid_admins");
		content.elements.push(schoolmule.instances.grid_admins);
		
		content.attachButtons([
		{	
			label : "Reset password",
			id : "reset_pass",
			callback : function(){
				if(confirm("Reset password?")){
					var gridObj = schoolmule.instances.grid_admins.getGrid();
					var ind = gridObj.grid.getSelectedRowId();
					if(ind){
						var inds = ind.split(',');
						for(var i=0;i<inds.length;i++){
							gridObj.grid.cells(inds[i],7).setValue(schoolmule.main.randomPassword(10));
							gridObj.dp.setUpdated(inds[i],true);
							gridObj.dp.sendData(inds[i]);							
						}
					}else{
						return false;
					}												
				}else{
					return false;
				}

			}
		}
		]);
	}
	
	function addCustomersGrid(){
		if(content){
			content.destroy();
		}
		content = new schoolmule.controls.layout({
		cellsBlock: {
					display_footer_right: true,
					cells_right:[
									{													
										cells:[
										{
											id : "grid_customers",
											title: "Customers",
											width: '100%',
											height: '100%'
										}
										]
									}
							     ]
			  }
		});
		schoolmule.instances.grid_customers.attachTo("grid_customers");		
		content.elements.push(schoolmule.instances.grid_customers);
	}
	
	function addEntitiesGrid(){
		if(content){
			content.destroy();
		}
		content = new schoolmule.controls.layout({
		cellsBlock: {
					display_footer_right: true,
					cells_right:[
									{													
										cells:[
										{
											id : "grid_educ_entities",
											title: "Educational entities",
											width: '100%',
											height: '100%'
										}
										]
									}
							     ]
			  }
		});

		schoolmule.instances.grid_educ_entities.attachTo("grid_educ_entities");				
		content.elements.push(schoolmule.instances.grid_educ_entities);
	}	
	
	function addSettings(){
		if(content){
			content.destroy();
		}
		content = new schoolmule.controls.layout({
		cellsBlock: {
					display_footer_right: true,
					cells_right:[
									{													
										cells:[
										{
											id : "form_settings",
											width: '100%',
											height: '100%'
										}
										]
									}
							     ]
			  }
		});
		
		content.setTitle("main-content","Settings");
		
		if(schoolmule.main.user_id==null){
			$('#form_settings').html("No currently signed admin!");
			return false;
		}

		schoolmule.instances.form_settings.attachTo("form_settings");
				//id : "form_settings",
				//user_id : schoolmule.main.user_id
				
		content.elements.push(schoolmule.instances.form_settings);
	
		content.attachButtons([
		{
			label : "Save",
			id : "save",
			callback : function(){
                schoolmule.instances.form_settings.saveData(content);
			}
		}
        /*{
			label : "Cancel",
			id : "cancel",
			callback : function(){
			}
		}*/
		]);	
	}	
}									
