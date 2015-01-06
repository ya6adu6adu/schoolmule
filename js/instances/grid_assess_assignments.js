var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_assess_assignments = new schoolmule.controls.grid({		
			id: "grid_assess_assignments",
			gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
			menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
			dp:false,
            selectFirstItem:function(tree){
                var items = tree.getAllSubItems(0);
                var _items = items.split(',');
                var main_array = ['pupil','a'];
                for(var i=0; i< _items.length; i++){
                    var _id = _items[i].split('_');
                    if(_.indexOf(main_array,_id[0]) != -1){
                        tree.selectRowById(_items[i],false,true,true);
                        break;
                    }
                }
            },
			addRow: function(rId,cn,dhx){			
			},

            selectRow: function(ind, id, Tdhx, Toptions, Tf, funcs){
                var grid = schoolmule.instances.grid_assess_assignments.getGrid().grid;
                var tree_selected_item = schoolmule.instances.tree_assignments_by_studygroup.getTree().getSelectedItemId().split('_')[1];
                var _id = id.split("_");
                if(_id[0]=="p" || _id[0]=="a"){
                    var caell = grid.cells(id,1).cell;
                    $(caell).parent().addClass('norowselected');
                }
                switch (_id[0]){
                    case "pupil":
                        funcs.actions.pupil(_id[1],tree_selected_item,_id[2]);
                        return id;
                    default:
                        return null;
                }
            },
			openTree: function(id,dhx,state,pid){
				var ids = dhx.grid.getSelectedRowId();
				if(ids){
					var _id = ids.split("_");
					if((_id[0]=="p" || _id[0]=="a")){
                        dhx.grid.clearSelection();
					}
				}

			},
			
			beforeSelectRow:  function(id,dhx,keysel){
				var _id = id.split("_");

				if(_id[0]=="studygroup"){
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
			
						
			setConfig: function(mygrid,script,id){
				mygrid.setHeader(dlang("details_gr_acess_assign_pn","Pupil name")+','+dlang("details_gr_acess_assign_stat","Status")+','+dlang("details_gr_acess_assign_unit","Unit")+','+dlang("details_gr_acess_assign_max","Max")+','+dlang("details_gr_acess_assign_pass","Pass")+','+dlang("details_gr_acess_assign_res","Result")+','+dlang("details_gr_acess_assign_assess","Assessment"));
				mygrid.setInitWidthsP("44,10,12,7,7,7,13");
				//mygrid.setColAlign("left,left,left,left,left,left,left");
				mygrid.setColTypes("tree,ed,ro,ro,ro,ed,co");
				//mygrid.setColSorting("str,str,str,str,str,str");
				mygrid.enableTooltips("false,false,false,false,false,false,false");
				mygrid.enableTreeCellEdit(false);
				mygrid.enableEditEvents(true,false,true);
				mygrid.kidsXmlFile = script;
				mygrid.loadXML(script+'&id='+id);			
			},
			showMenu: function(id){
				return true;
			},
			
			load: function(){
                var hashValues = Hash.get();
                var grid = schoolmule.instances.grid_assess_assignments.getGrid().grid;



                if(hashValues.pupil){
                    grid.selectRowById('pupil_'+hashValues.pupil,true);
                    Hash.remove('pupil');
                    Hash.remove('search');
                }
                grid.expandAll();
                if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                    grid.selectRow(1,true);
                }
			},
			
			editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj,pid){
				var _id = rId.split("_");
				if(stage == 0){
					if((_id[0]!="p" && _id[0]!="a" && _id[0]!="pupil")||cInd==0){
						return false;
					}
                    if(_id[0]=="pupil"&& cInd!=1){
                        return false;
                    }
					if(_id[0]=="studygroup"){
						return false;
					}
					
					if((_id[0]=="a"||_id[0]=="p")&&cInd==1){
						return false;
					}
				
				}			
				if(stage == 2){
					if(nValue!=oValue){
						switch(cInd){
							case 1:
								$.post(tree_obj.server_script, {action:"editstatus", assid:_id[1], pid:pid, value:nValue}, function(){
									grid.updateFromXML("connectors/connector.php?control_id=grid_assess_assignments&id="+pid);
									return true;
								});			
								break;
							case 5:
								var runit = parseInt(grid.getUserData(grid.getSelectedRowId(),'unit'));
								var grades = ['A','B','C','D','E','F','Fx'];
								var pass;
								var assignment_subm_not_passed = $("#assignment_subm_not_passed span");
								switch (runit){
									case 1:
										var val = parseInt(nValue);
										if(!isNaN(val) && val<=parseInt(grid.cells(grid.getSelectedRowId(),3).getValue())){
											
											grid.cells(rId,cInd).setValue(val);
											if(val<parseInt(grid.cells(grid.getSelectedRowId(),4).getValue())){
												pass = 0;
											}else{
												pass = 1;
											}
											grid.cells(grid.getSelectedRowId(),5).setValue(val+'p')			
											$.post(tree_obj.server_script, {action:"editresult", id:_id[1], value:val+'p', pass:pass}, function(){
                                                assignmentHeaderUpdate();
											});
											
											return true;
										}	
										break;
									case 2:
										var val = parseInt(nValue);
										if(!isNaN(val) && val <=100 && val<=parseInt(grid.cells(grid.getSelectedRowId(),3).getValue())){
											grid.cells(rId,cInd).setValue(val);
											if(val<parseInt(grid.cells(grid.getSelectedRowId(),4).getValue())){
												pass = 0;
											}else{
												pass = 1;
											}
											grid.cells(grid.getSelectedRowId(),5).setValue(val+'%')
											$.post(tree_obj.server_script, {action:"editresult", id:_id[1], value:val+'%', pass:pass}, function(){
                                                assignmentHeaderUpdate();
											});
											return true;
										}
										break;
									case 3:
										var val = nValue//.toUpperCase();
										if(grades.join().search(val) != -1 && grades.join().search(val)>=grades.join().search(grid.cells(grid.getSelectedRowId(),3).getValue())){
											grid.cells(rId,cInd).setValue(val);
											if(grades.join().search(val)>=grades.join().search(grid.cells(grid.getSelectedRowId(),4).getValue())){
												pass = 0;
											}else{
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
                                                assignmentHeaderUpdate();
											});
											return true;
										}
				
										break;
									case 4:
										var val = nValue;
										if(val == dlang("passvalue","Pass") || val == dlang("npassvalue","NPass") || val == ""){
											if(val!=dlang("passvalue","Pass")){
												pass = 1;
											}else{
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
                                                assignmentHeaderUpdate();
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
                                        grid.cells(rId,cInd).setBgColor('#FEF5CA');
                                        pass = 0;
                                    }else{
                                        grid.cells(rId,cInd).setBgColor('#88ff88');
                                        pass = 1;
                                    }

								}
								$.post(tree_obj.server_script, {action:"editgrade", id:_id[1], value:nValue, pass:pass}, function(){
                                    assignmentHeaderUpdate();
									return true;
								})						
								break;
						}						
					}
				}
				return true;
			},
			


			popup: [
				{
					id: "expand",
					label: dlang("details_gr_acess_assign_menu_expand","Expand Studygroup"),
					action: function(id, grid, tree_obj, index){
						grid.expandAll();			
					}
				},
				{
					id: "collapse",
					label: dlang("details_gr_acess_assign_menu_collapse","Collapse Studygroup"),
					action: function(id, grid, tree_obj, index){
						grid.collapseAll();
					}
				},
				/*
				{
					id: "download",
					label: "Download submission",
					action:function(id, grid, tree_obj, index){						
					}
				},
				*/
				{
					id: "make_submitted",
					label: dlang("details_gr_acess_assign_menu_mas","Mark as submitted"),
					visible: function(id, tree){
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
						return true;
					},
					enabled: function(id, tree){
						if(schoolmule.instances.grid_assess_assignments.getGrid().grid.getUserData(id,'submitted')=="1"){
							return false;
						}
						var _id = id.split("_");
						return (_.indexOf(["pupil"],_id[0]) != -1);
					},
					action:function(id, grid, tree_obj, index, tree){
						var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
						var assid = tree.getSelectedItemId().split('_');

						$.post("connectors/connector.php?control_id=grid_assess_assignments", {action:"makeassubmitted", assid:assid[1], pid:index}, function(){
							grid.updateFromXML("connectors/connector.php?control_id=grid_assess_assignments&id="+assid[1]);
							grid.setUserData(id+"_"+index,'submitted','1');
							$("#mark_as_submitted").text(dlang("button_make_as_not_submitted","Mark as not Submitted"));
                            assignmentHeaderUpdate();
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
						if(schoolmule.instances.grid_assess_assignments.getGrid().grid.getUserData(id,'submitted')=="0"){
							return false;
						}
						var _id = id.split("_");
						return (_.indexOf(["pupil"],_id[0]) != -1);
					},
					label: dlang("details_gr_acess_assign_menu_mans","Mark as not submitted"),
					action:function(id, grid, tree_obj, index, tree){
						var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
						var assid = tree.getSelectedItemId().split('_');

						$.post("connectors/connector.php?control_id=grid_assess_assignments", {action:"makeasnotsubmitted", assid:assid[1], pid:index}, function(){
							grid.updateFromXML("connectors/connector.php?control_id=grid_assess_assignments&id="+assid[1]);
							grid.setUserData(id+"_"+index,'submitted','0');
							$("#mark_as_submitted").text(dlang("button_make_as_submitted","Mark as Submitted"));
                            assignmentHeaderUpdate();
						});
					}
				},
                {
                    id: "deactivate",
                    label: dlang("gris_assign_menu_deact","Deactivate"),
                    visible: function(id, tree){
                        var _id = id.split("_");
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
                        if(_.indexOf(["pupil"],_id[0]) == -1){
                            return false;
                        }
                        return true;
                    },
                    enabled: function(id, tree){
                        id = schoolmule.instances.grid_assess_assignments.getGrid().grid.getChildItemIdByIndex(id,0);
                        var _id = id.split("_");

                        if(_.indexOf(["a"],_id[0]) == -1){
                            return false;
                        }

                        if(schoolmule.instances.grid_assess_assignments.getGrid().grid.getUserData(id,'activate')=="0"){
                            return false;
                        }else{
                            return true;
                        }
                    },
                    action:function(id, grid, tree_obj, index, tree,stg){
                        id = schoolmule.instances.grid_assess_assignments.getGrid().grid.getChildItemIdByIndex(id+'_'+index+'_'+stg,0);
                        $.post("connectors/connector.php?control_id=grid_assess_assignments", {action:"deactivate", assid:id.split('_')[1]}, function(){
                            schoolmule.instances.grid_assess_assignments.getGrid().grid.setUserData(id,'activate','0');
                            grid.setRowTextStyle(id,"background-color:#F5F5F5; opacity:0.5;");
                            grid.setRowTextStyle( grid.getParentId(id),"background-color:#FFF; opacity:0.5");
                            var sids = grid.getSubItems(id).split(',');
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
                        var _id = id.split("_");
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
                        if(_.indexOf(["pupil"],_id[0]) == -1){
                            return false;
                        }
                        return true;
                    },
                    enabled: function(id, tree){
                        id = schoolmule.instances.grid_assess_assignments.getGrid().grid.getChildItemIdByIndex(id,0);
                        var _id = id.split("_");

                        if(_.indexOf(["a"],_id[0]) == -1){
                            return false;
                        }

                        if(schoolmule.instances.grid_assess_assignments.getGrid().grid.getUserData(id,'activate')=="1"){
                            return false;
                        }else{
                            return true;
                        }

                    },
                    action:function(id, grid, tree_obj, index, tree,stg){
                        id = schoolmule.instances.grid_assess_assignments.getGrid().grid.getChildItemIdByIndex(id+'_'+index+'_'+stg,0);
                        $.post("connectors/connector.php?control_id=grid_assess_assignments", {action:"activate", assid:id.split('_')[1]}, function(){
                            schoolmule.instances.grid_assess_assignments.getGrid().grid.setUserData(id,'activate','1');
                            grid.setRowTextStyle(id,"background-color:#FFF; opacity:1");
                            grid.setRowTextStyle( grid.getParentId(id),"background-color:#FFF; opacity:1");
                            var sids = grid.getSubItems(id).split(',');
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
					}
				},
				{
					id: "remove",
					label: "Remove assignment from pupil",
					action:function(id, grid, tree_obj, index){
						if(confirm("Delete?")){
						}
					}
				},
				{
					id: "deactivate",
					label: "Deactivate",
					action:function(id, grid, tree_obj, index){

					}
				},
				{
					id: "reactivate",
					label: "Reactivate",
					action:function(id, grid, tree_obj, index){
						//$.post(tree_obj.server_script, {action:"reactive", id:index}, function(){	});
					}
				}
				*/
				]
		
		
});

function assignmentHeaderUpdate(){
    var script = "connectors/connector.php?control_id=tree_assignments_by_studygroup";
    var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
    var assignment_id = tree.getSelectedItemId().split('_')[1];
    $.post(script, {action:"getassignmentassess",id:assignment_id}, function(json_response){
        $('main-box-header').empty();
        schoolmule.instances.html_assignments.attachTo("main-box-header",false, json_response.info);
        $('#view_submissions').click(function(){
            var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
            tree.selectItem("assignment_"+assignment_id);
        });

        $('#view_submissions img').attr('src',json_response.info.submission_image);

        setHeaderSelectItemsForAssignment(json_response)
        setSelectActions(assignment_id);

    },"json");
}