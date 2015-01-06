var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.tree_export = new schoolmule.controls.tree({
    control_id: "tree_export",
    drag_mode: "complex",
    treewindow:true,
    checkboxes:true,
    drag_condition: function(id, tree, treeObj){
        return true;
    },

    edit_condition: function(id){
        return false;
    },

    drop_condition: function(id, tree, id_dst, tree_dst){
        return true;
    },

    load:function(tree){
        var items = tree.getAllSubItems(0).split(',');
        for(var i=0; i<items.length; i++){
            var type = items[i].split('_')[0];
            if(_.indexOf(['teachers','pupils','users','structure','staff','pupilgroups'],type) != -1){
                tree.showItemCheckbox(items[i],0);
            }
        }

    },

    oncheck : function(id,state,tree){
        var grid = schoolmule.instances.grid_export.getGrid().grid;
        if(state==1){
            var type = "";
            var _id = id.split('_');
            switch(_id[0]){
                case "pupil":
                    if(_id.length == 3){
                        type = "Pupil";
                    }else{
                        type = "Pupil Studygroup";
                    }
                    break;
                case "staffmember": type = "Staff Member"; break;
                case "years": type = "Year"; break;
                case "academicyear": type = "Academic Year"; break;
                case "subject": type = "Subject"; break;
                case "studygroup": type = "Studygroup"; break;
                case "programme": type = "Programme"; break;
                case "pupilgroup": type = "Pupilgroup"; break;
            }
            grid.addRow(id, [type,tree.getItemText(id),tree.getItemText(id),1]);
            grid.setUserData(id,"type",id[0]);
        }else{
            grid.deleteRow(id);
        }
        return true;
    },

    onDrag: function(sid,tid,sObject,tObject,lId){
        return true;
    },
    select_mode:true,
    multiselect:true,
    editable:true,
    checkMenu: function(id){
        return true;
    },

    select: function(id,tree,funcs,prev,ctrl){
        tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
        tree.clearSelection(id);
        return false;
    },
    popup: [
    ]

});