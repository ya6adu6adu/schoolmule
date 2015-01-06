var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_assess_performance = new schoolmule.controls.grid({		
			id: "grid_assess_performance",
			gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
			menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
			dp:false,
			openTree: function(id,dhx,state){
				
				$(".ev_dhx_skyblue").next(".odd_dhx_skyblue").next(".ev_dhx_skyblue").removeClass('norowselected');
				var nsel = $(".ev_dhx_skyblue").next(".odd_dhx_skyblue").next(".ev_dhx_skyblue");
				while(nsel.next(".ev_dhx_skyblue").size()>0){
					nsel = nsel.next(".ev_dhx_skyblue")
					nsel.removeClass('norowselected');
				}

                var ids = dhx.grid.getSelectedRowId();
                if(ids){
                    var _id = ids.split("_");
                    if((_id[0]=="p" || _id[0]=="a")){
                        dhx.grid.clearSelection();
                    }
                }
			},

            selectRow: function(ind, id, dhx, Toptions, Tf, funcs,tree_sel){
                var _id = id.split("_");
                //var tree_selected_item = schoolmule.instances.tree_assignments_by_studygroup.getTree().getSelectedItemId().split('_')[1];
                if(_id[0]=="p" || _id[0]=="a"){
                    var caell = dhx.grid.cells(id,1).cell;
                    $(caell).parent().addClass('norowselected');
                }
                switch (_id[0]){
                    case "pupil":
                        funcs.actions.pupil(tree_sel,_id[1]);
                        return id;
                    default:
                        return null;
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

                /*
				$(".ev_dhx_skyblue").next(".odd_dhx_skyblue").next(".ev_dhx_skyblue").removeClass('norowselected');
				
				var nsel = $(".ev_dhx_skyblue").next(".odd_dhx_skyblue").next(".ev_dhx_skyblue");
				nsel.addClass('norowselected');
				
				while(nsel.next(".ev_dhx_skyblue").size()>0){
					nsel = nsel.next(".ev_dhx_skyblue");
					nsel.removeClass('norowselected');
					nsel.addClass('norowselected');
				}
				*/
				return true;	
			},
						
			setConfig: function(mygrid,script,id){
				mygrid.setHeader(dlang("gris_assess_perf_pname","Pupil name")+','+dlang("gris_assess_perf_assess","Assessment"));
				mygrid.setInitWidthsP("88,12");
				mygrid.setColAlign("left,left");
				mygrid.setColTypes("tree,co,ro");
				mygrid.kidsXmlFile = script;
				mygrid.loadXML(script+'&id='+id);				
			},

            load: function(){
                var hashValues = Hash.get();
                var grid = schoolmule.instances.grid_assess_performance.getGrid().grid;
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

			showMenu: function(id){
				return true;
			},
			
			editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj){
				var _id = rId.split("_");
				if(_id[0]=="pupil" || cInd==0){
					return false;
				}
				if(stage == 2){
					if(nValue=="F"||nValue=="Fx"){
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
					})
				}
				return true;
			},
			
			popup: [
				{
					id: "expand",
					label: dlang("gris_assess_perf_menu_exp","Expand"),
					action: function(id, grid, tree_obj, index){
						grid.expandAll();			
					}
				},
				{
					id: "collapse",
					label: dlang("gris_assess_perf_menu_coll","Collapse"),
					action: function(id, grid, tree_obj, index){
						grid.collapseAll();
					}
				},
				{
					id: "delete",
					label: dlang("gris_assess_perf_menu_rem","Remove"),
                    visible: function(id, tree){
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
                        return true;
                    },
					action: function(id, grid, tree_obj, index){
                        seconfirm(dlang("Delete?"),function(){
                            $.post(tree_obj.server_script, {action:"remove", id:index}, function(){
                                grid.deleteSelectedItem()
                            })
                        });
					}
				},{
					id: "deactive",
					label: dlang("gris_assess_perf_menu_deact","Deactivate"),
                    visible: function(id, tree){
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
                        return true;
                    },
					action:function(id, grid, tree_obj, index){
						alert(id);
						$.post(tree_obj.server_script, {action:"deactive", id:index}, function(){
						})
											
					}
				},
				{
					id: "reactive",
					label: dlang("gris_assess_perf_menu_react","Reactivate"),
                    visible: function(id, tree){
                        if(schoolmule.main.user_role!='staff' && schoolmule.main.user_role!='superadmin'){
                            return false;
                        }
                        return true;
                    },
					action:function(id, grid, tree_obj, index){
						$.post(tree_obj.server_script, {action:"reactive", id:index}, function(){
							
						});
					}
				}
				]
		
		
})