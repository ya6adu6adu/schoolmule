var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.tree_assessments = new schoolmule.controls.tree({
	control_id: "tree_assessments",
	drag_mode: "complex",
	drag_condition: function(id, tree, treeObj){
		return false;
	},

	edit_condition: function(id){
		return false
	},
	
	drop_condition: function(id, tree, id_dst, tree_dst){
		return false
	},
	onEdit: function(id,value,tree,script){
	},
	onDrag: function(sid,tid,sObject,tObject,lId){
	},
	select_mode:true,
	multiselect:true,
	editable:false,
	select: function(id,tree,funcs,prev){
		if((id.split(",")).length>1){
			return false;
		}
		
		if(prev){
			tree.setItemStyle(prev,"border:0; background-color:#FFFFFF; color:#666;");					
		}
		var _id = id.split("_");
		switch (_id[0]){
			case "objectivesprogress":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.objectivesprogress(_id[1]);
				return id;
			case "assignmentsprogress":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.assignmentsprogress(_id[1]);
				return id;
			case "performanceprogress":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.performanceprogress(_id[1]);
				return id;
			case "statsandnotes":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.statsandnotes(_id[1]);
				return id;
			default:
				return null;
		}
	},
	popup: []
	
});