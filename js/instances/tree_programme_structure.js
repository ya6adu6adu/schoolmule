var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.tree_programme_structure = new schoolmule.controls.tree({
    control_id: "tree_programme_structure",
    drag_mode: "complex",

    drag_condition: function(id, tree, treeObj){
        var _id = id.split("_");
        if(_.indexOf(["objectivegroup","objective"],_id[0]) == -1){
            return false;
        }
        var ids = treeObj.drag_items;
        if(ids.length && ids.length > 1){
            return false;
        }
        var _id = id.split("_");
        if(tree.getLevel(id)==1 ||tree.getLevel(id)==2){
            return false;
        }else if(_id[0]==="submission"){
            return false;
        } else {
            return true;
        }
    },

    edit_condition: function(id){
        var _id = id.split("_");
        var editing_items = ['studygroup','academicyear','subject'];
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
        if((_id_dst[0]=='staffmember' && _id[0]=='teachers')||(_id_dst[0]=='pupilgroup' && _id[0]=='pupils')){
            return true;
        }
        return false;
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
        var _id = id.split("_");
        if(_id[0]=='academicyear'){
            var myRe = /(\d{4})(\/)(\d{4})/g;
            if(value.match(myRe) == null || value.length!=9){
                return false;
            }else{
                var val = value.split('/');
                if(parseInt(val[0]) != parseInt(val[1])-1){
                    return false;
                }
            }
        }

        tree.setItemStyle(id,"font-weight:bold;");
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
            select(tree.getSelectedItemId(),tree,funcs);
        },'json')
        return true;
    },
    onDrag: function(sid,tid,sObject,tObject,lId){
        var _id = tid.split("_");
        this.showPopup(tid,[
            {
            id: "move",
            label: dlang("Move"),
            action: function(id, tree, server){
                var _sid = sid.split("_");
                $.post(server, {action:"movein_"+_id[0], studygroup:_id[1], item:_sid[1]}, function(data){
                    tObject.smartRefreshBranch(tid,server);
                },'json');
            }
        },{
            id: "cancel",
            label: dlang("Cancel"),
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
            tree.setItemStyle(prev,"border:0; background-color: transparent; color:#666;");
        }
        switch (_id[0]){
            case  "studygroup":
                clearSelectUsers();
                funcs.actions.studygroups(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break
            case "subject":
                clearSelectUsers();
                funcs.actions.year(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            case "staffmember":
                clearSelectUsers();
                funcs.actions.staff(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            case "teachers":
                clearSelectUsers();
                funcs.actions.staff(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            case "staff":
                clearSelectUsers();
                funcs.actions.staff(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            case "pupilgroup":
                clearSelectUsers();
                funcs.actions.pupil(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            case "pupils":
                clearSelectUsers();
                funcs.actions.pupil(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            case "pupil":
                clearSelectUsers();
                //tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                //var grid = schoolmule.instances.grid_setup_pupils.getGrid().grid;
                //if(grid){
                //    grid.selectRowById('pupil_'+_id[1])
               // }else{
                funcs.actions.pupil(id);
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                return id;
                break;
            case "programmes":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "programme":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "academicyear":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "academicyears":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
        }
    },
    popup: [
        {
            id: "assign_content",
            label: dlang("assign_content_menu","Assign content"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["studygroup","teachers","pupils"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                var stg = id.split('_')[1];
                $.post("connectors/connector.php?control_id=tree_setup_window", {action:"getchecked", studygroup:stg}, function(response){
                    schoolmule.instances.window_setup_tree.show({
                        container : "add-treebox",
                        check_ids:response,
                        callback: function(checked){
                            var staff = Array();
                            var pupilgroups = Array();
                            for(var i=0;i<checked.length;i++){
                                var temp = checked[i].split('_');
                                if(temp[0]=='staffmember'){
                                    staff.push(temp[1]);
                                }
                                if(temp[0]=='pupilgroup'){
                                    pupilgroups.push(temp[1]);
                                }
                            }
                            if(staff.length==0 && pupilgroups.length==0){
                                return false;
                            }
                            $.post("connectors/connector.php?control_id=tree_setup_window", {action:"savetree", 'idss[]':staff, 'idsp[]':pupilgroups, studygroup:stg}, function(){
                                tree.smartRefreshBranch('studygroup_'+stg,"connectors/connector.php?control_id=tree_programme_structure");
                            },'json');
                            return true;
                        }
                    });
                },'json');
            }
        },
        {
            id: "expand_all",
            label: dlang("expand_setup_menu","Expand"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["academicyears","academicyear","subject","studygroup","teachers","pupils","pupilgroup"],_id[0]) != -1);
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
                return (_.indexOf(["academicyears","academicyear","subject","studygroup","teachers","pupils","pupilgroup"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                tree.closeAllItems(id);
            }
        },
        {
            id: "new_subject",
            label: dlang("new_subjec","New Subject"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["academicyear","subject"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("subjects",addSubject, id, tree, this.server_script);
            }
        },
        {
            id: "new_academicyear",
            label: dlang("new_academic_year","New Academic Year"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["academicyears"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("academicyears",addAcademicYear, id, tree, this.server_script);
            }
        },
        {
            id: "new_programme",
            label: dlang("new_programme","New Programme"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["programmes","programme"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("programmes",addProgramme, id, tree, this.server_script);
            }
        },
        {
            id: "new_startyear",
            label: dlang("new_start_year","New Start Year"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["years","programme"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("years",addYear, id, tree, this.server_script);
            }
        },
        {
            id: "new_stydygroup",
            label: dlang("new_studygroup","New Studygroup"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["subject","studygroup"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                getUsersNum("studygroups",addStudygroup, id, tree, this.server_script);
            }
        },
        {
            id: "delete",
            label: dlang("remove_item_structure","Delete"),
            visible: function(id,tree){
                var _id = id.split("_");
                return (_.indexOf(["studygroup","subject","academicyear"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length>=1);
            },
            action: function(id, tree, server){
                deleteItemStructure(id, tree, server);
            }
        }
    ]

});
function addSubject(id, tree, server, col){
    var title = dlang("new_subject_title","new subject");
    function add_subject(name){
        var _id = id.split('_');
        var acyear = null;
        switch(_id[0]){
            case 'academicyear':
                acyear = id;
                break;
            default:
                acyear = tree.getParentId(id);
                break;
        }
        var _acyear = acyear.split('_');
        $.post(server, {
            action:"add_subject",
            name:name,
            academicyear:_acyear[1],
            col: col
        }, function(res){
            last_defined = res;
            var _res = res.split(',');
            for(var i=0;i<_res.length; i++){
                tree.insertNewChild(acyear, _res[i],name,null, 'subject_opened.png', 'subject_closed.png', 'subject_opened.png');
            }
            tree.selectItem(_res[0],true);
            $('#programme_structure').parent().scrollTo(tree._globalIdStorageFind(_res[0]).htmlNode,1000,{offset:{top:-($('#programme_structure').parent().height()/2)}});
            tree.saveSelectedItem("tree_programme_structure");
            //tree.smartRefreshItem('pupils',server);
        },'json');
    }
    if(col==1){
        schoolmule.instances.tree_users.createNewItemDialog(dlang("crate_new_subject_text","Title of subject:"), title, function(item_name){
            add_subject(item_name);
        });
    }else{
        add_subject(title);
    }
}

function addAcademicYear(id, tree, server, col){
    var year_name = (new Date()).getFullYear()+'/'+((new Date()).getFullYear()+1);
    if(col>1){
        year_name = dlang("new_acyear_title","Academic Year");
    }

    $.post(server, {
        action:"add_academicyear",
        name:year_name,
        col: col
    }, function(res){
        last_defined = res;
        var _res = res.split(',');
        for(var i=0;i<_res.length; i++){
            tree.insertNewChild('academicyears', _res[i],year_name,null,'folder_open.png', 'folder_closed.png', 'folder_open.png');
        }

        tree.selectItem(_res[0],true);
        $('#programme_structure').parent().scrollTo(tree._globalIdStorageFind(_res[0]).htmlNode,1000,{offset:{top:-($('#programme_structure').parent().height()/2)}});
        tree.saveSelectedItem("tree_programme_structure");
        //tree.smartRefreshItem('pupils',server);
    },'json');
}

function addProgramme(id, tree, server, col){
    $.post(server, {
        action:"add_programme",
        name:dlang("new_programe_title","new programme"),
        col: col
    }, function(res){
        last_defined = res;

        var _res = res.split(',');
        for(var i=0;i<_res.length; i++){
            tree.insertNewChild('programmes', _res[i],dlang("new_programe_title","new programme"),null,'programme.png', 'programme.png', 'programme.png');
        }
        tree.selectItem(_res[0],true);
        $('#programme_structure').parent().scrollTo(tree._globalIdStorageFind(_res[0]).htmlNode,1000,{offset:{top:-($('#programme_structure').parent().height()/2)}});
        tree.saveSelectedItem("tree_programme_structure");
        //tree.smartRefreshItem('pupils',server);
    },'json');
}

function addYear(id, tree, server, col){
    var programme;
    var _id = id.split('_');
    var year_name = (new Date()).getFullYear();
    if(col>1){
        year_name = dlang("new_year_title","Year");
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
        for(var i=0;i<_res.length; i++){
            tree.insertNewChild(programme, _res[i],year_name,null,'folder_closed.png', 'folder_closed.png', 'folder_closed.png');
        }
        tree.selectItem(_res[0],true);
       // $('#programme_structure').parent().scrollTo(tree._globalIdStorageFind(_res[0]).htmlNode,1000,{offset:{top:-($('#programme_structure').parent().height()/2)}});
        tree.saveSelectedItem("tree_programme_structure");
    },'json');
}

function addStudygroup(id, tree, server, col){
    var title = dlang("new_stg_title","new studygroup");
    function add_stg(name){
        var subject;
        var year;
        var _id = id.split('_');
        switch(_id[0]){
            case 'subject':
                subject = id;
                break;
            default:
                subject = tree.getParentId(year);
                break;
        }
        var _subject = subject.split('_');
        $.post(server, {
            action:"add_studygroup",
            name:name,
            subject: _subject[1],
            col: col
        }, function(res){
            last_defined = res;
            var _res = res.split(',');
            for(var i=0;i<_res.length; i++){
                tree.insertNewChild(subject, _res[i],name,null,'studygroup.png', 'studygroup.png', 'studygroup.png');
                var stg = _res[i].split('_');
                /*            tree.insertNewChild(_res[i],'teachers_'+stg[1],dlang("tree_pr_str_acc_teachers","Teachers"),null,'folder_open.png', 'folder_closed.png', 'folder_open.png');
                 tree.insertNewChild(_res[i], 'pupils_'+stg[1],dlang("tree_pr_str_acc_pgs","Pupilgroups"),null,'folder_open.png', 'folder_closed.png', 'folder_open.png');*/
            }
            tree.selectItem(_res[0],true);
            //$('#programme_structure').parent().scrollTo(tree._globalIdStorageFind(_res[0]).htmlNode,1000,{offset:{top:-($('#programme_structure').parent().height()/2)}});
            tree.saveSelectedItem("tree_programme_structure");
            //tree.smartRefreshBranch(tree.getParentId(id),server);
            //refreshStructureGrids(tree);
        },'json');
    }
    if(col==1){
        schoolmule.instances.tree_users.createNewItemDialog(dlang("crate_new_stg_text","Title of studygroup:"), title, function(item_name){
            add_stg(item_name);
        });
    }else{
        add_stg(title);
    }


}

function deleteItemStructure(id, tree ,script){
    var ids_arr = tree.getSelectedItemId().split(',');

    var del_str = Array();
    for (var i=0; i < ids_arr.length; i++) {
        del_str.push("'"+tree.getItemText(ids_arr[i])+"'");
    };
    seconfirm(dlang("tree_progstr_delete_popup","Do you really want to delete")+" "+del_str.join(', ')+"?",function(){
        var _id = ids_arr[0].split("_");
        $.post(script, {
            action:"delete"+'_'+_id[0],
            id: tree.getSelectedItemId()
        }, function(res){
            var idParent = tree.getParentId(id);
            var treeobj = schoolmule.instances.tree_programme_structure;
            if(tree.getSelectedItemId().indexOf(treeobj.getDetailsItem()) + 1){
                $("#overview-body").empty();
                $("#overview-body").append("<div class='no-select-tree-item-message'><div>"+dlang("deteails_no_select","Select item in navigation tree" )+"</div></div>");
                $("#overview-body").css('background-color','rgb(145, 144, 144)');
            }
            tree.smartRefreshBranch(idParent,script);
            refreshStructureGrids(tree);
        });
    });
}

function refreshStructureGrids(tree){
    var sel = tree.getSelectedItemId();
    var grid = schoolmule.instances.grid_setup_pupils_stg.getGrid().grid;
    if(grid){
        grid.updateFromXML('connectors/connector.php?control_id=grid_setup_pupils_stg&selected='+sel,true,true);
    }
    grid = schoolmule.instances.grid_setup_staff.getGrid().grid;
    if(grid){
        grid.updateFromXML('connectors/connector.php?control_id=grid_setup_staff&selected='+sel,true,true);
    }
    grid = schoolmule.instances.grid_setup_studygroups.getGrid().grid;
    if(grid){
        grid.updateFromXML('connectors/connector.php?control_id=grid_setup_studygroups&selected='+sel,true,true);
    }
}

function clearSelectUsers(){
    if(schoolmule.instances.tree_users){
        var tree_desel = schoolmule.instances.tree_users.getTree();
        tree_desel.setItemStyle(tree_desel.getSelectedItemId(),"background-color: transparent; border:0px solid #696969; color:#666;");
        tree_desel.clearSelection();
        tree_desel.saveSelectedItem("tree_users"+"_selected");
    }
}