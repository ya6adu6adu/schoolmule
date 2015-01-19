var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};


schoolmule.instances.tree_assignments_by_studygroup = new schoolmule.controls.tree({
	control_id: "tree_assignments_by_studygroup",
	drag_mode: "complex",

    selectFirstItem:function(tree){
        var items = tree.getAllSubItems(0);
        var _items = items.split(',');
        var main_array = ["page","assignment","performance"];
        var indexes = {};
        for(var i=0; i< _items.length; i++){
            var _id = _items[i].split('_');
            if(_.indexOf(main_array,_id[0]) != -1){
                if(tree.getIndexById(_items[i])==0){
                    tree.selectItem(_items[i],true);
                    break;
                }else{
                    indexes[tree.getIndexById(_items[i])] = _items[i];
                }
            }
        }
        for(var i=0; i< indexes.length; i++){
            if(indexes[i]){
                tree.selectItem(indexes[i],true);
            }
        }


    },
    /*is it possible to drag?*/
	drag_condition: function(id, tree, treeObj){
		var _id = id.split("_");
		if(_id.length>2){
			return false;
		}

		if(_.indexOf(["assignment","performance","studygroup","page","folder"],_id[0]) == -1){
			return false;
		}
		var ids = treeObj.drag_items;
        if(!ids){
            return false;
        }
		if(ids.length > 1){
			return false;
		}
		var _id = id.split("_");
		if(tree.getLevel(id)==1 ||tree.getLevel(id)==2){
			return false;
		}else{
			return true;
		}
	},

    /*is it possible to edit?*/
	edit_condition: function(id){
		var _id = id.split("_");
		var editing_items = ['assignment','performance','room','page','element','folder'];
		for(var i=0; i<=editing_items.length;i++){
			if(editing_items[i]==_id[0]){
				return true;
			}	
		}
		return false;
	},

	/*is it possible to drop?*/
	drop_condition: function(id, tree, id_dst, tree_dst){
		var _id = id.split("_");
		var _id_dst = id_dst.split("_");
        tree.setDragBehavior('complex');
        switch (_id_dst[0]){
            case 'assignment':
                if(_.indexOf(["page","room","folder","assignment","performance"],_id[0]) != -1){
                    if(_id[0]=='assignment' || _id[0]=='performance'){
                        tree.setDragBehavior('sibling');
                    }else{
                        tree.setDragBehavior('complex');
                    }

                    return true;
                }
                break;
            case 'performance':
                if(_.indexOf(["page","room","folder","performance","assignment"],_id[0]) != -1){
                    if(_id[0]=='performance' || _id[0]=='assignment'){
                        tree.setDragBehavior('sibling');
                    }else{
                        tree.setDragBehavior('complex');
                    }
                    return true;
                }
                break;
            case 'folder':
                if(_.indexOf(["folder","room","assignement","page","assignment","performance"],_id[0]) != -1){
                    if(_id[0]=='room'){
                        tree.setDragBehavior('complex');
                    }else{
                        if(_id[0]=='folder'){
                            tree.setDragBehavior('complex');
                        }else{
                            var parent = tree.getParentId(id);
                            if(parent.split("_")[0] == 'page'){
                                return false;
                            }
                            tree.setDragBehavior('sibling');
                        }
                    }
                    return true;
                }
                break;
            case 'page':
                if(_.indexOf(["folder","room","page","assignment","performance"],_id[0]) != -1){
                    if(_id[0]=='page' || _id[0]=='assignment'|| _id[0]=='performance'){
                        tree.setDragBehavior('sibling');
                    }else{
                        tree.setDragBehavior('complex');
                    }
                    return true;
                }
                break;
            case 'studygroup':
                if(_.indexOf(["member"],_id[0]) != -1){
                    tree.setDragBehavior('child');
                    return true;
                }
                break;
        }

		return false;
	},

    /*edit tree item event*/
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
            select(tree.getSelectedItemId(),tree,funcs);
        });
        return true;
	},

    /*move tree item event*/
	onDrag: function(sid,tid,sObject,tree,lId){
        var server = schoolmule.instances.tree_assignments_by_studygroup.server_script;
        var _id = tid.split("_");
        var context = tid;
        if(!lId && _id[0]=="assignment"){
            return false;
        }
        if(_id[0]=='member'){
            moveStudygroup();
            return false;
        }

        if(lId !== null){
            var lid_par = lId.split('_')[0];
            if(lid_par=='assessment' || lid_par=='submission'|| lid_par=='assignment'|| lid_par=='performance'|| lid_par=='page'|| lid_par=='folder'){
                context = tree.getParentId(lId);
            }else{
                context = lId;
            }
        }

        this.showPopup(context,[{
                id: "duplicate",
                label: dlang("tree_assif_menu_dupl","Duplicate"),
                action: function(id, tree,server){
                    var drop_ids = this.getActiveIds();
                    var ids = [];
                    var type_id = drop_ids[0].split("_")[0];

                    for(var i=0;i<drop_ids.length;i++){
                        ids.push(drop_ids[i].split("_")[1]);
                        sid = drop_ids[i].split("_")[1];
                    }

                    if(lId!=null){
                        var lid_par = lId.split("_")[0];
                        if(lid_par=='member'){
                            tid = tree.getParentId(lId);
                            lId = tree.getItemIdByIndex(tid,tree.getIndexById(lId));
                        }else
                        if(lid_par!=type_id){
                            if(tree.getParentId(lId)==tree.getParentId(drop_ids[0])){
                                lId = tree.getItemIdByIndex(tid,tree.getIndexById(lId));
                            }else{
                                if(tree.getIndexById(lId)==0 && (lid_par=='submission' || lid_par=='assessment')){
                                    if(tree.getParentId(lId).split('_')[0]!='room'){
                                        lId = tree.getParentId(lId);
                                        tid = tree.getParentId(lId);
                                        lId = tree.getItemIdByIndex(tid,tree.getIndexById(lId)+1);
                                    }
                                }
                            }
                        }
                    }
                    studygroup_id = tid;
                    while(studygroup_id.split("_")[0]!='room'){
                        studygroup_id = tree.getParentId(studygroup_id);
                    }

                    if(type_id == 'folder' && tid.split('_')[0]=='page'){
                        return false;
                    }

                    $.post(this.server_script, {action:"movedupl_"+type_id, sid:sid, tid:tid, studygroup:studygroup_id.split('_')[1], lid:lId}, function(data){
                        response = JSON.parse(data);
                        schoolmule.controls.tree.inserted_id =_id[0]+'_'+response.id;
                        tree.smartRefreshBranch(0,server+"&refresh=1");
                    })
                }
            },
            {
                id: "move",
                label: dlang("tree_assif_menu_move","Move"),
                action: function(id, tree,server){
                    var _id = sid.split('_');
                    if((_id[0]=='assignment' || _id[0]=='performance')){
                        var room =  sid;
                        var room2 =  tid;

                        while(room.split("_")[0]!=="room"){
                            room = tree.getParentId(room);
                        }

                        while(room2.split("_")[0]!=="room"){
                            room2 = tree.getParentId(room2);
                        }

                        if(room!=room2){
                            seconfirm(dlang("move_duplicate_assign_confirm","When you move or duplicate an assignment or performance from one Course room to another, all assigned objectives of the assignm./perf. will be changed to all objectives in the new Studygroup(s)."),
                                moveElement
                            );
                        }else{
                            moveElement();
                        }
                    }else{
                        moveElement();
                    }
                }
            },
            {
                id: "cancel",
                label: dlang("tree_assif_menu_cancel","Cancel"),
                action: function(id, tree){
                }
            }]
        );

        function moveElement(afterMove){
            var drop_ids = sid.split(',');
            var ids = [];
            var type_id = drop_ids[0].split("_")[0];

            for(var i=0;i<drop_ids.length;i++){
                ids.push(drop_ids[i].split("_")[1]);
                sid = drop_ids[i].split("_")[1];
            }
            var studygroup_id;
            var p_folder;
            var _id = tid.split("_");

            if(lId!=null){
                var lid_par = lId.split("_")[0];
                if(lid_par=='member'){
                    tid = tree.getParentId(lId);
                    lId = tree.getItemIdByIndex(tid,tree.getIndexById(lId));
                }else
                if(lid_par!=type_id){
                    if(tree.getParentId(lId)==tree.getParentId(drop_ids[0])){
                        lId = tree.getItemIdByIndex(tid,tree.getIndexById(lId));
                    }else{
                        if(tree.getIndexById(lId)==0 && (lid_par=='submission' || lid_par=='assessment')){
                            if(tree.getParentId(lId).split('_')[0]!='room'){
                                lId = tree.getParentId(lId);
                                tid = tree.getParentId(lId);
                                lId = tree.getItemIdByIndex(tid,tree.getIndexById(lId)+1);
                            }
                        }
                    }
                }
            }
            studygroup_id = tid;
            while(studygroup_id.split("_")[0]!='room'){
                studygroup_id = tree.getParentId(studygroup_id);
            }

            if(type_id == 'folder' && tid.split('_')[0]=='page'){
                var page = tid;
                tid = tree.getParentId(tid);
                lId = tree.getItemIdByIndex(tid,tree.getIndexById(page)+1);

            }
            $.post(server, {action:"move_"+type_id, sid:sid, tid:tid, studygroup:studygroup_id.split('_')[1], lid:lId}, function(data){
                if(afterMove){
                    afterMove();
                }else{
                   for(var i =0;i<drop_ids.length;i++){
                        sObject.deleteItem(drop_ids[i],false);
                    }
                    tree.deleteChildItems(tid);
                    tree.smartRefreshItem(tid,server);
                    tree.sortTree(0, 'ASC', true);
                }
            })
        }

        function moveStudygroup(){
            seconfirm(dlang("move_studygroup_text_confrim","This Studygroup is assigned to another Course room already. Do you really want to move the Studygroup and assign it to this Course room instead ? All Assignments and performances will move to the new Course room also."),
                function(){
                    moveElement(function(){
                        tree.deleteChildItems(0);
                        tree.smartRefreshItem(0,server+"&refresh=1");
                        //tree.smartRefreshBranch(tree.getParentId(tree.getParentId(tid)),server+"&refresh=1");
                    });
                },
                function(){

                }
            );
        }

        return false;
    },

	select_mode:true,
	multiselect:true,
	editable:true,
	checkMenu: function(id){
		var _id = id.split("_");
		return (_.indexOf(["studygroup","assignment","performance","folder","page","room","subject","member"],_id[0]) != -1);
	},
	select: function(id,tree,funcs,prev){
		if(schoolmule.instances.tree_assignments_by_status){
			var tree_desel = schoolmule.instances.tree_assignments_by_status.getTree();
			tree_desel.setItemStyle(tree_desel.getSelectedItemId(),"background-color:transparent; border:0px solid #696969; color:#666;");
            tree_desel.clearSelection();
            tree_desel.saveSelectedItem('tree_assignments_by_status_selected');
		}
		if(prev){
			tree.setItemStyle(prev,"border:0; background-color:transparent; color:#666;");
		}
		var _id = id.split("_");
		switch (_id[0]){
            case "academicyear":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "folder":
                //tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "member":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "pupilgroup":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "pupil":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "teachers":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                ///tree.clearSelection(id);
                break;
            case "staffmember":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "pupils":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "member":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "room":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "subject":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "studygroup":
                //tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                //tree.clearSelection(id);
                break;
            case "mystg":
				tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
				break;
			case "assignment":
                if(_id.length == 4 && _id[2]=='link'){
                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                    funcs.actions.assignment(_id[3]);
                }else{
                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                    funcs.actions.assignment(_id[1],_id[2]);
                }
				return id;
            case "page":
                tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                funcs.actions.page(_id[1],_id[2]);
                return id;
			case "submission":
                if(_id.length == 4 && _id[2]=='link'){
                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                    funcs.actions.submission(_id[3]);
                }else{

                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                    funcs.actions.submission(_id[1],_id[2]);
                }
				return id;
			case "performance":
                if(_id.length == 4 && _id[2]=='link'){
                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                    funcs.actions.performance(_id[3]);
                }else{
                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                    funcs.actions.performance(_id[1],_id[2]);
                }
				return id;
			case "assessment":
                if(_id.length == 4 && _id[2]=='link'){
                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                    funcs.actions.assessment(_id[3]);
                }else{
                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                    funcs.actions.assessment(_id[1],_id[2]);
                }

				return id;
			default:
				return null;
				break;
		}
	},
	load:function(tree){
		var hashValues = Hash.get();
        /*tree.openAllItems();*/
		if(hashValues.itemtype && hashValues.itemtype=="assignment"){
            tree.selectItem('assignment_'+hashValues.itemid,true);
            Hash.remove('itemtype');
            Hash.remove('itemid');
            Hash.remove('search');
		}else if(hashValues.itemtype && hashValues.itemtype=='performance'){
            tree.selectItem('performance_'+hashValues.itemid,true);
            Hash.remove('itemtype');
            Hash.remove('itemid');
            Hash.remove('search');
		}else if(hashValues.itemtype && hashValues.itemtype=='submission'){
            tree.selectItem('submission_'+hashValues.itemid,true);
            Hash.remove('itemtype');
            Hash.remove('itemid');
            Hash.remove('search');
        }else if(hashValues.itemtype && hashValues.itemtype=='assessment'){
            tree.selectItem('assessment_'+hashValues.itemid,true);
            Hash.remove('itemtype');
            Hash.remove('itemid');
            Hash.remove('search');
        }else if(hashValues.itemtype && hashValues.itemtype=='page'){
            tree.selectItem('page_'+hashValues.itemid,true);
            Hash.remove('itemtype');
            Hash.remove('itemid');
            Hash.remove('search');
        }
        else{
			tree.openItem("mystg");
		}
	},
	
	popup: [{	
			id: "new",
			label: dlang("tree_assif_menu_newa","New assignment"),
			visible: function(id, tree){
				var _id = id.split("_");
				return (_.indexOf(["room","page","folder"],_id[0]) != -1);
			},
			enabled: function(id, tree){
                var chaild_num = null;
                var _id = id.split('_');
                var members = null;
                if(_.indexOf(["room","page","folder"],_id[0]) == -1){
                    return false;
                }
                while(_id[0]!='room'){
                    id = tree.getParentId(id);
                    _id = id.split('_');
                }
                chaild_num = tree.hasChildren(id);
                members = tree.getItemIdByIndex(id,chaild_num-1);
                if(tree.hasChildren(members)==0){
                    return false;
                }
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id,tree,server){
                this.createNewItemDialog(dlang("crate_new_assignment_text","Title of assignment:"), dlang("new_assignment_text","new assignment"), function(item_name){
                    var _id = id.split("_");
                    var room_id;
                    var page_id;
                    var folder_id;
                    var parent;

                    if(_id[0]==="room"){
                        room_id = _id[1];
                        page_id = 0;
                        parent = id;
                    }else{
                        parent = tree.getParentId(id);
                        if(parent.split("_")[0] === "folder"){
                            page_id = parent.split("_")[1];
                            while(parent.split("_")[0]!=="room"){
                                parent = tree.getParentId(parent);
                            }
                            room_id = parent.split("_")[1];
                        } else if(parent.split("_")[0]==="room"){
                            room_id = parent.split("_")[1];
                        }
                        if(_id[0]==="page"){
                            page_id = _id[1];
                            folder_id = 0;
                        }
                        if(_id[0]==="folder"){
                            page_id = 0;
                            folder_id = _id[1];
                        }
                    }

                    $.post(server, {action:"new_assignment", page:page_id, id:room_id, folder:folder_id,item_name:item_name}, function(data){
                        tree.selectItem(data.id,false);
                        tree.saveSelectedItem("tree_assignments_by_studygroup");
                        //tree.deleteChildItems(id);
                        schoolmule.controls.tree.inserted_id = data.id;
                        tree.smartRefreshBranch(0,server);
                    },'json')
                });
			}
		},
		{	
			id: "newperf",
			label: dlang("tree_assif_menu_newp","New performance"),
			visible: function(id, tree){
				var _id = id.split("_");
				return (_.indexOf(["room","page","folder"],_id[0]) != -1);
			},
			enabled: function(id, tree){
                var chaild_num = null;
                var _id = id.split('_');
                var members = null;
                if(_.indexOf(["room","page","folder"],_id[0]) == -1){
                    return false;
                }
                while(_id[0]!='room'){
                    id = tree.getParentId(id);
                    _id = id.split('_');
                }
                chaild_num = tree.hasChildren(id);
                members = tree.getItemIdByIndex(id,chaild_num-1);
                if(tree.hasChildren(members)==0){
                    return false;
                }
                return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id,tree,server){
                this.createNewItemDialog(dlang("crate_new_performance_text","Title of performance:"), dlang("new_performance_text","new performance"), function(item_name){
                    var _id = id.split("_");
                    var room_id;
                    var page_id;
                    var folder_id;
                    var parent;
                    if(_id[0]==="room"){
                        room_id = _id[1];
                        page_id = 0;
                        parent = id;
                    }else{
                        parent = tree.getParentId(id);
                        if(parent.split("_")[0] === "folder"){
                            page_id = parent.split("_")[1];
                            while(parent.split("_")[0]!=="room"){
                                parent = tree.getParentId(parent);
                            }
                            room_id = parent.split("_")[1];
                        } else if(parent.split("_")[0]==="room"){
                            room_id = parent.split("_")[1];
                        }
                        if(_id[0]==="page"){
                            page_id = _id[1];
                            folder_id = 0;
                        }
                        if(_id[0]==="folder"){
                            page_id = 0;
                            folder_id = _id[1];
                        }
                    }

                    $.post(server, {action:"new_performance", page:page_id, folder:folder_id, id:room_id,item_name:item_name}, function(data){
                        schoolmule.controls.tree.inserted_id = data.id;
                        tree.smartRefreshBranch(0,server);
                    },'json')
                });


			}
		},
        {
            id: "newpage",
            label: dlang("tree_assif_menu_newpage","New page"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["room","folder"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                this.createNewItemDialog(dlang("crate_new_page_text","Title of page:"), dlang("new_page_text","new page"), function(item_name){
                    var _id = id.split("_");
                    var room_id;
                    var p_folder;
                    if(_id[0]==="room"){
                        room_id = _id[1];
                        p_folder = 0;
                    }else {
                        var parent = tree.getParentId(id);
                        if(parent.split("_")[0]==="folder"){
                            p_folder = parent.split("_")[1];
                            while(parent.split("_")[0]!=="room"){
                                parent = tree.getParentId(parent);
                            }
                            room_id = parent.split("_")[1];
                        } else if(parent.split("_")[0]==="room"){
                            room_id = parent.split("_")[1];
                            p_folder = _id[1];
                        }
                        p_folder = _id[1];
                    }

                    $.post(server, {action:'new_page',room_id:room_id,p_folder:p_folder,item_name:item_name}, function(data){
                        schoolmule.controls.tree.inserted_id = data.id;
                        tree.smartRefreshBranch(0,server);
                    },'json')
                })
            }
        },
        {
            id: "assign_content",
            label: dlang("assign_members_menu","Assign members"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["member"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                $.post("connectors/connector.php?control_id=assign_stgs_window", {action:"getchecked", member:id.split('_')[1]}, function(response){
                    schoolmule.instances.assign_stgs_window.show({
                        container : "add-treebox",
                        check_ids:response,
                        callback: function(checked){
                            seconfirm(dlang("move_studygroup_text_confrim2","The Studygroup you want to assign to this Course room is already assigned to another course room. Do you want to move it to this new Course room ? If so, all assignments and performances will also be moved to the new Course room."),
                                function(){
                                    var stgs = Array();
                                    for(var i=0;i<checked.length;i++){
                                        var temp = checked[i].split('_');
                                        stgs.push(temp[1]);
                                    }

                                    var room = tree.getParentId(id).split('_')[1];
                                    schoolmule.instances.assign_stgs_window.hide();
                                    $.post("connectors/connector.php?control_id=assign_stgs_window", {action:"savetree", 'stgs[]':stgs, room:room}, function(){
                                        tree.deleteChildItems(0);
                                        tree.smartRefreshBranch(0,server);
                                    },'json');
                                    return true;
                                }
                            );
                        }
                    });
                },'json');
            }
        },
        {
            id: "remove_studygroup",
            label: dlang("remove_studygroup_menu","Remove"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["studygroup"],_id[0]) != -1);
            },
            action: function(id,tree,server){
                var _id = id.split("_");
                var script = this.server_script;
                $.post(script, {action:'removestg',stg:_id[1],remove:false}, function(data){
                    if(data.remove != 'true'){
                        seconfirm(dlang("remove_stg_grom_room_confitm","It studygroup has assigments or perfformances connected to it. You really want to remove this studygroup?"),function(){
                            $.post(script, {action:'removestg',stg:_id[1],remove:true}, function(data){
                                if(data =="{'remove':'false'}"){
                                    alert(dlang("last_stg_alert","Cannot remove all studygroups!"))
                                }else{
                                    tree.smartRefreshBranch(0,server+"&refresh=1");
                                }
                            },'json')
                        })
                    }else{
                        tree.smartRefreshBranch(0,server+"&refresh=1");
                    }

                },'json')
            }
        },
        {
            id: "newfolder",
            label: dlang("tree_assif_menu_newfolder","New folder"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["room","folder"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                var _id = id.split("_");
                var room_id;
                var p_folder;
                if(_id[0]==="room"){
                    room_id = _id[1];
                    p_folder = 0;
                }else {
                    var parent = tree.getParentId(id);
                    if(parent.split("_")[0]==="folder"){
                        p_folder = parent.split("_")[1];
                        while(parent.split("_")[0]!=="room"){
                            parent = tree.getParentId(parent);
                        }
                        room_id = parent.split("_")[1];
                    } else if(parent.split("_")[0]==="room"){
                        room_id = parent.split("_")[1];
                    }
                    p_folder = _id[1];
                }

                $.post(this.server_script, {action:'new_folder',room_id:room_id,p_folder:p_folder = p_folder}, function(data){
                    tree.selectItem(data.id,false);
                    tree.saveSelectedItem("tree_assignments_by_studygroup");
                    //tree.deleteChildItems(id);
                    schoolmule.controls.tree.inserted_id = data.id;
                    tree.smartRefreshBranch(0,server);
                },'json');
            }
        },
        {
            id: "newcourseroom",
            label: dlang("tree_assif_menu_newroom","New Course room"),
            visible: function(id, tree){
                var _id = id.split("_");
                return (_.indexOf(["subject"],_id[0]) != -1);
            },
            enabled: function(id, tree){
                return (tree.getSelectedItemId().split(',').length==1);
            },
            action: function(id,tree,server){
                var _id = id.split("_");
                $.post(this.server_script, {action:'new_room',subject_id:_id[1]}, function(data){
                    response = JSON.parse(data);
                    tree.smartRefreshItem(id,server+"&refresh=1");
                })
            }
        },
		/*
		{	
			id: "newnotpublic",
			label: "New not public performance",
			visible: function(id, tree){
				var _id = id.split("_");
				return (_.indexOf(["studygroup","performance","assignment"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id,tree,server){
				var _id = id.split("_");
				if(_id[0]=='studygroup'){
					parent = _id[1];
					parentnode = id;
				}else{
					var temp = tree.getParentId(id);
					parentnode = temp;
					parent = temp.split("_")[1];				
				}
				$.post(this.server_script, {action:"new_performancenp",id:parent}, function(data){
					response = JSON.parse(data);
					tree.deleteChildItems(parentnode);
					tree.smartRefreshItem(parentnode,server+"&refresh=1");				
				})
			}
		},
		*/
		{
			id: "duplicate",
			label: dlang("tree_assif_menu_dupl","Duplicate"),
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["assignment","performance","folder","page","room"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id, tree,server){
				var _id = id.split("_");
				$.post(this.server_script, {action:'duplicate_'+_id[0],id:_id[1]}, function(data){
					response = JSON.parse(data);
					var idParent = tree.getParentId(response.idc);
                    schoolmule.controls.tree.inserted_id = _id[0]+'_'+response.id;
					tree.smartRefreshBranch(0,server+"&refresh=1");
				})
			}
		},
		/*
		{
			id: "share",
			label: "Share",
			visible: function(id,tree){			
				var _id = id.split("_");
				return (_.indexOf(["assignment","performance"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id, tree){
				var _id = id.split("_");
				$.post(this.server_script, {action:'share_'+_id[0],id:_id[1]}, function(data){
					//alert(data.message);						
				},"json")
			}
		},{
			id: "private",
			label: "Make private",
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["assignment","performance"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id, tree){
				var _id = id.split("_");
				$.post(this.server_script, {action:'private_'+_id[0],id:_id[1]}, function(data){
					//alert(data.message);						
				},"json")
			}
		},
		*/
		{
			id: "delete",
			label: dlang("tree_assif_menu_delete","Delete"),
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["assignment","performance","page","folder","room"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length>=1);
			},
			action: function(id, tree, server){
				var ids_arr = tree.getSelectedItemId().split(',');
				var del_str = Array();
				for (var i=0; i < ids_arr.length; i++) {
					del_str.push("'"+tree.getItemText(ids_arr[i])+"'"); 
				};
				//var stgs = tree.getUserData(id,"stgs").split(',');
                seconfirm(dlang("tree_assign_popup_del","Do you really want to delete")+" "+del_str.join(', ')+"?",function(){
                    var _id = ids_arr[0].split("_");
                    var _id = id.split('_');
                    var item = tree.getSelectedItemId();
                    //if(_id.length === 3){
/*                        $.post(server, {action:'deletefromstg_'+_id[0],assignment:_id[1],stg:_id[2],type:_id[0]}, function(data){
                            tree.smartRefreshBranch(tree.getParentId(id),"connectors/connector.php?control_id=tree_assignments_by_studygroup&refresh=1");
                            $("#overview-body").empty();
                            $("#overview-body").append("<div class='no-select-tree-item-message'><div>Select item in navigation tree</div></div>");
                            $("#main-content").css('background-color','rgb(145, 144, 144)');
                        });*/
                    //}else{
                        $.post(server, {action:'delete_'+_id[0],id:tree.getSelectedItemId()}, function(data){
                            //tree.smartRefreshBranch(0,"connectors/connector.php?control_id=tree_assignments_by_studygroup&refresh=1");

                            var treeobj = schoolmule.instances.tree_assignments_by_studygroup;

                            if(item.indexOf(treeobj.getDetailsItem()) + 1){
                                $("#overview-body").empty();
                                $("#overview-body").append("<div class='no-select-tree-item-message'><div>"+dlang("deteails_no_select","Select item in navigation tree")+"</div><div>");
                                $("#overview-body").css('background-color','rgb(145, 144, 144)');
                            }

                            var idParent = tree.getParentId(id);
                            tree.smartRefreshItem(idParent,server+"&refresh=1");
                            /*
                            var treeobj = schoolmule.instances.tree_assignments_by_studygroup;
                            if(tree.getSelectedItemId().indexOf(treeobj.getDetailsItem()) + 1){
                                $("#overview-body").empty();
                                $("#overview-body").append("<div class='no-select-tree-item-message'><div>Select item in navigation tree</div></div>");
                                $("#main-content").css('background-color','rgb(145, 144, 144)');
                            }
                            var idParent = tree.getParentId(id);
                            tree.smartRefreshItem(idParent,server+"&refresh=1");

                            for(var i=0; i < tree.hasChildren('mystg'); i++){
                                var citem = tree.getChildItemIdByIndex("mystg",i);
                                var _citem = citem.split('_');
                                if(citem==idParent){
                                    tree.deleteChildItems(citem);
                                    tree.smartRefreshItem(citem,"connectors/connector.php?control_id=tree_assignments_by_studygroup&refresh=1");
                                }else{
                                    if(tree.getIndexById(id+'_'+_citem[1])>=0){
                                        if(_.indexOf(stgs,_citem[1]) != -1){
                                            tree.deleteChildItems(citem);
                                            tree.smartRefreshItem(citem,"connectors/connector.php?control_id=tree_assignments_by_studygroup&refresh=1");
                                        }
                                    }
                                }
                            };
                            */
                        });
                    //}
                });
			}
		}
		]

});

