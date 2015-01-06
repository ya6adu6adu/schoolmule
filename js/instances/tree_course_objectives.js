var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.tree_course_objectives = new schoolmule.controls.tree({
	control_id: "tree_course_objectives",
	drag_mode: "complex",
    selectFirstItem:function(tree){
        var items = tree.getAllSubItems(0);
        var _items = items.split(',');
        var main_array = ["objective"];
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
        if(hashValues.objective){
            tree.selectItem('objective_'+hashValues.objective,false);
            Hash.remove('objective');
            Hash.remove('search');
        }

        var items = tree.getAllSubItems(0).split(',');
        for(var i=0; i<items.length;i++){
            var item = items[i].split('_');
            if(item[0]=='studygroup'){
                var weight = tree.getUserData(items[i],'weight');
                tree.setItemText(items[i],tree.getItemText(items[i])+' ('+weight+'%)');
            }
        }
	},

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
		var editing_items = ['objectivegroup','objective'];
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
		
		var idParent = tree.getParentId(id_dst);
		var _idParent = idParent.split("_");
        if(_id[0]=='objective'){
            tree.setDragBehavior('sibling');
        }
		if(_.indexOf([_idParent[0]],_id[0]) != -1){
			return true;
		}
		
		if(_.indexOf([_id_dst[0]],_id[0]) != -1){
			tree.setItemStyle(id,"background-color:#fff; color:#666;");
			return true;
		}
		return false;
		
	},
    onEditStart: function(id,value,tree){
        //tree.setItemText(id,'qwd');
        var curr = $(tree._globalIdStorageFind(id).htmlNode).find('input.intreeeditRow').val();
        var name = curr.split(' (')[0];
        $(tree._globalIdStorageFind(id).htmlNode).find('input.intreeeditRow').val(name);
        return true;
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
            if(_id[0]=='objective'){
                tree.setItemText(id,value+' ('+$('#course_objectives_weight span').text()+')');
                select(tree.getSelectedItemId(),tree,funcs);
            }

        });
        return true;
	},
	onDrag: function(sid,tid,sObject,tObject,lId){
				var _id = tid.split("_");
				if(!lId && _id[0]=="objective"){
					return false;
				}
				this.showPopup(tid,[{
						id: "duplicate",
						label: dlang("tree_objective_menu_dupl","Duplicate"),
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
						label: dlang("tree_objective_menu_move","Move"),
						action: function(id, tree, server){
							var drop_ids = this.getActiveIds();
							var ids = [];
							var type_id = drop_ids[0].split("_")[0];
							for(var i=0;i<drop_ids.length;i++){
								ids.push(drop_ids[i].split("_")[1]);
								sid = drop_ids[i].split("_")[1];
							}
							var studygroup_id;
							var p_folder;
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
							$.post(this.server_script, {action:"move_"+type_id, sid:sid, tid:tid, studygroup:studygroup_id, lid:lId}, function(data){
								for(var i =0;i<drop_ids.length;i++){
									sObject.deleteItem(drop_ids[i],false);
								}
								tObject.smartRefreshItem(tid,server+"&refresh=1");	
							})
							
						}	
					},{
						id: "cancel",
						label: dlang("tree_objective_menu_cancel","Cancel"),
						action: function(id, tree){
						}	
					}]);
				return false;
			},
	select_mode:true,
	multiselect:true,
	editable:true,
	checkMenu: function(id){
		var _id = id.split("_");
		return (_.indexOf(["studygroup","objectivegroup","objective"],_id[0]) != -1);
	},
	select: function(id,tree,funcs,prev,ctrl){
		var _id = id.split("_");
		if(prev){
            /*
            var ifs = 1;
            switch(prev.split('_')[0]){
                case 'objective':
                    ifs = tree.getUserData(tree.getParentId(tree.getParentId(prev)),'weight')=='100' && tree.getUserData(tree.getParentId(tree.getParentId(prev)),'weight')=='0';
                    break;
                case 'objectivegroup':
                    ifs = tree.getUserData(tree.getParentId(prev),'weight')=='100' && tree.getUserData(tree.getParentId(prev),'weight')=='0';
                    break;
                case 'studygroup':
                    ifs = tree.getUserData(prev,'weight')=='100' && tree.getUserData(prev,'weight')=='0';
                    break;
            }

            if(ifs){
            */
                tree.setItemStyle(prev,"border:0; background-color:#FFFFFF; color:#666;");

            /*}else{
                tree.setItemStyle(prev,"border:0; background-color:#FFFFFF; color:red;");
            }
               */
		}
		switch (_id[0]){
			case "myobj":
				tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
				tree.clearSelection(id);
				break;
			case "programme":
				tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
				tree.clearSelection(id);
				break;
			case "studygroup":
				tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                /*
                if((tree.getUserData(id),'weight')=='100' && (tree.getUserData(id),'weight')=='0'){
                    tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                }else{
                    tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:red;");
                }
                */
				tree.clearSelection(id);
				break;
			case "objectivegroup":
				if(!ctrl){
                    tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                    /*
                    if(tree.getUserData(tree.getParentId(id),'weight')=='100' && tree.getUserData(tree.getParentId(id),'weight')=='0'){
                        tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                    }else{
                        tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:red;");
                    }
                    */
					tree.clearSelection(id);
				}
				break;
			case "objective":
                /*
                if(tree.getUserData(tree.getParentId(tree.getParentId(id)),'weight')=='100' && tree.getUserData(tree.getParentId(tree.getParentId(id)),'weight')=='0'){
				    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                }else{
                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid red; color:red;");
                }
                */
/*                if(window.save_notification){
                    window.save_notification = false;
                    tree.clearSelection(id);
                    seconfirm(dlang("changes_not_publised_confirn","Changes are not published. Publish?"),function(){
                        $('#save').click();
                        schoolmule.instances.tree_course_objectives.setDetailsItem(prev);
                        tree.setItemStyle(prev,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                        tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                    },function(){
                        schoolmule.instances.tree_course_objectives.setDetailsItem(id);
                        tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                        funcs.actions.objective(_id[1]);
                    });
                    break;
                }else{*/
                    tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
                    funcs.actions.objective(_id[1]);
                    return id;
                //}

            case "academicyear":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
            case "subject":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
            case "studygroup":
                tree.setItemStyle(id,"border:0; background-color:#FFFFFF; color:#666;");
                tree.clearSelection(id);
                break;
			default:
				return null;
		}
	},
	popup: [{	
			id: "new_objectivegroup",
			label: dlang("tree_objective_menu_new_obgr","New objective group"),
			visible: function(id, tree){
				var _id = id.split("_");
				return (_.indexOf([],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id,tree,server){
				var _id = id.split("_");
				var parentnode;
				var parent;
				if(_id[0]=='studygroup'){
					parent = _id[1];
					parentnode = id;
				}else{
					var temp = tree.getParentId(id);
					parentnode = temp;
					parent = temp.split("_")[1];				
				}
				$.post(this.server_script, {action:"new_objectivegroup",id:parent}, function(data){
					response = JSON.parse(data);

					tree.smartRefreshItem(parentnode,server+"&refresh=1");				
				})
			}
		},
		{	
			id: "new_objective",
			label: dlang("tree_objective_menu_new_obj","New objective"),
			visible: function(id, tree){
				var _id = id.split("_");
				return (_.indexOf(["studygroup"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id,tree,server){
                this.createNewItemDialog(dlang("crate_new_objective_text","Title of objective:"), dlang("new_objective_text","new objective"), function(item_name){

                    var _id = id.split("_");
                    var s_id;
                    var parentnode;

                    s_id = id.split("_")[1];
                    parentnode = id;

                    $.post(server, {action:'new_objective', s_id:s_id,item_name:item_name}, function(data){
                        tree.selectItem(data.id,false);
                        schoolmule.controls.tree.inserted_id = data.id;
                        tree.smartRefreshBranch(0,server);
                    },'json')


/*                    var _id = id.split("_");
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
                    },'json')*/
                })

			}
		},
		{
			id: "duplicate",
			label: dlang("tree_objective_menu_dupl","Duplicate"),
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["objectivegroup","objective"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id, tree,server){
				var _id = id.split("_");
                var idParent = tree.getParentId(id);
                var title = tree.getItemText(id);
                $.post(this.server_script, {action:'duplicate_'+_id[0],id:_id[1]}, function(data){
                    tree.selectItem(data.id,false);
                    schoolmule.controls.tree.inserted_id = data.id;
                    tree.smartRefreshBranch(0,server);
				},'json')
			}
		},{
			id: "merge",
			label: dlang("tree_objective_menu_merge","Merge"),
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["room"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length>1);
			},
			action: function(id, tree,server){
				var selected_ids = tree.getSelectedItemId().split(',');
				var type_id = selected_ids[0].split("_")[0];
				var ids = Array();
				for(var i=0;i<selected_ids.length;i++){
					ids.push(selected_ids[i].split("_")[1]);
				}
				//var _id = id.split("_");
				$.post(this.server_script, {action:'merge_'+type_id,ids:ids.join()}, function(data){
					response = JSON.parse(data);

                    schoolmule.controls.tree.inserted_id = response.idc;
                    tree.selectItem(response.idc,false);
                    tree.smartRefreshBranch(0,server);
				})
			}
		}
		/*
		,{
			id: "download",
			label: "Download",
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["my","room","folder","element","assignment"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return false;
			},
			action: function(id, tree){
				var _id = id.split("_");
				$.post(this.server_script, {action:'download_'+_id[0],id:_id[1]}, function(data){
					alert(data.message);						
				})
			}
		}
		*/
		,{
			id: "share",
			label: dlang("tree_objective_menu_share","Share"),
			visible: function(id,tree){			
				var _id = id.split("_");
				return (_.indexOf([""],_id[0]) != -1);
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
			label: dlang("tree_objective_menu_make_pr","Make private"),
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf([""],_id[0]) != -1);
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
		}

		,{
			id: "delete",
			label: dlang("tree_objective_menu_del","Delete"),
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["objectivegroup","objective"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length>=1);
			},
			action: function(id, tree, server){
				var ids_arr = tree.getSelectedItemId().split(',');
                seconfirm(dlang("tree_objective_popup_del","Do you really want to delete")+" '"+tree.getItemText(tree.getSelectedItemId())+"' ?",function(){
                    var _id = ids_arr[0].split("_");
                    var item = tree.getSelectedItemId();
                    $.post(server, {action:'delete_'+_id[0],id:tree.getSelectedItemId(), s_id:tree.getParentId(tree.getParentId(id)).split('_')[1]}, function(data){
                        tree.clearSelection();

                        var idParent = tree.getParentId(id);
                        var treeobj = schoolmule.instances.tree_course_objectives;

                        if(item.indexOf(treeobj.getDetailsItem()) + 1){
                            $("#overview-body").empty();
                            $("#overview-body").append("<div class='no-select-tree-item-message'><div>"+dlang("deteails_no_select","Select item in navigation tree")+"</div><div>");
                            $("#overview-body").css('background-color','rgb(145, 144, 144)');
                        }
                        tree.clearSelection();
                        tree.smartRefreshItem(idParent,server+"&refresh=1");
                    });
                });
			}
		},
		{
			id: "delete_content",
			label: dlang("tree_objective_menu_dc","Delete content"),
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["studygroup","objectivegroup"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length>=1);
			},
			action: function(id, tree, server){
                seconfirm(dlang("tree_objective_popup_del_cont","Do you really want to delete content from")+" '"+tree.getItemText(id)/*.split(' (')[0]*/+"' ?",function(){
                    var _id = id.split("_");
                    $.post(server, {action:'deletecontent_'+_id[0],id:_id[1]}, function(data){

                        tree.smartRefreshItem(id,server+"&refresh=1");
                    });
                });
			}
		}
		]
	
});