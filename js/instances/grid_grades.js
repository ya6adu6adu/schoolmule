var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_grades = new schoolmule.controls.grid({
	id: "grid_grades",			
	addRow: function(rId,cn,dhx){			
	},
	
	selectRow: function(ind,id,dhx,options){
        $('#pupil_assessment_stat').scrollTo('#objective_text_'+id,500);
	},
	editCell: function(stage,rId,cInd,nValue,oValue,grid){
        if(schoolmule.main.user_role == 'pupil' || schoolmule.main.user_role == 'parent'){
            return false;
        }
		return true;
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
                seconfirm(dlang("Delete?"),function(){
                    grid.deleteRow(id);
                });
				
			//});
			}
		}
		]	
});