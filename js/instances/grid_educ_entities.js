var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_educ_entities = new schoolmule.controls.grid({

		//var dialog = new Dialog();
		
			id: "grid_educ_entities",
			
			addRow: function(rId,cn,dhx){			
			},
			
			selectRow: function(ind,id,dhx,options){			
			},
				
			popup: [{	
					id: "add",
					label: dlang("New Educational entity"),
					action: function(id,grid){
						//dialog.confirm("Add new?",function(res,but_id){
							//if(but_id=="ok"){
								grid.addRow(id+1,"", id);
							//}	
					//});
					}
				},{
					id: "delete",
					label: dlang("Delete"),
					action: function(id, grid){
						//dialog.confirm("Delete?",function(res,but_id){
						//if(but_id=="ok"){
						if(confirm("Delete?")){
							grid.deleteRow(id);
						} 
						
					//});
					}
				},{
                id: "duplicate",
                label: dlang("Duplicate"),
                action: function(id, grid, tree_obj){
                    $.post(tree_obj.server_script, {action:"duplicate", id:id}, function(){
                        grid.clearAndLoad(tree_obj.server_script);
                        return true;
                    });

                    //dialog.confirm("Delete?",function(res,but_id){
                    //if(but_id=="ok"){
/*                    if(confirm("Duplicate?")){

                    }*/

                    //});
                }
                }
				]
})