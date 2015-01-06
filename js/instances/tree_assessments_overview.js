var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.tree_assessments_overview = new schoolmule.controls.tree({
	control_id: "tree_assessments_overview",
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

		if(schoolmule.instances.tree_assessments_by_studygroup){
			var tree_desel = schoolmule.instances.tree_assessments_by_studygroup.getTree();
			tree_desel.setItemStyle(tree_desel.getSelectedItemId(),"background-color:#fff; border:0px solid #696969; color:#666;");
            tree_desel.clearSelection();
            tree_desel.saveSelectedItem("tree_assessments_by_studygroup"+"_selected");
		}
		if((id.split(",")).length>1){
			return false;
		}
		if(prev){
			tree.setItemStyle(prev,"border:0; background-color:#FFFFFF; color:#666;");					
		}
		var _id = id.split("_");
		switch (_id[0]){
            case "academicyear":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
            case "subject":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
            case "years":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
            case "programme":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
            case "pupilgroup":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
            case "pupil":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
			case "assignmentsprogress":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.assignmentsprogress(_id[1]);
				return id;
			case "stats":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				var programme = tree.getParentId(tree.getParentId(tree.getParentId(id)));
				_idp = programme.split("_");
				funcs.actions.stats(_id[1],_idp[1]);
				return id;
			default:
				return null;
		}
	},
	popup: []
	
});