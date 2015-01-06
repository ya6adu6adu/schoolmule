var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};
					
schoolmule.instances.window_greed_tree = new schoolmule.controls.window_popup({
	// Ivan: bad place for such variables. I have told that we know IDS not here... but in the place we call "show".
	checked_ids: ["i0000","i0001","i0011"],
	connector: "connectors/connector.php",
	title: dlang("popup_assign_objectives_title","Assign objectives"),
    buttons: [
        {
            text:dlang("popup_assign_objectives_button_assign","Assign"),
            click:function(){
                var self = $(this).dialog('option', 'self');
                schoolmule.instances.grid_assignments.dialog_state = false;

                var tree = self.storage.tree.getTree();
                var ids = tree.getAllChecked();
                var hide = self.storage.callback(ids.split(","),tree);

                if(hide){
                    tree.destructor();
                    self.hide();
                    self.win_dialog.dialog("destroy");
                    self.win_dialog.remove();
                }
            }
        },
        {
            text:dlang("popup_assign_objectives_button_cancel","Cancel"),
            click:function(){
                var self = $(this).dialog('option', 'self');
                schoolmule.instances.grid_assignments.dialog_state = false;
                if(self.storage.tree){
                    var tree = self.storage.tree.getTree();
                    tree.destructor();
                }
                self.win_dialog.dialog("destroy");
                self.win_dialog.remove();
            }
        }
    ],
	onBeforeShow : function(container, data, self, connector){
		if(data.tree_type=="performance"){
			connector+='?performance='+data.tree_id;
		}else if(data.tree_type=="assignment"){
			connector+='?assignment='+data.tree_id;
		}

		self.storage.tree = new schoolmule.controls.tree({
			treeImagePath:"dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/",
			control_id : "tree_window",
			connector : connector,
            treewindow:true,
			autoLoading: false
		});

		self.storage.tree.attachTo(container);
		var tree = self.storage.tree.getTree();
		tree.enableCheckBoxes(true, true);
		tree.enableThreeStateCheckboxes(true);
		tree.attachEvent("onXLE", function(){
			tree.openAllItems(0);
			var stg_tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
			var assign = stg_tree.getSelectedItemId();
			var stg = stg_tree.getParentId(assign).split("_");
			if(stg[0]=="performance"){
				stg = stg_tree.getParentId(stg[0]+'_'+stg[1]).split("_");
			}
			
			while(inda!=0){
				var inda = tree.getIndexById("stg_"+stg[1]);
				if(inda==null)
					break;
				tree.moveItem("stg_"+stg[1],'up_strict');
			}
			for(var i=0; i<data.check_ids.length; i++){
				tree.setCheck(data.check_ids[i],true);
			}
		});
		
		// Ivan:callback is not very good name for here. for example we need two events.... BGetter to call them as events (onAddClicked, onClear, etc.) It will be easier to work with such namings.
		self.storage.callback = data.callback;
	}
});	