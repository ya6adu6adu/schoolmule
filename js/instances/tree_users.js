var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.tree_users = new schoolmule.controls.tree({
    control_id: "tree_users",
    drag_mode: "complex",
    selectFirstItem:function(tree){
        var items = tree.getAllSubItems(0);
        var _items = items.split(',');
        var main_array = ["staff"];
        for(var i=0; i< _items.length; i++){
            var _id = _items[i].split('_');
            if(_.indexOf(main_array,_id[0]) != -1){
                tree.selectItem(_items[i],true);
                break;
            }
        }
    },
    load:function(tree){
        var hashValues = Hash.get();
        if(hashValues.pupil){
            tree.selectItem('pupil_'+hashValues.pupil+'_'+hashValues.pg,false);
            Hash.remove('pupil');
            Hash.remove('pg');
            Hash.remove('search');
        }
        if(hashValues.staffmember){
            tree.selectItem('staffmember_'+hashValues.staffmember,false);
            Hash.remove('staffmember');
            Hash.remove('search');
        }
    },

    drag_condition: function(id, tree, treeObj){
        var _id = id.split("_");
        console.log(id);
        if(_.indexOf(["pupil","staffmember","pupilgroup"],_id[0]) == -1){
            return false;
        }

        var ids = treeObj.drag_items;
        if(ids.length && ids.length > 1){
            return false;
        }

        return true;
    },

    edit_condition: function(id){
        var _id = id.split("_");
        var editing_items = ['programme','pupilgroup','years'];
        for(var i=0; i<=editing_items.length;i++){
            if(editing_items[i]==_id[0]){

                return true;
            }
        }
        return false;
    },

    drop_condition: function(id, tree, id_dst, tree_dst){
        var _id = id.split("_");
        var _id_dst = id_dst.split("_");
        if(_id!='pupil'){
            return false;
        }
        var idParent = tree.getParentId(id_dst);
        var _idParent = idParent.split("_");
        if(_.indexOf([_idParent[0]],_id[0]) != -1){
            return true;
        }

        if(_.indexOf([_id_dst[0]],_id[0]) != -1){
            tree.setItemStyle(id,"background-color:#fff; color:#666;");
            return true;
        }
        return false;

    },
    onEdit: function(id,value,tree,script,select,funcs){
        tree.setItemStyle(id,"font-weight:bold;");
        var _id = id.split("_");
        $.post(script, {
            action:"rename",
            id:_id[1],
            name:value,
            node:_id[0]
        }, function(data){
            tree.setItemStyle(id,"font-weight:normal;");
            if(data.edit=='0'){
                tree.smartRefreshItem(id,script);
            }
            if(_.indexOf(["staffmember","pupilgroup","pupil"],_id[0]) != -1){
                var treestr = schoolmule.instances.tree_programme_structure.getTree();
                treestr.smartRefreshBranch('academicyears','connectors/connector.php?control_id=tree_programme_structure');
            }
            select(tree.getSelectedItemId(),tree,funcs);
        },'json');
        return true;
    },

    onDrag: function(sid,tid,sObject,tObject,lId){
        var _id = tid.split("_");
        if(!lId && _id[0]=="objective"){
            return false;
        }
        this.showPopup(tid,[{
            id: "duplicate",
            label: dlang("tree_users_menu_dupl","Duplicate"),
            action: function(id, tree,server){
                var drop_ids = this.getActiveIds();
                var ids = [];
                var type_id = drop_ids[0].split("_")[0];
                for(var i=0;i<drop_ids.length;i++){
                    ids.push(drop_ids[i].split("_")[1]);
                    sid = drop_ids[i].split("_")[1];
                }
                var studygroup_id;
                var _id = tid.split("_");
                if(_id[0]==="studygroup"){
                    studygroup_id = _id[1];
                }else {
                    var parent = tree.getParentId(tid);
                    while(parent.split("_")[0]!=="studygroup"){
                        parent = tree.getParentId(parent);
                    }
                    studygroup_id = parent.split("_")[1];
                }
                $.post(this.server_script, {action:"movedupl_"+type_id, sid:sid, tid:tid,studygroup:studygroup_id, lid:lId}, function(){
                    tree.smartRefreshItem(tid,server+"&refresh=1");
                })
            }

        },{
            id: "move",
            label: dlang("tree_users_menu_move","Move"),
            action: function(id, tree, server){
                var drop_ids = this.getActiveIds();
                var ids = [];
                var type_id = drop_ids[0].split("_")[0];
                for(var i=0;i<drop_ids.length;i++){
                    ids.push(drop_ids[i].split("_")[1]);
                    sid = drop_ids[i].split("_")[1];
                }

                $.post(this.server_script, {action:"move_"+type_id, sid:sid, tid:tid, lid:lId}, function(data){
                    tree.smartRefreshBranch(tree.getParentId(tid),server);
                });
            }
        },{
            id: "cancel",
            label: dlang("tree_users_menu_cancel","Cancel"),
            action: function(id, tree){
            }
        }]);
        return false;
    },
    select_mode:true,
    multiselect:true,
    editable:true,
    checkMenu: function(id){
        return true;
    },
    select: function(id,tree,funcs,prev,ctrl){
        var _id = id.split("_");
        if(prev){
            tree.setItemStyle(prev,"border:0; background-color:#FFFFFF; color:#666;");
        }
        switch (_id[0]){
            case "years":
                clearSelectStruct();
                funcs.actions.pupil(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            case "staffmember":

                clearSelectStruct();
                //tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
               // var grid = schoolmule.instances.grid_setup_staff.getGrid().grid;
                //if(grid){
                 //   grid.selectRowById('staffmember_'+_id[1])
                //}else{
                funcs.actions.staff(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                //}
                break;
            case "staff":
                clearSelectStruct();
                //tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                funcs.actions.staff(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            case "pupilgroup":
                clearSelectStruct();
                //tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                funcs.actions.pupil(id);
                enableButton('assign_content');
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            case "pupil":
                clearSelectStruct();
                //tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                //var grid = schoolmule.instances.grid_setup_pupils.getGrid().grid;
                //if(grid){
                //   grid.selectRowById('pupil_'+_id[1])
                //}else{
                    funcs.actions.pupil(id);
                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                    return id;
                //}
                break;
            case "programme":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;

            case "pupils":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
            case "parent":
                clearSelectStruct();
                funcs.actions.parent(_id[1],_id[2]);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            /*
            case "studygroup":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
            case "objectivegroup":
                if(!ctrl){
                    tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                    tree.clearSelection(id);
                }
                break;
            case "objective":
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                funcs.actions.objective(_id[1]);
                return id;
            default:
                return null;
            */
        }
    },
    popup: [
        {
            id: "expand_all",
            label: dlang("expand_setup_menu","Expand"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["staff","pupils","staffmember","programme","years","pupilgroup","pupil"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                tree.openAllItems(id);
            }
        },
        {
            id: "collapse_all",
            label: dlang("collapse_setup_menu","Collapse"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["staff","pupils","staffmember","programme","years","pupilgroup","pupil"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                tree.closeAllItems(id);
            }
        },
        {
            id: "new_staffmember",
            label: dlang("tree_users_menu_newstaff","New staff member"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["staffmember","staff"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("staff members",addStaff, id, tree, this.server_script);
            }
        },
        {
            id: "new_programme",
            label: dlang("tree_users_menu_new_programme","New Programme"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["pupils","programme"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("programmes",addProgrammeUser, id, tree, this.server_script);
            }
        },
        {
            id: "assign_content",
            label: dlang("assign_members_menu_setup","Assign members"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["pupilgroup"],_id[0]) != -1);
            },
            action: function(id,tree,server){
                showAssignPupilToPupilGroupWindow(id,tree,server);
            }
        },
        {
            id: "new_parents",
            label: dlang("tree_users_menu_add_parents","Add parents"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["parent","pupil"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("parents",addParent, id, tree, this.server_script);
            }
        },
        {
            id: "new_startyear",
            label: dlang("tree_users_menu_new_start_year","New Start Year"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["years","programme"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("years",addYearUsers, id, tree, this.server_script);
            }
        },
        {
            id: "new_pupilgroup",
            label: dlang("tree_users_menu_new_pg","New Pupilgroup"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["years","pupilgroup"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("pupilgroups",addPupilgroup, id, tree, this.server_script);
            }
        },
        {
            id: "new_pupil",
            label: dlang("tree_users_menu_new_pupil","New Pupil"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["pupilgroup"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("pupils",addPupil, id, tree, this.server_script, 0);
            }
        },
        {
            id: "new_pupil_one",
            label: dlang("tree_users_menu_newpupil1","New pupil with 1 parent"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["pupilgroup"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("pupils",addPupil, id, tree, this.server_script, 1);
            }
        },
        {
            id: "new_pupil_second",
            label: dlang("tree_users_menu_newpupil2","New pupil with 2 parents"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["pupilgroup"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("pupils",addPupil, id, tree, this.server_script, 2);
            }
        },
        {
            id: "delete_parents",
            label: dlang("tree_users_menu_delete_parents","Delete Parents"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["pupil"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                if(tree.getSubItems(id)==""){
                    return false;
                }
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                seconfirm(dlang("delete_all_parents_confirm","Do you really want to delete all the parents for this pupil?"),function(){
                    $.post(server, {
                        action:"delete_parents",
                        pupil: id.split('_')[1]
                    }, function(res){
                        tree.smartRefreshItem(id,server);
                    },'json');
                });
            }
        },
        {
            id: "delete",
            label: dlang("tree_users_menu_delete","Delete"),
            visible: function(id,tree){
                var _id = id.split("_");
                return (_.indexOf(["pupil","pupilgroup","years","programme","parent","staffmember"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length>=1);
            },
            action: function(id, tree, server){
                deleteItemUsers(id, tree, server);
            }
        }
    ]

});

function addProgrammeUser(id, tree, server, col){

    var title = dlang("tree_users_newprogramme","Programme");

    function add_pg(name){
        $.post(server, {
            action:"add_programme",
            name:name,
            col: col
        }, function(res){
            last_defined = res;
            var strtree = schoolmule.instances.tree_programme_structure.getTree();
            var _res = res.split(',');
            for(var i=0;i<_res.length; i++){
                tree.insertNewChild('pupils', _res[i],name+_res[i].split('_')[1],null,'programme.png', 'programme.png', 'programme.png');
                strtree.insertNewChild('programmes', _res[i],name+_res[i].split('_')[1],null,'programme.png', 'programme.png', 'programme.png');
            }
            tree.selectItem(_res[0],true);
        },'json');
    }
    if(col==1){
        schoolmule.instances.tree_users.createNewItemDialog(dlang("crate_new_prog_text","Title of programme:"), title, function(item_name){
            add_pg(item_name);
        });
    }else{
        add_pg(title);
    }
}

function addYearUsers(id, tree, server, col){
    var programme;
    var _id = id.split('_');
    var year_name = (new Date()).getFullYear();
    if(col>1){
        year_name = dlang("tree_users_year","Year");
    }
    switch(_id[0]){
        case 'programme':
            programme = id;
            break;
        default:
            programme = tree.getParentId(id);
            break;
    }
    var _programme = programme.split('_');
    $.post(server, {
        action:"add_year",
        name:year_name,
        programme:_programme[1],
        col: col
    }, function(res){
        last_defined = res;
        var _res = res.split(',');
        var strtree = schoolmule.instances.tree_programme_structure.getTree();
        for(var i=0;i<_res.length; i++){
            tree.insertNewChild(programme, _res[i],year_name,null,'folder_closed.png', 'folder_closed.png', 'folder_closed.png');
            strtree.insertNewChild(programme, _res[i],year_name,null,'folder_closed.png', 'folder_closed.png', 'folder_closed.png');
        }
        tree.selectItem(_res[0],true);

    },'json');

}

function addPupilgroup(id, tree, server, col){
    var title = dlang("tree_users_newpg","new pupilgroup");
    function add_pg(name){
        var year;
        var _id = id.split('_');
        switch(_id[0]){
            case 'years':
                year = id;
                break;
            default:
                year = tree.getParentId(id);
                break;
        }
        var _year = year.split('_');
        $.post(server, {
            action: "add_pupilgroup",
            name: name,
            year: _year[1],
            col: col
        }, function(res){
            last_defined = res;
            var _res = res.split(',');
            for(var i=0;i<_res.length; i++){
                tree.insertNewChild(year, _res[i],name,null,'pupilgroup.png', 'pupilgroup.png', 'pupilgroup.png');
            }
            tree.selectItem(_res[0],true);
        },'json');
    }
    if(col==1){
        schoolmule.instances.tree_users.createNewItemDialog(dlang("crate_new_pg_text","Title of pupilgroup:"), title, function(item_name){
            add_pg(item_name);
        });
    }else{
        add_pg(title);
    }
}

function addParent(id, tree, server, col){


    var forename = dlang("forename_title","forename");
    var surname = dlang("surname_title","surname");
    function add_parent(forename,surname){
        var pupil;
        var _id = id.split('_');

        switch(_id[0]){
            case 'pupil':
                pupil = id;
                break;
            case 'parent':
                pupil = tree.getParentId(id);
                break;
        }

        var _pupil = pupil.split('_');
        $.post(server, {
            action:"add_parent",
            forename:forename,
            surname:surname,
            pupil: _pupil[1],
            col: col
        }, function(res){
            last_defined = res;
            var _res = res.split(',');
            for(var i=0;i<_res.length; i++){
                tree.insertNewChild(pupil, _res[i],forename+' '+surname,null,'parent.png', 'parent.png', 'parent.png');
            }
            tree.selectItem(_res[0],true);

        },'json');
    }
    if(col==1){
        schoolmule.instances.tree_users.createNewItemDialog(dlang("crate_new_parent_text","Parent:"), forename +" " + surname, function(item_name){
            var _item_name = item_name.split(' ',2)
            add_parent(_item_name[0],_item_name[1]);
        });
    }else{
        add_parent(forename,surname);
    }
}

function addPupil(id, tree, server, col, num){
    var forename = dlang("forename_title","forename");
    var surname = dlang("surname_title","surname");

    function add_user(forename,surname){
        var _id = id.split('_');
        var pupilgroup;
        switch(_id[0]){
            case 'pupilgroup':
                pupilgroup = id;
                break;
            case 'pupil':
                pupilgroup = tree.getParentId(id);
                break;
        }

        var _pupilgroup = pupilgroup.split('_');

        $.post(server, {
            action:"add_pupil",
            pupilgroup:_pupilgroup[1],
            stg:_pupilgroup[2],
            forename:forename,
            surname:surname,
            col: col,
            num:num
        }, function(res){
            last_defined = res;
            var _res = res.split(',');
            for(var i=0;i<_res.length; i++){
                var pupil = _res[i].split('_')[1];
                tree.insertNewChild(pupilgroup, _res[i]+'_'+_pupilgroup[1],forename+' '+surname,null,'pupil.png', 'pupil.png', 'pupil.png');
            }
            tree.smartRefreshBranch(pupilgroup,server);
            tree.selectItem(_res[0]+'_'+_pupilgroup[1],true);
        },'json');
    }

    if(col==1){
        schoolmule.instances.tree_users.createNewItemDialog(dlang("crate_new_pupil_text","Pupil:"), forename +" " + surname, function(item_name){
            var _item_name = item_name.split(' ',2)
            add_user(_item_name[0],_item_name[1]);
        });
    }else{
        add_user(forename,surname);
    }
}



function addStaff(id, tree, server, col){
    var forename = dlang("forename_title","forename");
    var surname = dlang("surname_title","surname");
    function add_stuff(forename,surname){
        var _id = id.split('_');
        $.post(server, {
            action:"add_staff",
            forename:forename,
            surname:surname,
            col: col
        }, function(res){
            last_defined = res;
            var _res = res.split(',');

            for(var i=0;i<_res.length; i++){
                tree.insertNewChild('staff', _res[i],forename+' '+surname,null,'staff.png', 'staff.png', 'staff.png');
            }

            tree.selectItem(_res[0],true);
            //$('#users').parent().scrollTo(tree._globalIdStorageFind(_res[0]).htmlNode,1000,{offset:{top:-($('#users').parent().height()/2)}});
            tree.saveSelectedItem("tree_users");


            //tree.smartRefreshItem('staff',server);
            //updateUsersGrids(tree);
        },'json');
    }
    if(col==1){
        schoolmule.instances.tree_users.createNewItemDialog(dlang("crate_new_staff_text","Title of staff member:"), forename +" " + surname, function(item_name){
            var _item_name = item_name.split(' ',2)
            add_stuff(_item_name[0],_item_name[1]);
        });
    }else{
        add_stuff(forename,surname);
    }
}

function getUsersNum(name, callback,id,tree, server, num){
    var upload_form = null;
    var uploader = null;
    var dialog = new schoolmule.controls.window_popup(
        {
            title: dlang("tree_users_pupup_creating_part1","How many")+' '+name+' '+dlang("tree_users_pupup_creating_part2","do you want to create ?"),
            width: "325px",
            height: "40px",
            buttons: [
                {
                    text:dlang("ok_button_count","Ok"),
                    click:function(){
                        callback(id, tree, server, $("#users_num").val(),num);
                        dialog.win_dialog.dialog("destroy");
                        dialog.win_dialog.remove();
                    }
                },
                {
                    text:dlang("close_button_count","Close"),
                    click:function(){
                        dialog.win_dialog.dialog("destroy");
                        dialog.win_dialog.remove();
                    }
                }
            ],

            onBeforeShow: function(container){
                var cont = $("#"+container);
                cont.parent().addClass('min_height_none');
                cont.removeClass('add-box');
                cont.append('<div><select type="text" id="users_num" value="1" style="width: 100%"></select></div>');
                var options = "";
                for(var i=1; i<35; i++){
                    options+='<option value="'+i+'">'+i+'</option>';
                }

                $('#users_num').append(options);
            }
        });
    dialog.show({
        container: "massage_box"
    });
}

function showAssignPupilToPupilGroupWindow(id,tree,server){
    $.post("connectors/connector.php?control_id=assign_pupils_window", {action:"getchecked", pupilgroup:id.split('_')[1]}, function(response){
        schoolmule.instances.assign_pupils_window.show({
            container : "add-treebox",
            check_ids:response,
            callback: function(checked){
                var pupils = Array();
                for(var i=0;i<checked.length;i++){
                    var temp = checked[i].split('_');
                    if(temp[0] == 'pupil'){
                        pupils.push(temp[1]);
                    }
                }

                var pg = id.split('_')[1];

                $.post("connectors/connector.php?control_id=assign_pupils_window", {action:"savetree", 'pupils[]':pupils, pg:pg}, function(){
                    tree.deleteChildItems(0);

                    tree.smartRefreshBranch(0,server);
                },'json');
                return true;
            }
        });
    },'json');
}

function updateUsersGrids(tree){
    var sel = tree.getSelectedItemId();
    var grid = schoolmule.instances.grid_setup_pupils.getGrid().grid;
    if(grid){
        grid.updateFromXML('connectors/connector.php?control_id=grid_setup_pupils&selected='+sel,true,true);
    }
    grid = schoolmule.instances.grid_setup_staff.getGrid().grid;
    if(grid){
        grid.updateFromXML('connectors/connector.php?control_id=grid_setup_staff&selected='+sel,true,true);
    }
}

function deleteItemUsers(id, tree ,script){
    var ids_arr = tree.getSelectedItemId().split(',');

    var del_str = Array();
    for (var i=0; i < ids_arr.length; i++) {
        del_str.push("'"+tree.getItemText(ids_arr[i])+"'");
    };
    seconfirm(dlang("tree_users_delete_popup","Do you really want to delete")+" "+del_str.join(', ')+"?",function(){
        var _id = ids_arr[0].split("_");
        $.post(script, {
            action:"delete"+'_'+_id[0],
            id: tree.getSelectedItemId()
        }, function(res){
            var idParent = tree.getParentId(id);
            var treeobj = schoolmule.instances.tree_users;
            if(tree.getSelectedItemId().indexOf(treeobj.getDetailsItem()) + 1){
                $("#overview-body").empty();
                $("#overview-body").append("<div class='no-select-tree-item-message'><div>"+dlang("deteails_no_select","Select item in navigation tree" )+"</div></div>");
                $("#overview-body").css('background-color','rgb(145, 144, 144)');
            }
            tree.smartRefreshBranch(idParent,script);
            updateUsersGrids(tree);
        });
    });

/*    seconfirm(dlang("tree_users_delete_popup","Do you really want to delete")+" '"+tree.getItemText(tree.getSelectedItemId())+"' ?",function(){
        var _id = id.split('_');
        $.post(script, {
            action:"delete"+'_'+_id[0],
            id: _id[1]
        }, function(res){
            var idParent = tree.getParentId(id);
            var treeobj = schoolmule.instances.tree_users;
            if(tree.getSelectedItemId().indexOf(treeobj.getDetailsItem()) + 1){
                $("#overview-body").empty();
                $("#overview-body").append("<div class='no-select-tree-item-message'><div>"+dlang("deteails_no_select","Select item in navigation tree" )+"</div></div>");
            }
            tree.smartRefreshBranch(idParent,script);
            updateUsersGrids(tree);
        });
    })*/
}

function clearSelectStruct(){
    if(schoolmule.instances.tree_programme_structure){
        var tree_desel = schoolmule.instances.tree_programme_structure.getTree();
        tree_desel.setItemStyle(tree_desel.getSelectedItemId(),"background-color:#fff; border:0px solid #696969; color:#666;");
        tree_desel.clearSelection();
        tree_desel.saveSelectedItem("tree_programme_structure"+"_selected");
    }
}