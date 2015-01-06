var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_customers = new schoolmule.controls.grid({

		//var dialog = new Dialog();
		
			id: "grid_customers",			
			addRow: function(rId,cn,dhx){			
			},
			
			selectRow: function(ind,id,dhx,options){			
			},
			popup: [{	
					id: "add",
					label: dlang("New customer"),
					action: function(id,grid){
						//dialog.confirm("Add new?",function(res,but_id){
							//if(but_id=="ok"){
								grid.addRow(id+1,"", id);
							//} 
							
					//	});
						
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
				}
				]
			
})