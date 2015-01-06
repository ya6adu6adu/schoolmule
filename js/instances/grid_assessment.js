var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_assessment = new schoolmule.controls.grid({		
			id: "grid_assessment",
			gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
			menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
			dp:false,
			addRow: function(rId,cn,dhx){			
			},
			
			selectRow: function(ind,id){
			},
			
			openTree: function(id,dhx,state){
				/*
				if(state>0){
					dhx.grid.setRowColor(id,"white");
				}else{
					dhx.grid.setRowColor(id,"#efcece");
				}
				*/
			},
			
			setConfig: function(mygrid,script,id){
				mygrid.setHeader(dlang("Performance")+','+dlang("Assessment"));
				mygrid.setInitWidthsP("92,8");
				mygrid.setColAlign("left,left");
				mygrid.setColTypes("tree,co,ro");
				mygrid.setColSorting("str,str");
				mygrid.kidsXmlFile = script;
				mygrid.loadXML(script+'&id='+id);				
			},
			showMenu: function(id){
				var data = id.split("_");
				if(data[0]=='performance'){
					return true;
				}else{
					return false;
				}
				
			},
			editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj){
				if(stage == 2){
					$.post(tree_obj.server_script, {action:"editassessment", id:rId, assessment:nValue}, function(){
						return true;
					})
				}
				return true;
			},
			
			popup: [
				{
					id: "expand",
					label: dlang("Expand"),
					action: function(id, grid, tree_obj, index){
						grid.expandAll();			
					}
				},
				{
					id: "collapse",
					label: dlang("Collapse"),
					action: function(id, grid, tree_obj, index){
						grid.collapseAll();
					}
				},
				{
					id: "delete",
					label: dlang("Remove"),
					action: function(id, grid, tree_obj, index){
                        seconfirm(dlang("Delete?"),function(){
                            $.post(tree_obj.server_script, {action:"remove", id:index}, function(){
                                grid.deleteSelectedItem()
                            })
                        });
					}
				},{
					id: "deactive",
					label: dlang("Deactivate"),
					action:function(id, grid, tree_obj, index){
						$.post(tree_obj.server_script, {action:"deactive", id:index}, function(){
						})							
					}
				},
				{
					id: "reactive",
					label: dlang("Reactivate"),
					action:function(id, grid, tree_obj, index){
						$.post(tree_obj.server_script, {action:"reactive", id:index}, function(){
							
						});
					}
				}
				]
		
		
})