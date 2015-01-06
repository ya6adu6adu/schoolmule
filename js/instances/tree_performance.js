var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.tree_performance = new schoolmule.controls.tree({
	control_id: "tree_performance",
	drag_mode: "complex",
	drag_condition: function(id, tree, treeObj){
		var _id = id.split("_");
		if(_.indexOf(["performance"],_id[0]) == -1){
			return false;
		}
		var ids = treeObj.drag_items;
		if(ids.length > 1){
			return false;
		}
		var _id = id.split("_");
		if(tree.getLevel(id)==1 ||tree.getLevel(id)==2){
			return false;
		}else {
			return true;
		}
	},

	edit_condition: function(id){
		var _id = id.split("_");
		var editing_items = ['performance'];
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
		console.log(idParent);
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
				select(tree.getSelectedItemId(),tree,funcs);	
			});
             return true;
	},
	onDrag: function(sid,tid,sObject,tObject,lId){
				var _id = tid.split("_");
				if(!lId && _id[0]=="performance"){
					return false;
				}
				this.showPopup(tid,[{
						id: "duplicate",
						label: "Duplicate",
						action: function(id, tree, server){
									var drop_ids = this.getActiveIds();
									var ids = [];
									var type_id = drop_ids[0].split("_")[0];
									for(var i=0;i<drop_ids.length;i++){
										ids.push(drop_ids[i].split("_")[1]);
										sid = drop_ids[i].split("_")[1];
									}
									var studygroup_id =  tid.split("_")[1];
									$.post(this.server_script, {action:"movedupl_"+type_id, sid:sid, tid:tid,studygroup:studygroup_id, lid:lId}, function(){
										tree.smartRefreshItem(tid,server+"&refresh=1");
									})
								}
							
					},{
						id: "move",
						label: "Move",
						action: function(id, tree,server){
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
							var studygroup_id =  tid.split("_")[1];
							$.post(this.server_script, {action:"move_"+type_id, sid:sid, tid:tid, studygroup:studygroup_id, lid:lId}, function(data){
								for(var i =0;i<drop_ids.length;i++){
									sObject.deleteItem(drop_ids[i],false);
								}
								tObject.smartRefreshItem(tid,server+"&refresh=1");	
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
	load:function(tree){
		var hashValues = Hash.get();
		if(hashValues.itemtype && hashValues.itemtype=='performance'){
			tree.openAllItemsDynamic();
			tree.attachEvent("onXLE", function(tree,id){
				tree.selectItem('performance_'+hashValues.itemid,false);
			});	
		}		
	},
	select: function(id,tree,funcs,prev){
		if(prev){
			tree.setItemStyle(prev,"border:0; background-color:#FFFFFF; color:#666;");					
		}
		var _id = id.split("_");
		switch (_id[0]){
			case "performance":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.performance(_id[1]);
				return id;
			case "assessment":
				tree.setItemStyle(id,"background-color:#FFFFFA; border:1px solid #696969; color:#666;");
				funcs.actions.assessment(_id[1]);
				return id;
			default:
				return null;
				break;
		}
	},
	popup: [{	
			id: "new",
			label: "New public performance",
			visible: function(id, tree){
				var _id = id.split("_");
				return (_.indexOf(["studygroup","performance"],_id[0]) != -1);
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
				$.post(this.server_script, {action:"new_performance",id:parent}, function(data){
					response = JSON.parse(data);
					tree.smartRefreshItem(parentnode,server+"&refresh=1");				
				})
			}
		},
		{	
			id: "newnotpublic",
			label: "New not public performance",
			visible: function(id, tree){
				var _id = id.split("_");
				return (_.indexOf(["studygroup","performance"],_id[0]) != -1);
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
				$.post(this.server_script, {action:"newnotpublic_performance",id:parent}, function(data){
					response = JSON.parse(data);
					tree.smartRefreshItem(parentnode,server+"&refresh=1");				
				})
			}
		},
		
		{
			id: "duplicate",
			label: "Duplicate",
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["performance"],_id[0]) != -1);
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
		},
		{
			id: "share",
			label: "Share",
			visible: function(id,tree){			
				var _id = id.split("_");
				return (_.indexOf(["performance"],_id[0]) != -1);
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
		},
		{
			id: "private",
			label: "Make private",
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["performance"],_id[0]) != -1);
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
		{
			id: "delete",
			label: "Delete",
			visible: function(id,tree){
				var _id = id.split("_");
				return (_.indexOf(["performance"],_id[0]) != -1);
			},
			enabled: function(id, tree){
				return (tree.getSelectedItemId().split(',').length>=1);
			},
			action: function(id, tree,server){
				var ids_arr = tree.getSelectedItemId().split(',');
				if(confirm("Do you really want to delete "+tree.getSelectedItemId()+"?")){
					for(var i=0; i<ids_arr.length; i++){
						var _id = ids_arr[i].split("_");
						$.post(this.server_script, {action:'delete_'+_id[0],id:_id[1]}, function(data){
							var idParent = tree.getParentId(id);
							tree.smartRefreshItem(idParent,server+"&refresh=1");				
						});
					}			
				}
			}
		}
		]
	
});