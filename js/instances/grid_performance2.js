var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_performance = new schoolmule.controls.grid({
	id: "grid_performance",
	gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
	menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
	
	setConfig:function(grid,control,perf){
		grid.setHeader(dlang("perf_grid_assessment","Performance assessment")+','+dlang("perf_grid_stgs","Studygroups")+','+dlang("perf_grid_co","Course objectives")+' '+dlang("runit_perfgrid_click_info","(click cell to assign objectives)")+',');
		grid.setInitWidthsP("40,15,41.5,3.5");
		grid.setColTypes("ro,ro,ro,img");
        grid.enableTooltips("true,true,true,false");
        grid.setColumnColor("white,#FEF5CA,#FEF5CA,white");
		grid.setColumnIds("grade,course,course_objectives,img");
		grid.loadXML(control+'&performance='+perf);
	},

    beforeSelectRow:  function(id,dhx,key){
        var caell = dhx.grid.cells(id,1).cell;
        $(caell).parent().addClass('norowselected');
        if(schoolmule.instances.grid_assignments.dialog_state){
            return false;
        }else{
            schoolmule.instances.grid_assignments.dialog_state = true;
            return true;
        }
    },

	selectRow: function(ind,id,dhx,options,perf){
		$(".dialog_class").remove();
		$(".ui-widget-overlay").remove();
        schoolmule.instances.grid_assignments.dialog_state = false;
        var tree_selected_item = schoolmule.instances.tree_assignments_by_studygroup.getTree().getSelectedItemId().split('_')[1];
        var grid = schoolmule.instances.grid_performance.getGrid().grid;
        if(ind==1 || ind==2){
            schoolmule.instances.grid_assignments.dialog_state = true;
			for(var i=0; i< options.popup.length; i++) {
				if(options.popup[i].id=="edit_course"){
					options.popup[i].action(id, grid ,0,0,{tree_item: tree_selected_item});
				}
			}
		}

        if(ind==3){
            if(grid.cells(id,3).getValue().indexOf('plus.gif')+1){
                seconfirm(dlang("perf_details_grid_add_dialog","Add new?"),function(){
                    $.post("connectors/connector.php?control_id=grid_performance", {action:"add_resultset", performance: tree_selected_item}, function(response){
                        grid.updateFromXML("connectors/connector.php?act=1&control_id=grid_performance&performance="+tree_selected_item,true,true,function(){
                            grid.setSizes();
                        });
                    })
                });
            }else{
                seconfirm(dlang("perf_details_grid_delete_dialog","Delete?"),function(){
                    $.post("connectors/connector.php?control_id=grid_performance", {action:"delete_resultset", resultset: id}, function(response){
                        grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_performance&performance="+tree_selected_item);
                    });
                });
            }
        }
	},
		
	popup: [
		{
			id: "edit_course",
			label: dlang("perf_details_grid_menu_edit", "Edit course"),
			action:function(id,grid,f,m,data){
					var tree_id = data.tree_item;
					var checked = null;
					$.post("connectors/connector.php?control_id=tree_window", {action:"getchecked", resultset:id, type:"performance"}, function(response){
                        console.log(response);
						var treestg = schoolmule.instances.tree_assignments_by_studygroup.getTree();
						var curstg = treestg.getParentId(treestg.getSelectedItemId());
						var _curstg = curstg.split('_');
						//response.push('stg_'+_curstg[1]);
						schoolmule.instances.window_greed_tree.show({
							container : "add-treebox",
							check_ids:response,
							callback: function(ids,tree){
									var text = dlang("perf_details_grid_dailog_alert","Make linked copy of assignment also in Studygroup")+" ";
									var br = tree.getAllCheckedBranches();
									var _br = br.split(',');
									var addflag = true;
									var newstg = Array();
									var stgs = Array();
									var treestg = schoolmule.instances.tree_assignments_by_studygroup.getTree();
									var curstg = treestg.getParentId(treestg.getSelectedItemId());
									var _curstg = curstg.split('_');
									//var sstg = grid.cells(grid.getSelectedRowId(),1).getValue();

									for(var i=0;i<_br.length;i++){
										var temp = _br[i].split('_');
										if(temp[0]=='stg' && temp[1]!=_curstg[1]){
											newstg.push(tree.getItemText(_br[i]));
											//addflag = false;
										}
										
										if(temp[0]=='stg'){
											stgs.push(temp[1]);
										}
									}
									
									if(newstg.length>1){
										text = dlang("perf_details_grid_dailog_alert2","Make linked copy of performance also in Studygroups:")+" ";
									}
                                    var savePerformanceGrid = function(){
                                        var co_ids = Array();
                                        for(var i=0;i<ids.length;i++){
                                            var temp = ids[i].split('_');
                                            if(temp[0]=='courseobjective'){
                                                co_ids.push(temp[1]);
                                            }
                                        }
                                        var stgs_string = stgs.join(',');
                                        var perform = treestg.getSelectedItemId();
                                        var perform_ = perform.split('_');
                                        var real_stg = treestg.getParentId('performance_'+tree_id).split('_');
                                        if(co_ids.length==0){
                                            alert(dlang("perf_details_grid_dailog_alert3","You must chose at least one objective!"));
                                            return false;
                                        }

/*                                        if(stgs_string.indexOf(real_stg[1])==-1){
                                            alert(dlang("perf_details_grid_dailog_alert3","You must chose at least one objective in parent studygroup!"));
                                            return false;
                                        }*/

                                        $.post("connectors/connector.php?control_id=tree_window", {action:"savetree", 'ids[]':co_ids, resultset:id, type:"performance",  stgs:stgs_string, pid:perform_[1]}, function(){
                                            grid.updateFromXML("connectors/connector.php?act=1&control_id=grid_performance&performance="+tree_id);
                                            treestg.smartRefreshBranch(0,"connectors/connector.php?control_id=tree_assignments_by_studygroup");
                                            /*
                                            for(var i=0; i < treestg.hasChildren('mystg'); i++){
                                                var citem = treestg.getChildItemIdByIndex("mystg",i);
                                                if(citem==curstg){
                                                    continue;
                                                }else{
                                                    treestg.deleteChildItems(citem);
                                                }
                                                treestg.smartRefreshBra(citem,"connectors/connector.php?control_id=tree_assignments_by_studygroup&refresh=1");
                                            };
                                            */
                                        });
                                    }

									if(addflag){
                                        savePerformanceGrid();
										return true;
									}else{
                                        seconfirm(text+newstg.join(', '),savePerformanceGrid);
										return false;
									}
								},
									
								tree_type: "performance",
								tree_id: tree_id
						});
					},"json");							
			}
		}	
	]
})