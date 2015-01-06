var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_assignments = new schoolmule.controls.grid({

		//var dialog = new Dialog();
		
			id: "grid_id",
			connector: "xml/update.php",
			popup: [{	
					id: "add",
					label: "Add new row",
					action: function(id,grid){
						//dialog.confirm("Add new?",function(res,but_id){
							//if(but_id=="ok"){
								grid.addRow(id+1,"new,0,0,0,new,new", id);
							//} 
							
					//	});
						
					}
   
				},{
					id: "delete",
					label: "DELETE current row",
					action: function(id, grid){
						//dialog.confirm("Delete?",function(res,but_id){
						//if(but_id=="ok"){
							grid.deleteRow(id);
						//} 
						
					//});
					}
				}]
		
		
})