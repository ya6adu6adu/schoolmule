<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Course rooms - Course rooms</title>
		<link rel="stylesheet" type="text/css" media="screen" href="../css/main.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/form.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/layout.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/jquery-ui.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/window.css" />
		<link rel="stylesheet" type="text/css" href="../dhtmlx/dhtmlxTree/codebase/dhtmlxtree.css">
		
		<script type="text/javascript" src="../js/layout.js"></script>
		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/jquery-ui.js"></script>
		<script type="text/javascript" src="../js/window.js"></script>
		<script type="text/javascript" src="../js/tree.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxAjax/codebase/dhtmlxcommon.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxTree/codebase/dhtmlxtree.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxMenu/codebase/dhtmlxmenu.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxMenu/codebase/ext/dhtmlxmenu_ext.js"></script>
				
		<script>
		$(function(){	
			var window = new schoolmule.instances.window('window-dialog',{
			    checked_ids: ["i0000","i0001","i0011"],
				buttons: {
					"Add to assignment": function(){
						var tree = window.storage.tree.getTree();
						var ids = tree.getAllChecked();
						var hide = window.storage.callback(ids.split(","));
						if(hide){
							window.hide();
						}
					}
				},
				onBeforeShow : function(container, data){
					var xml = "../dhtmlx/xml/tree-cr-add-dialog.xml";
					window.storage.tree = new schoolmule.controls.tree({
						treeImagePath:"../dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/",
						connector : "getxml.php?xml="+xml,
					});
					window.storage.tree.attachTo(container);
					var tree = window.storage.tree.getTree();
					tree.enableCheckBoxes(true, false);
					tree.enableThreeStateCheckboxes(true);
					tree.attachEvent("onXLE", function(){
						tree.openAllItems(0);
						for(var i=0; i<data.check_ids.length; i++){
							tree.setCheck(data.check_ids[i],true);
						}
					});
					
					window.storage.callback = data.callback;
				}
			});
			
			window.show({
				container : "add-treebox",
				check_ids:["i0000","i0001","i0011"],
				callback: function(ids){
					alert(JSON.stringify(ids));
					return false;
				}
			});
																								
		});
				
	</script>
	</head>
	<body>
		<div id="container">
			<div id="page-wrap">
				<div id="main-content">
					<div class="box-caption">
						<div class="expand_btn" id="hide-navigation" title="comment_0016"></div>
						<span class="after_expand_btn" id="title_expand"></span>
					</div>
					<div id="overview-body" style="top:24px"></div>
					<div id="overview-footer"></div>
			</div>
		</div>
	</body>
</html>