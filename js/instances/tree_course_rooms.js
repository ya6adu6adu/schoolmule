var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.tree_courserooms = new schoolmule.controls.tree({
	control_id: "tree_course_rooms",
	drag_mode: "complex",
	drag_condition: function(id, tree, treeObj){
		var ids = treeObj.drag_items;
		if(ids.length > 1){
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
		return true;
	},
	drop_condition: function(id, tree, id_dst, tree_dst){
		var _id = id.split("_");
		var _id_dst = id_dst.split("_");
		console.log(id);
		if(_.indexOf([_id_dst[0]],_id[0]) != -1){
			return true;
		}
		/*
		switch (_id_dst[0]){
			case 'element' :
				if(_.indexOf(["element"],_id[0]) != -1){
					return true;
				}
			break;
			case 'folder':
				if(_.indexOf(["folder"],_id[0]) != -1){
					return true;
				}				
			break;
			case 'assignment':
				if(_.indexOf(["assignment"],_id[0]) != -1){
					return true;
				}
			break;
			case 'section':
				if(_.indexOf(["section"],_id[0]) != -1){
					return true;
				}
			break;
		}
		
		 if((_.indexOf(["element"],_id_dst[0]) != -1)&&(_.indexOf(["element","folder"],_id[0]) != -1) ){
			return true;
		}else if((_.indexOf(["element","folder"],_id_dst[0]) != -1)&&(_.indexOf(["folder"],_id[0]) != -1)){
			return true;
		}else if((_id_dst[0]==="room")&&(tree.getLevel(id)==1)){
			return true;
		}else if((_.indexOf(["assignment","section"],_id_dst[0]) != -1)&&(_id[0]==="assignment") ){
			return true;
		}else if((_.indexOf(["assignment","section"],_id_dst[0]) != -1)&&(_id[0]==="section") ){
			return true;
		}
		else{
			return false;
		}
		*/
		return false;
		
	},
	onEdit: function(id,value,tree,script){
		tree.setItemStyle(id,"font-weight:bold;");
		var _id = id.split("_");
		$.post(script, {
			   action:"rename", 
			   id:_id[1], 
			   name:value,
			   node:_id[0]
		}, function(data){
			tree.setItemStyle(id,"font-weight:normal;");	
		});
        return true;
	},
	onDrag: function(sid,tid,sObject,tObject,lId){
				this.showPopup(tid,[{
						id: "duplicate",
						label: "Duplicate",
						action: function(id, tree){
									var drop_ids = this.getActiveIds();
									var ids = [];
									var type_id = drop_ids[0].split("_")[0];
									for(var i=0;i<drop_ids.length;i++){
										ids.push(drop_ids[i].split("_")[1]);
										sid = drop_ids[i].split("_")[1];
									}
									var room_id;
									var _id = tid.split("_");
									if(_id[0]==="room"){
										room_id = _id[1];
									}else {
										var parent = tree.getParentId(tid);
											while(parent.split("_")[0]!=="room"){
												parent = tree.getParentId(parent);
											}
											room_id = parent.split("_")[1];
									}
									$.post(this.server_script, {action:"movedupl_"+type_id, sid:sid, tid:tid,room:room_id, lid:lId}, function(){
										tree.smartRefreshItem(tid);
									})
								}
							
					},{
						id: "move",
						label: "Move",
						action: function(id, tree){
							var drop_ids = this.getActiveIds();
							var ids = [];
							var type_id = drop_ids[0].split("_")[0];
							for(var i=0;i<drop_ids.length;i++){
								ids.push(drop_ids[i].split("_")[1]);
								sid = drop_ids[i].split("_")[1];
							}
							var room_id;
							var p_folder;
							var _id = tid.split("_");
							if(_id[0]==="room"){
								room_id = _id[1];
							}else {
								var parent = tree.getParentId(tid);
									while(parent.split("_")[0]!=="room"){
										parent = tree.getParentId(parent);
									}
									room_id = parent.split("_")[1];
							}
							$.post(this.server_script, {action:"move_"+type_id, sid:sid, tid:tid, room:room_id, lid:lId}, function(data){
								for(var i =0;i<drop_ids.length;i++){
									sObject.deleteItem(drop_ids[i],false);
								}
								tObject.smartRefreshItem(tid);	
							})
							
						}	
					},{
						id: "cancel",
						label: "Cancel",
						action: function(id, tree){
						}	
					}]);
				return false;
			},
	select_mode:true,
	multiselect:true,
	editable:true,
	select: function(id,tree,funcs){
		if((id.split(",")).length>1){
			return false;
		}
		var _id = id.split("_");
		switch (_id[0]){
			case "room":
				funcs.actions.room(_id[1]);
				break;
			case "assignment":
				funcs.actions.assignment(_id[1]);
				break;
			case "section":
				funcs.actions.section(_id[1]);
				break;
			case "element":
				funcs.actions.element(_id[1]);
				break;
			default:
				break;
		}
	},
	popup: [{	
			id: "new_room",
			label: "New courseroom",
			visible: function(id, tree){
				var _id = id.split("_");
				return (_.indexOf(["0","my"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id,tree){
				var _id = id.split("_");
				if(_id[0] == "my"){
					_id[0] = "room";
					_id[1] = 0;
				}
				$.post(this.server_script, {action:'new_'+_id[0],id:_id[1]}, function(data){
					response = JSON.parse(data);
					tree.smartRefreshItem(id);				
				})
			}
		},
		{	
			id: "new_assignment",
			label: "New assignment",
			visible: function(id, tree){
				var _id = id.split("_");
				return (_.indexOf(["element"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id,tree,server){
				var _id = id.split("_");
				$.post(this.server_script, {action:'new_assignment',id:_id[1]}, function(data){
					response = JSON.parse(data);
					tree.smartRefreshItem(id,server+"&refresh=1");			
				})
			}
		},
		{	
			id: "new_section",
			label: "New section",
			visible: function(id, tree){
				var _id = id.split("_");
				return (_.indexOf(["element"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id,tree,server){
				var _id = id.split("_");
				$.post(this.server_script, {action:'new_section',id:_id[1]}, function(data){
					response = JSON.parse(data);
					tree.smartRefreshItem(id,server+"&refresh=1");	
				})
			}
		},
		{
		id: "new_element",
			label: "New element",
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
						p_folder = _id[1];
					}
					p_folder = _id[1];
				}
				
				$.post(this.server_script, {action:'new_element',room_id:room_id,p_folder:p_folder}, function(data){
					response = JSON.parse(data);
					tree.smartRefreshItem(id,server+"&refresh=1");						
				})
			}
		},		
		{
			id: "new_folder",
			label: "New folder",
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["room","folder"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id, tree,server){
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
					response = JSON.parse(data);
					tree.smartRefreshItem(id,server+"&refresh=1");		
				})
				
			}
		},{
			id: "duplicate",
			label: "Duplicate",
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["room","folder","element","section","assignment"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id, tree,server){
				var _id = id.split("_");
				$.post(this.server_script, {action:'duplicate_'+_id[0],id:_id[1]}, function(data){
					response = JSON.parse(data);
					var idParent = tree.getParentId(response.idc);
					tree.smartRefreshItem(idParent,server+"&refresh="+response.id);					
				})
			}
		},{
			id: "merge",
			label: "Merge",
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
					var idParent = tree.getParentId(response.idc);
					tree.smartRefreshItem(idParent,server+"&refresh="+response.id);							
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
		
		,{
			id: "share",
			label: "Share",
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["room"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id, tree){
				var _id = id.split("_");
				$.post(this.server_script, {action:'share_'+_id[0],id:_id[1]}, function(data){
					alert(data.message);						
				})
			}
		},{
			id: "private",
			label: "Make private",
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["room"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id, tree){
				var _id = id.split("_");
				$.post(this.server_script, {action:'private_'+_id[0],id:_id[1]}, function(data){
					alert(data.message);						
				})
			}
		}
		*/
		,{
			id: "delete",
			label: "Delete",
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["room","folder","element","section","assignment"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length==1);
			},
			action: function(id, tree,server){
				if(confirm("Do you really want to delete "+id+"?")){
					var _id = id.split("_");
					$.post(this.server_script, {action:'delete_'+_id[0],id:_id[1]}, function(data){
						var idParent = tree.getParentId(id);
						tree.smartRefreshItem(idParent,server+"&refresh=1");
					});					
				}
			}
		}]
	
});