var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_assignments = new schoolmule.controls.grid({	
			id: "grid_assignments",
			gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
			menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
			
			addRow: function(rId,cn,dhx){
				if(rId==1) {
					dhx.grid.cells(rId,cn).setValue("dhtmlx/dhtmlxGrid/codebase/imgs/plus.gif");
				} else {
					dhx.grid.cells(rId,cn).setValue("dhtmlx/dhtmlxGrid/codebase/imgs/minus.gif");
				}				
			},
			beforeSelectRow:  function(id,dhx,key){
                var caell = dhx.grid.cells(id,1).cell;
                $(caell).parent().addClass('norowselected');
				if(schoolmule.instances.grid_assignments.dialog_state){
					return false;
				}else{
                    //schoolmule.instances.grid_assignments.dialog_state = true;
					return true;
				}
			},
			
			load: function(grid, perf){
                grid.enableTooltips("true,true,true,true,true,true,true,false");
                $('#gridbox .objbox , body').click(function(){
                    if(grid.clearSelection){
                        grid.clearSelection();
                    }
                });
                $('.obj').click(function(event){
                    event.stopPropagation();
                });
			   grid.forEachRow(function(id){
			   		var rId = grid.getRowIndex(id);
					if(rId==0) {
						grid.cells(id,7).setValue("dhtmlx/dhtmlxGrid/codebase/imgs/plus.gif");
					}else{
						grid.cells(id,7).setValue("dhtmlx/dhtmlxGrid/codebase/imgs/minus.gif");
					}				   		
			   		var course = grid.getUserData(id, "course");
			   		var course_objective = grid.getUserData(id, "course_objectives");
			   		grid.cells(id,5).setValue(course);
			   		grid.cells(id,6).setValue(course_objective);
			   });
			   if(grid.getRowsNum()==0){
                    var item = schoolmule.instances.tree_assignments_by_studygroup.getTree().getSelectedItemId().split('_')[1];
					//$.post("connectors/connector.php?control_id=grid_assignments", {action:"add_resultset", assignment:item}, function(response){
					//	grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_assignments&item_id="+item);
					//});
			   }
			},

			selectRow: function(ind, id, dhx, options, perf, Tm, Tn){
				$(".dialog_class").remove();
				$(".ui-widget-overlay").remove();

                var popup = options.popup;
                var grid = schoolmule.instances.grid_assignments.getGrid().grid;
                var tree_selected_item = schoolmule.instances.tree_assignments_by_studygroup.getTree().getSelectedItemId().split('_')[1];
                schoolmule.instances.grid_assignments.dialog_state = false;
                if(ind==5 || ind==6){
                        schoolmule.instances.grid_assignments.dialog_state = true;
                        console.log(1);
						for(var i=0; i< popup.length; i++) {
							if(popup[i].id=="edit_course"){
								popup[i].action(id, grid, 0, 0, {tree_item:tree_selected_item});
							}
						};
				}
				if(ind==7){
					if(grid.cells(id,7).getValue().indexOf('plus.gif')+1){
                        seconfirm(dlang("runit_grid_add_conf","Add new?"),function(){
                            $.post("connectors/connector.php?control_id=grid_assignments", {action:"add_resultset", assignment:tree_selected_item}, function(response){
                                grid.updateFromXML("connectors/connector.php?act=1&control_id=grid_assignments&item_id="+tree_selected_item,true,true,function(){
                                    grid.setSizes();
                                });
                            })
                        });
					}else{
                        seconfirm(dlang("runit_grid_delete_conf","Delete?"),function(){
                            grid.deleteRow(id);
                        });
					}
				}				
			},

			editCell:function(stage,rId,cInd,nValue,oValue,grid,self){
				var dp = self.getGrid().dp;
				dp.setUpdateMode("off");
				var grades = [dlang('A'),dlang('B'),dlang('C'),dlang('D'),dlang('E'),dlang('F')];
				if(cInd==4){
					dp.sendData();
					return true;
				}
				if(stage==0){
					switch (grid.cells(grid.getSelectedRowId(),1).getValue()){
						case '1':
							return true;							
							break;
						case '2':
							if(cInd==2){
								return false
							}else{
								return true
							}	
							break;
						case '3':
							if(cInd==2||cInd==3){
								return false
							}else{
								return true
							}
							break;
						case '4':
							if(cInd==2||cInd==3){
								return false
							}else{
								return true
							}			
							break;

					}
				}	
				if(stage==2){
					if(cInd==1 || cInd==4){
						if(cInd==1){
							switch (nValue){
								case '1': 
									grid.cells(grid.getSelectedRowId(),2).setValue('');
									grid.cells(grid.getSelectedRowId(),3).setValue('');
                                    grid.cells(rId,2).setBgColor('#FEF5CA');
                                    grid.cells(rId,3).setBgColor('#FEF5CA');
                                    break;
								case '2':
									grid.cells(grid.getSelectedRowId(),2).setValue('100%');
									grid.cells(grid.getSelectedRowId(),3).setValue('');
                                    grid.cells(rId,3).setBgColor('#FEF5CA');
                                    grid.cells(rId,2).setBgColor('#FFFFFF');
									break;
								case '3':
									grid.cells(grid.getSelectedRowId(),2).setValue('A');
									grid.cells(grid.getSelectedRowId(),3).setValue('E');
                                    grid.cells(rId,2).setBgColor('#FFFFFF');
                                    grid.cells(rId,3).setBgColor('#FFFFFF');
									break;
								case '4':
									grid.cells(grid.getSelectedRowId(),2).setValue(dlang("passvalue","Pass"));
									grid.cells(grid.getSelectedRowId(),3).setValue(dlang("passvalue","Pass"));
                                    grid.cells(rId,2).setBgColor('#FFFFFF');
                                    grid.cells(rId,3).setBgColor('#FFFFFF');
									break;
                                case '5':
                                    seprompt('Name of new result unit:','',function(name){
                                        if(name!=''){
                                            $.post("connectors/connector.php?control_id=grid_assignments", {action:"addrunit", name:name, rset:rId}, function(response){
                                                var combo = grid.getCombo(1);
                                                combo.put(response,name);
                                                grid.cells(rId,2).setBgColor('#FEF5CA');
                                                grid.cells(rId,3).setBgColor('#FEF5CA');
                                                grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_assignments&item_id="+schoolmule.instances.tree_assignments_by_studygroup.getTree().getSelectedItemId().split('_')[1]);
                                            })
                                        }else{
                                            grid.cells(grid.getSelectedRowId(),1).setValue(1);
                                        }
                                    });
                                    grid.cells(grid.getSelectedRowId(),2).setValue('');
                                    grid.cells(grid.getSelectedRowId(),3).setValue('');
                                   break;
                                case '7':
                                    /*
                                    var cont = $('<div title="Result Units"><div id="runit_grid" style="width: 100%; height: 220px;"></div></div>');
                                    $('body').append(cont);
                                    schoolmule.instances.grid_runit.attachTo('runit_grid');
                                    cont.dialog({
                                        autoOpen: true,
                                        modal: true,
                                        width: 360,
                                        height: 300,
                                        resizable: false,
                                        buttons: {

                                            "Delete Checked": function() {
                                                var gridp = schoolmule.instances.grid_runit.getGrid().grid;
                                                var checked = gridp.getCheckedRows(0).split(',');
                                                $.post("connectors/connector.php?control_id=grid_assignments", {action:"deleterunit", units:gridp.getCheckedRows(0)}, function(response){
                                                    for(var i=0;i<checked.length;i++){
                                                        gridp.deleteRow(checked[i]);
                                                    }
                                                    grid.cells(rId,1).setBgColor('#FEF5CA');
                                                    grid.cells(rId,2).setBgColor('#FEF5CA');
                                                    grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_assignments&item_id="+schoolmule.instances.tree_assignments_by_studygroup.getTree().getSelectedItemId().split('_')[1]);
                                                });
                                                //cont.dialog( "destroy" );
                                                //cont.remove();
                                            },

                                            "Close": function() {
                                                grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_assignments&item_id="+schoolmule.instances.tree_assignments_by_studygroup.getTree().getSelectedItemId().split('_')[1]);
                                                cont.dialog( "destroy" );
                                                cont.remove();
                                            }
                                        },
                                        beforeClose: function( event, ui ) {
                                            cont.dialog( "destroy" );
                                            cont.remove();
                                        }
                                    });
                                    */
                                    return false;
                                default:
                                    $.post("connectors/connector.php?control_id=grid_assignments", {action:"editrunit", id:oValue, value:nValue}, function(response){
                                        grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_assignments&item_id="+schoolmule.instances.tree_assignments_by_studygroup.getTree().getSelectedItemId().split('_')[1]);
                                        var combo = grid.getCombo(1);
                                       // console.log(combo.values);
                                        combo.values[parseInt(oValue-1)] = nValue;
                                    });

                                    return false;
                                    //var combo = grid.getCombo(0);
							}
                            var combo = grid.getCombo(1);

                            grid.cells(grid.getSelectedRowId(),0).setValue(combo.values[nValue-1]);
						}

						dp.sendData();

                        $.post("connectors/connector.php?control_id=grid_assignments", {action:"clear_results", id:rId});

						return true;
					}
					if(cInd==2){
						var runit = grid.cells(grid.getSelectedRowId(),1).getValue();
						switch (runit){
							case '1':
								var val = parseInt(nValue);
                                grid.cells(rId,2).setBgColor('#FEF5CA');
                                grid.cells(rId,3).setBgColor('#FEF5CA');
								if(!isNaN(val) && val>=0){
									grid.cells(rId,cInd).setValue(val+'p');
									dp.sendData();
									return true;
								}	
								break;
							case '2': 
								var val = parseInt(nValue);
								if(!isNaN(val) && val <=100 && val>=0){
									grid.cells(rId,cInd).setValue(val+'%');
									dp.sendData();
                                    grid.cells(rId,3).setBgColor('#FEF5CA');
									return true;
								}	
								break;
							case '3':
								var val = nValue.toUpperCase();
								if(grades.join().search(val) != -1){
									grid.cells(rId,cInd).setValue(val);
									dp.sendData();
									return true;
								}
		
								break;
							case '4':
								var val = nValue.toLowerCase();
								if(val == dlang("runit_grid_pass_lc","pass")){
									grid.cells(rId,cInd).setValue(dlang("runit_grid_pass","Pass"));
									dp.sendData();
									return true;
								}
                            default:
                                var val = parseInt(nValue);
                                if(!isNaN(val) && val>=0){
                                    grid.cells(rId,cInd).setValue(val+'p');
                                    dp.sendData();
                                    return true;
                                }
                                break;
						}						
					}
					
					if(cInd==3){
						var runit = grid.cells(grid.getSelectedRowId(),1).getValue();
						switch (runit){
							case '1':
								var val = parseInt(nValue);
								if(!isNaN(val) && val>=0 && val<=parseInt(grid.cells(grid.getSelectedRowId(),2).getValue())){
									grid.cells(rId,cInd).setValue(val+'p');
									dp.sendData();
									return true;
								}	
								break;
							case '2': 
								var val = parseInt(nValue);
								if(!isNaN(val) && val>=0 && val <=100 && val<=parseInt(grid.cells(grid.getSelectedRowId(),2).getValue())){
									grid.cells(rId,cInd).setValue(val+'%');
									dp.sendData();
									return true;
								}	
								break;
							case '3':
								var val = nValue.toUpperCase();
								if(grades.join().search(val) != -1 && grades.join().search(val)>=grades.join().search(grid.cells(grid.getSelectedRowId(),2).getValue())){
									grid.cells(rId,cInd).setValue(val);
									dp.sendData();
									return true;
								}
		
								break;
							case '4':
								var val = nValue.toLowerCase();
								if(val == "pass"){
									grid.cells(rId,cInd).setValue(dlang("runit_grid_pass","Pass"));
									dp.sendData();
									return true;
								}
								break;
                            default:
                                var val = parseInt(nValue);
                                if(!isNaN(val) && val>=0 && val<=parseInt(grid.cells(grid.getSelectedRowId(),2).getValue())){
                                    grid.cells(rId,cInd).setValue(val+'p');
                                    dp.sendData();
                                    return true;
                                }
                                break;
						}						
					}
                    if(cInd==0){
                        dp.sendData();
                        return true;
                    }
					
					$('#gridbox .rowselected td').css('font-weight','normal');
                    alert('Either you have inputed higher pass value than max, or you have written unvalid text');
					return false;
				}
				return true;
			},
			
			showMenu: function(){return 0},
			popup: [
                {
					id: "add",
					label: dlang("runit_grid_menu_add","Add new result unit"),
					action: function(id,grid){
						var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
						var tree_selected_item = tree.getSelectedItemId().split('_')[1];
                        seconfirm(dlang("runit_grid_add_conf","Add new result unit?"),function(){
                            $.post("connectors/connector.php?control_id=grid_assignments", {action:"add_resultset", assignment:tree_selected_item}, function(response){
                                grid.updateFromXML("connectors/connector.php?act=1&control_id=grid_assignments&item_id="+tree_selected_item,true,true,function(){
                                    grid.setSizes();
                                });
                            })
                        });
					}
   
				},
                {
					id: "delete",
					label: dlang("runit_grid_menu_delete","Delete this result unit"),
					action: function(id, grid){
                        seconfirm(dlang("runit_grid_add_conf","Add new?"),function(){
                            $.post("connectors/connector.php?control_id=grid_assignments", {action:"delete_resultset", assignment:id}, function(response){
                                grid.deleteRow(id);
                            })
                        });
					}
				},
                {
					id: "edit_course",
					label: dlang("runit_grid_assign_object","Assign objectives"),
					action:function(id,grid,f,m,data){
						var tree_id = data.tree_item;
						var checked = null;
						$.post("connectors/connector.php?control_id=tree_window", {action:"getchecked", resultset:id , type:"assignment"}, function(response){
							var treestg = schoolmule.instances.tree_assignments_by_studygroup.getTree();
							var curstg = treestg.getParentId(treestg.getSelectedItemId());
							var _curstg = curstg.split('_');
							/*response.push('stg_'+_curstg[1]);*/
							schoolmule.instances.window_greed_tree.show({
								container : "add-treebox",
								check_ids:response,
								callback: function(ids, tree){
									var text = dlang("runit_grid_obj_dialog","Make linked copy of assignment also in Studygroup")+" ";
									var br = tree.getAllCheckedBranches();
									var _br = br.split(',');
									var addflag = true;
									var newstg = Array();
                                    var newstgid = Array();
									var stgs = Array();
									var treestg = schoolmule.instances.tree_assignments_by_studygroup.getTree();
									var curstg = treestg.getParentId(treestg.getSelectedItemId());
									var assign = treestg.getSelectedItemId();
									var _curstg = curstg.split('_');
									//var sstg = grid.cells(grid.getSelectedRowId(),5).getValue();
									for(var i=0;i<_br.length;i++){
										var temp = _br[i].split('_');
										if(temp[0]=='stg' && temp[1]!=_curstg[1]){
											newstg.push(tree.getItemText(_br[i]));
                                            newstgid.push(temp[1]);
											//addflag = false;
										}
										if(temp[0]=='stg'){
											stgs.push(temp[1]);
										}
									}
                                    var prev_stgs = treestg.getUserData(assign,"stgs");


									if(newstg.length>1){
										text = dlang("runit_grid_obj_dialog2","Make linked copy of assignment also in Studygroups:")+" ";
									}

                                    for(var j=0; j<newstgid.length;j++){
                                        if(_.indexOf(prev_stgs.split(','),newstgid[j]) != -1){
                                            addflag = true;
                                        }
                                    }

                                    var saveAssignmentTree = function(){

                                        var co_ids = Array();

                                        for(var i=0;i<ids.length;i++){
                                            var temp = ids[i].split('_');
                                            if(temp[0]=='courseobjective'){
                                                co_ids.push(temp[1]);
                                            }
                                        }
                                        var stgs_string = stgs.join(',');
                                        var assign = treestg.getSelectedItemId();
                                        var assign_ = assign.split('_');

                                        var real_stg = treestg.getParentId('assignment_'+tree_id).split('_');

/*                                        if(stgs_string.indexOf(real_stg[1])==-1){
                                            alert(dlang("runit_grid_dialog_alert","You must chose at least one objective in parent studygroup!"));
                                            return false;
                                        }*/

                                        if(co_ids.length==0){
                                            alert(dlang("runit_grid_dialog_alert","You must chose at least one objective!"));
                                            return false;
                                        }

                                        $.post("connectors/connector.php?control_id=tree_window", {action:"savetree", 'ids[]':co_ids, resultset:id,  type:"assignment",  stgs:stgs_string, aid:assign_[1]}, function(){
                                            grid.updateFromXML("connectors/connector.php?act=1&control_id=grid_assignments&item_id="+tree_id);
                                            treestg.smartRefreshBranch(0,"connectors/connector.php?control_id=tree_assignments_by_studygroup&refresh=1");
                                            treestg.setUserData(assign,"stgs",stgs.join());
                                            /*
                                            for(var i=0; i < treestg.hasChildren('mystg'); i++){
                                                var citem = treestg.getChildItemIdByIndex("mystg",i);
                                                if(citem==curstg){
                                                    continue;
                                                }else{
                                                    var stgroups = treestg.getUserData(assign,"stgs").split(',');
                                                    if(_.indexOf(stgroups,citem.split('_')[1]) != -1){
                                                        treestg.deleteChildItems(citem);
                                                    }else{
                                                        continue;
                                                    }
                                                }
                                                treestg.smartRefreshBranch(citem,"connectors/connector.php?control_id=tree_assignments_by_studygroup&refresh=1");
                                            };
                                            */
                                        });
                                    }
									if(addflag){
                                        saveAssignmentTree();
									}else{
                                        seconfirm(text+newstg.join(', '),saveAssignmentTree);
										return false;
									}
								},
								tree_type: "assignment",
								tree_id: tree_id
							});
						},"json");		
					}
				}
				]
})

