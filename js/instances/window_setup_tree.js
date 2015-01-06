var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};
					
schoolmule.instances.window_setup_tree = new schoolmule.controls.window_popup({
	checked_ids: [],
	connector: "connectors/connector.php",
	title: dlang("popup_setup_title","Assign content"),
    buttons: [
        {
            text:dlang("popup_setup_button_assign","Assign"),
            click:function(){
                var self = $(this).dialog('option', 'self');
                var tree = self.storage.tree.getTree();
                var ids = tree.getAllChecked();
                var hide = self.storage.callback(ids.split(","))
                if(hide){
                    tree.destructor();
                    self.hide();
                    self.win_dialog.dialog("destroy");
                    self.win_dialog.remove();
                }
            }
        },
        {
            text:dlang("popup_setup_button_cancel","Cancel"),
            click:function(){
                var self = $(this).dialog('option', 'self');
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

		self.storage.tree = new schoolmule.controls.tree({
			treeImagePath:"dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/",
			control_id : "tree_setup_window",
			connector : connector,
			autoLoading: false,
            select:false,
			treewindow:true
		});
		self.storage.tree.attachTo(container);
        var tree = self.storage.tree.getTree();
        tree.enableThreeStateCheckboxes(true);
        tree.enableCheckBoxes(1);

		tree.attachEvent("onXLE", function(){
            /*
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
			*/
			for(var i=0; i<data.check_ids.length; i++){
				tree.setCheck(data.check_ids[i],true);
			}

		});

		self.storage.callback = data.callback;
	}
});	