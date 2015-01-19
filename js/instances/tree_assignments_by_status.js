var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.tree_assignments_by_status = new schoolmule.controls.tree({
	control_id: "tree_assignments_by_status",
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
	checkMenu: function(id){
		return false;
	},
	select: function(id,tree,funcs,prev){

		if(schoolmule.instances.tree_assignments_by_studygroup){
			var tree_desel = schoolmule.instances.tree_assignments_by_studygroup.getTree();
			tree_desel.setItemStyle(tree_desel.getSelectedItemId(),"background-color:#fff; border:0px solid #696969; color:#666;");
            tree_desel.clearSelection();
            tree_desel.saveSelectedItem('tree_assignments_by_studygroup_selected');
		}
		if((id.split(",")).length>1){
			return false;
		}
		if(prev){
			tree.setItemStyle(prev,"border:0; background-color:#FFFFFF; color:#666;");					
		}
		var _id = id.split("_");
		switch (_id[0]){
			case "assignment":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.assignment(_id[1],_id[2]);
                return id;
				break;
            case "submission":
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                funcs.actions.submission(_id[1],_id[2]);
                return id;
                break;
            default:
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
				break;
		}
	},
	popup: []
	
});