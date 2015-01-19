var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.tree_assessments_by_studygroup = new schoolmule.controls.tree({
	control_id: "tree_assessments_by_studygroup",
	drag_mode: "complex",
	drag_condition: function(id, tree, treeObj){
		return false;
	},

	edit_condition: function(id){
		return false
	},
    selectFirstItem:function(tree){
        var items = tree.getAllSubItems(0);
        var _items = items.split(',');
        var main_array = ["objectivesprogress"];
        for(var i=0; i< _items.length; i++){
            var _id = _items[i].split('_');
            if(_.indexOf(main_array,_id[0]) != -1){
                tree.selectItem(_items[i],true);
                break;
            }
        }
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
		if(schoolmule.instances.tree_assessments_overview){
			var tree_desel = schoolmule.instances.tree_assessments_overview.getTree();
			tree_desel.setItemStyle(tree_desel.getSelectedItemId(),"background-color: transparent; border:0px solid #696969; color:#666;");
            tree_desel.clearSelection();
            tree_desel.saveSelectedItem("tree_assessments_overview"+"_selected");
		}
		if((id.split(",")).length>1){
			return false;
		}
		
		if(prev){
			tree.setItemStyle(prev,"border:0; background-color: transparent; color:#666;");
		}
		var _id = id.split("_");
		switch (_id[0]){
            case "academicyear":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "subject":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "years":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "programme":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "studygroup":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "pupil":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
			case "objectivesprogress":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.objectivesprogress(_id[1],_id[2]);
				return id;
			case "assignmentsprogress":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.assignmentsprogress(_id[1]);
				return id;
			case "statsandnotes":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.statsandnotes(_id[1],_id[2]);
				return id;
			default:
				return null;
		}
	},
	popup: []
	
});