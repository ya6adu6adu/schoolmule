var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_assignments_progress = new schoolmule.controls.grid({		
			id: "grid_assignments_progress",
			gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
			menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
			dp:false,
			addRow: function(rId,cn,dhx){			
			},
            selectFirstItem:function(tree){
                var items = tree.getAllSubItems(0);
                var _items = items.split(',');
                var main_array = ['assignment','performance'];
                for(var i=0; i< _items.length; i++){
                    var _id = _items[i].split('_');
                    if(_.indexOf(main_array,_id[0]) != -1){
                        tree.selectRowById(_items[i],false,true,true);
                        break;
                    }
                }
            },
			beforeSelectRow:  function(id,dhx,keysel){
				var _id = id.split("_");
				
				if(_id[0]=="stg"){
					return false;
				}
				
				if(keysel && (_id[0]=="p" || _id[0]=="a")){
					var rowIndex=dhx.grid.getRowIndex(id);
					if(dhx.grid.getOpenState(dhx.grid.getParentId(id))){
						if(keysel==38){
							dhx.grid.selectRow(rowIndex-dhx.grid.hasChildren(dhx.grid.getParentId(id)),true);							
						}else{
							dhx.grid.selectRow(rowIndex+dhx.grid.hasChildren(dhx.grid.getParentId(id)),true);
						}
						return false;
					}
				}

                if(_id[0]=="p" || _id[0]=="a"){
                    var caell = dhx.grid.cells(id,1).cell;
                    $(caell).parent().addClass('norowselected');
                }
				return true;
			},		
			
			selectRow: function(ind, id, Tdhx, Toptions, Tf, funcs, tree_id){
                var grid = schoolmule.instances.grid_assignments_progress.getGrid().grid;
                var _id = id.split("_");
				switch (_id[0]){
					case "performance":
						funcs.actions.performance(_id[1],tree_id);
						return id;
					case "assignment":
						funcs.actions.assignment(_id[1],tree_id);
						return id;
					default:
						return null;
				}
			},
			
			openTree: function(id,dhx,state){
                var ids = dhx.grid.getSelectedRowId();
                if(ids){
                    var _id = ids.split("_");
                    if((_id[0]=="p" || _id[0]=="a")){
                        dhx.grid.clearSelection();
                    }
                }
			},
			
			setConfig: function(mygrid,script,id){
				mygrid.setHeader(dlang("gris_assign_pr_assign","Submissions and performances")+","+dlang("gris_assign_pr_stat","Status")+","+dlang("gris_assign_pr_unit","Unit")+","+dlang("gris_assign_pr_max","Max")+","+dlang("gris_assign_pr_pass","Pass")+","+dlang("gris_assign_pr_res","Result")+","+dlang("gris_assign_pr_assess","Assessment"));
				mygrid.setInitWidthsP("44,10,15,7,7,7,10");
				mygrid.setColAlign("left,left,left,left,left,left,left");
				mygrid.setColTypes("tree,ed,ro,ro,ro,ed,co");
				//mygrid.setColSorting("str,str,str,str,str,str");
				mygrid.setColumnColor("white,white,white,white,white,white");
				mygrid.enableTreeCellEdit(true);
				mygrid.enableEditEvents(true,false,true);
				mygrid.kidsXmlFile = script;
                var tree_assess = schoolmule.instances.tree_assessments_by_studygroup.getTree();
                var stg = tree_assess.getSelectedItemId().split('_')[2];
                mygrid.loadXML(script+'&id='+id+'&stg='+(stg?stg:""));
			},
			
			showMenu: function(id){
				/*
				var data = id.split("_");
				if(data[0]=='assignment'){
					return true;
				}else{
					return false;
				}
				*/
				return true;
			},

            load: function(){
                var grid = schoolmule.instances.grid_assignments_progress.getGrid().grid;
                grid.expandAll();
                if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                    grid.selectRow(1,true);
                }
            },
			
			editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj,pid){
				var _id = rId.split("_");
				if(stage == 0){
					if((_id[0]!="p" && _id[0]!="a" && _id[0]!="assignment")||cInd==0){
						return false;
					}
				}

                if(_id[0]=="assignment"&& cInd!=1){
                    return false;
                }

                if(_id[0]=="p" && cInd!=6){
                    return false;
                }

				if((_id[0]=="a"||_id[0]=="p")&&cInd==1){
					return false;
				}
				if(stage == 2){
					if(nValue!=oValue){
						var _id = rId.split("_");
						if(_id[0]=="a"){
							switch(cInd){
								case 5:
									//var runit = grid.cells(grid.getSelectedRowId(),2).getValue();
                                    var runit = parseInt(grid.getUserData(grid.getSelectedRowId(),'unit'));
									var grades = ['A','B','C','D','E','F','Fx'];
									var pass;
									switch (runit){
										case 1:
											var val = parseInt(nValue);
											if(!isNaN(val) && val<=parseInt(grid.cells(grid.getSelectedRowId(),3).getValue())){
												grid.cells(rId,cInd).setValue(val);
												if(val<parseInt(grid.cells(grid.getSelectedRowId(),4).getValue())){
													//grid.cells(rId,6).setBgColor('#ff8888');
													pass = 0;
												}else{
													//grid.cells(rId,6).setBgColor('#88ff88');
													pass = 1;
												}
												grid.cells(grid.getSelectedRowId(),5).setValue(val+'p')								
												$.post(tree_obj.server_script, {action:"editresult", id:_id[1], value:val+'p', pass:pass}, function(){
													 //grid.updateFromXML("connectors/connector.php?control_id=grid_assess_assignments&id="+pid);
												});
												
												return true;
											}	
											break;
										case 2:
											var val = parseInt(nValue);
											if(!isNaN(val) && val <=100 && val<=parseInt(grid.cells(grid.getSelectedRowId(),3).getValue())){
												grid.cells(rId,cInd).setValue(val);
												if(val<parseInt(grid.cells(grid.getSelectedRowId(),4).getValue())){
													//grid.cells(rId,6).setBgColor('#ff8888');
													pass = 0;
												}else{
													//grid.cells(rId,6).setBgColor('#88ff88');
													pass = 1;
												}
												grid.cells(grid.getSelectedRowId(),5).setValue(val+'%')				
												$.post(tree_obj.server_script, {action:"editresult", id:_id[1], value:val+'%', pass:pass}, function(){
													 //grid.updateFromXML("connectors/connector.php?control_id=grid_assess_assignments&id="+pid);
												});
												return true;
											}
											break;
										case 3:
											var val = nValue//.toUpperCase();
											if(grades.join().search(val) != -1 && grades.join().search(val)>=grades.join().search(grid.cells(grid.getSelectedRowId(),3).getValue())){
												grid.cells(rId,cInd).setValue(val);
												if(grades.join().search(val)>=grades.join().search(grid.cells(grid.getSelectedRowId(),4).getValue())){
													//grid.cells(rId,6).setBgColor('#ff8888');
													pass = 0;
												}else{
													//grid.cells(rId,6).setBgColor('#88ff88');
													pass = 1;
												}
                                                grid.cells(rId,cInd+1).setValue(val);
                                                if(val=="F" || val=="Fx" || val == dlang("npassvalue","NPass")){
                                                    grid.cells(rId,cInd+1).setBgColor('#ff8888');
                                                }else{
                                                    if(nValue=="" || nValue=="na"){
                                                        grid.cells(rId,cInd+1).setBgColor('#FEF5CA');
                                                    }else{
                                                        grid.cells(rId,cInd+1).setBgColor('#88ff88');                                            }

                                                }
												$.post(tree_obj.server_script, {action:"editresult", id:_id[1], value:val, pass:pass}, function(){
													 //grid.updateFromXML("connectors/connector.php?control_id=grid_assess_assignments&id="+pid);
												});
												return true;
											}
					
											break;
										case 4:
											var val = nValue;
                                            if(val == dlang("passvalue","Pass") || val == dlang("npassvalue","NPass") || val == ""){
//                                                //grid.cells(rId,cInd).setValue("Pass");
                                                if(val!=dlang("passvalue","Pass")){
													//grid.cells(rId,6).setBgColor('#ff8888');
													pass = 1;
												}else{
													//grid.cells(rId,6).setBgColor('#88ff88');
													pass = 0;
												}
                                                grid.cells(rId,cInd+1).setValue(val);
                                                if(val=="F" || val=="Fx" || val == dlang("npassvalue","NPass")){
                                                    grid.cells(rId,cInd+1).setBgColor('#ff8888');
                                                }else{
                                                    if(nValue=="" || nValue=="na"){
                                                        grid.cells(rId,cInd+1).setBgColor('#FEF5CA');
                                                    }else{
                                                        grid.cells(rId,cInd+1).setBgColor('#88ff88');                                            }

                                                }
												$.post(tree_obj.server_script, {action:"editresult", id:_id[1], value:val, pass:pass}, function(){

													//grid.updateFromXML("connectors/connector.php?control_id=grid_assess_assignments&id="+pid);
												});
												return true;
											}
											break;
									}								
									return false;	
								case 6:
                                    var pass = 0;
                                    if(nValue=="F" || nValue=="Fx" || nValue == dlang("npassvalue","NPass")){
                                        grid.cells(rId,cInd).setBgColor('#ff8888');
                                        pass = 0;
                                    }else{
                                        if(nValue=="" || nValue=="na"){
                                            pass = 0;
                                            grid.cells(rId,cInd).setBgColor('#FEF5CA');
                                        }else{
                                            pass = 1;
                                            grid.cells(rId,cInd).setBgColor('#88ff88');
                                        }

                                    }

									$.post(tree_obj.server_script, {action:"editgrade", id:_id[1], value:nValue, pass:pass}, function(){
										return true;
									})						
									break;
							}						
						}else if(_id[0]=="p"){
							switch(cInd){
								case 5:
									$.post(tree_obj.server_script, {action:"editresult", id:_id[1], value:nValue}, function(){
										return true;
									});					
									break;
								case 6:
                                    if(nValue=="F" || nValue=="Fx"){
                                        grid.cells(rId,cInd).setBgColor('#ff8888');
                                    }else{
                                        if(nValue=="" || nValue=="na"){
                                            grid.cells(rId,cInd).setBgColor('#FEF5CA');
                                        }else{
                                            grid.cells(rId,cInd).setBgColor('#88ff88');
                                        }

                                    }

									$.post(tree_obj.server_script, {action:"editassessment", id:_id[1], assessment:nValue}, function(){
										return true;
									});							
									break;
							};
			
						}else if(_id[0]=="assignment"){
							switch(cInd){
								case 1:
									$.post(tree_obj.server_script, {action:"editstatus", assid:_id[1], pid:pid, value:nValue}, function(){
										grid.updateFromXML("connectors/connector.php?control_id=grid_assignments_progress&id="+pid);
										return true;
									});					
									break;
							};						
						}
					}
				}
				return true;
			},

			popup: [
				{
					id: "expand_item",
					visible: function(id, tree){
						return true;
					},
					enabled: function(id, tree){
						var _id = id.split("_");
						return (_.indexOf(["stg"],_id[0]) != -1);
					},
					label: dlang("gris_assign_menu_exp","Expand"),
					action: function(id, grid, tree_obj, index){
						grid.openItem(id+"_"+index);
						var clilds = grid.hasChildren(id+"_"+index);
						for (var i=0; i < clilds; i++) {
							grid.openItem(grid.getChildItemIdByIndex(id+"_"+index,i));
						};
					}
				},
				{
					id: "expand",
					visible: function(id, tree){
						return true;
					},
					enabled: function(id, tree){
						return true;
					},
					label: dlang("gris_assign_menu_exp_full","Expand full grid"),
					action: function(id, grid, tree_obj, index){
						grid.expandAll();			
					}
				},
				{
					id: "collapse_item",
					visible: function(id, tree){
						return true;
					},
					enabled: function(id, tree){
						var _id = id.split("_");
						return (_.indexOf(["stg"],_id[0]) != -1);
					},
					label: dlang("gris_assign_menu_coll","Collapse"),
					action: function(id, grid, tree_obj, index){
						
						var clilds = grid.hasChildren(id+"_"+index);
						for (var i=0; i < clilds; i++) {
							grid.closeItem(grid.getChildItemIdByIndex(id+"_"+index,i));
						};
						grid.closeItem(id+"_"+index);
					}
				},
				{
					id: "collapse",
					visible: function(id, tree){
						return true;
					},
					enabled: function(id, tree){
						return true;
					},
					label: dlang("gris_assign_menu_coll_full","Collapse full grid"),
					action: function(id, grid, tree_obj, index){
						grid.collapseAll();
					}
				},


/*
{
    id: "download",
    label: "Download submission",
    action:function(id, grid, tree_obj, index){
        $.post(tree_obj.server_script, {action:"deactive", id:index}, function(){
        })
    }
},
*/
				{
					id: "make_submitted",
					label: dlang("gris_assign_menu_mas","Mark as submitted"),
                    visible: function(id, tree){
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
                        return true;
                    },
					enabled: function(id, tree){
						if(schoolmule.instances.grid_assignments_progress.getGrid().grid.getUserData(id,'submitted')=="1"){
							return false;
						}
						var _id = id.split("_");
						return (_.indexOf(["assignment"],_id[0]) != -1);
					},
					action:function(id, grid, tree_obj, index, tree){
						$.post("connectors/connector.php?control_id=grid_assignments_progress", {action:"makeassubmitted", assid:index, pid:tree.tree_item}, function(){
							$("#mark_as_submitted").text(dlang("button_make_as_not_submitted","Mark as not Submitted"));
							grid.setUserData(id+"_"+index,'submitted','1');
                            var tree_assess = schoolmule.instances.tree_assessments_by_studygroup.getTree();
                            var stg = tree_assess.getSelectedItemId().split('_')[2];
							grid.updateFromXML("connectors/connector.php?control_id=grid_assignments_progress&id="+tree.tree_item+'&stg='+(stg?stg:""));
						});
					}
				},
				{
					id: "make_not_submitted",
                    visible: function(id, tree){
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
                        return true;
                    },
					enabled: function(id, tree){
						if(schoolmule.instances.grid_assignments_progress.getGrid().grid.getUserData(id,'submitted')=="0"){
							return false;
						}
						var _id = id.split("_");
						return (_.indexOf(["assignment"],_id[0]) != -1);
					},
					label: dlang("gris_assign_menu_mans","Mark as not submitted"),
					action:function(id, grid, tree_obj, index, tree){
						$.post("connectors/connector.php?control_id=grid_assignments_progress", {action:"makeasnotsubmitted", assid:index, pid:tree.tree_item}, function(){
							$("#mark_as_submitted").text(dlang("button_make_as_submitted","Mark as Submitted"));
                            var tree_assess = schoolmule.instances.tree_assessments_by_studygroup.getTree();
                            var stg = tree_assess.getSelectedItemId().split('_')[2];
                            grid.updateFromXML("connectors/connector.php?control_id=grid_assignments_progress&id="+tree.tree_item+'&stg='+(stg?stg:""));
						});
					}
				},
				{
					id: "go_to_a_p",
					visible: function(id, tree){
						return true;
					},
					enabled: function(id, tree){
						return true;
					},
					label: dlang("gris_assign_menu_goto","Go to Assignment/Performance"),
					action:function(id, grid, tree_obj, index, tree){
						tabbar.setActiveTab("second-menu_assignmrnts_and_performance");
						Hash.add('itemid',index);
						Hash.add('itemtype',id);
						var tree = schoolmule.instances.tree_assessments_by_studygroup.getTree();					
					}
				},
				{
					id: "remove",
					label: dlang("gris_assign_menu_delete_for_p","Delete for this pupil"),
                    visible: function(id, tree){
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
                        return true;
                    },
					action:function(id, grid, tree_obj, index, tree){
                        seconfirm(dlang("Delete?"),function(){
                            $.post("connectors/connector.php?control_id=grid_assignments_progress", {action:"remove",  assid:index, pid:tree.tree_item, type:id}, function(){
                                grid.deleteRow(id+"_"+index);
                            })
                        });
					}
				},
				{
					id: "deactivate",
					label: dlang("gris_assign_menu_deact","Deactivate"),
                    visible: function(id, tree){
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
                        return true;
                    },
					enabled: function(id, tree){
						var _id = id.split("_");
						if(_.indexOf(["assignment","performance"],_id[0]) == -1){
							return false;
						}
						if(schoolmule.instances.grid_assignments_progress.getGrid().grid.getUserData(id,'activate')=="0"){
							return false;
						}else{
							return true;
						}
					},
					action:function(id, grid, tree_obj, index, tree){
						$.post("connectors/connector.php?control_id=grid_assignments_progress", {action:"deactivate", assid:index, pid:tree.tree_item, type:id}, function(){
							schoolmule.instances.grid_assignments_progress.getGrid().grid.setUserData(id+'_'+index,'activate','0');
							grid.setRowTextStyle(id+"_"+index,"background-color:#F5F5F5; opacity:0.5;");
							var sids = grid.getSubItems(id+"_"+index).split(',');
							for (var i=0; i < sids.length; i++) {
							  grid.setRowTextStyle(sids[i],"background-color:#F5F5F5; opacity:0.5;");
							};
						});
					}
				},
				{
					id: "activate",
					label: dlang("gris_assign_menu_act","Activate"),
                    visible: function(id, tree){
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
                        return true;
                    },
					enabled: function(id, tree){
						var _id = id.split("_");
						if(_.indexOf(["assignment","performance"],_id[0]) == -1){
							return false;
						}
						if(schoolmule.instances.grid_assignments_progress.getGrid().grid.getUserData(id,'activate')=="1"){
							return false;
						}else{
							return true;
						}

					},
					action:function(id, grid, tree_obj, index, tree){
						$.post("connectors/connector.php?control_id=grid_assignments_progress", {action:"activate", assid:index, pid:tree.tree_item, type:id}, function(){
							schoolmule.instances.grid_assignments_progress.getGrid().grid.setUserData(id+'_'+index,'activate','1');
							grid.setRowTextStyle(id+"_"+index,"background-color:#FFF; opacity:1");
							var sids = grid.getSubItems(id+"_"+index).split(',');
							for (var i=0; i < sids.length; i++) {
							  grid.setRowTextStyle(sids[i],"background-color:#F5F5F5; opacity:1;");
							};
						});
					}
				}
				
				/*
				{
					id: "delete_content",
					label: "Delete submission content",
					action:function(id, grid, tree_obj, index){
						$.post(tree_obj.server_script, {action:"reactive", id:index}, function(){
							
						});
					}
				},

				{
					id: "deactivate",
					label: "Deactivate",
					action:function(id, grid, tree_obj, index){
						$.post(tree_obj.server_script, {action:"reactive", id:index}, function(){
							
						});
					}
				},
				{
					id: "reactivate",
					label: "Reactivate",
					action:function(id, grid, tree_obj, index){
						$.post(tree_obj.server_script, {action:"reactive", id:index}, function(){
							
						});
					}
				}
				*/
				]
		
		
})