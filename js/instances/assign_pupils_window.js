var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};
					
schoolmule.instances.assign_pupils_window = new schoolmule.controls.window_popup({
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
			control_id : "assign_pupils_window",
			connector : connector,
			autoLoading: false,
			treewindow:true
		});
		self.storage.tree.attachTo(container);
        var tree = self.storage.tree.getTree();
        tree.enableThreeStateCheckboxes(true);
        tree.enableCheckBoxes(1);

		tree.attachEvent("onXLE", function(){
			for(var i=0; i<data.check_ids.length; i++){
				tree.setCheck(data.check_ids[i],true);
			}
		});

		self.storage.callback = data.callback;
	}
});	