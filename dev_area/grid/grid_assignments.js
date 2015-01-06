var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_assignments = new schoolmule.controls.grid({

		//var dialog = new Dialog();
		
			id: "grid_id",
			connector: "grid_con.php?lng=en,de",
			popup: [{	
					id: "add",
					label: "Add new row",
					action: function(id,grid){
						grid.addRow(id+1,"label"+(new Date()).getTime()+",label,label", id);
						grid.selectRowById(id+1);
					}
   
				},{
					id: "delete",
					label: "Delete current row",
					action: function(id, grid){
						//dialog.confirm("Delete?",function(res,but_id){
						//if(but_id=="ok"){
						if(confirm("Delete?")){
							grid.deleteRow(id);
						} 
						
					//});
					}
				}]
		
		
})