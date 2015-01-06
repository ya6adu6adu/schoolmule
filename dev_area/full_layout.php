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
		<script type="text/javascript" src="../dhtmlx/dhtmlxAjax/codebase/dhtmlxcommon.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxTree/codebase/dhtmlxtree.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxMenu/codebase/dhtmlxmenu.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxMenu/codebase/ext/dhtmlxmenu_ext.js"></script>
		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/jquery-ui.js"></script>
		<script type="text/javascript" src="../js/layout.js"></script>				
		<script type="text/javascript" src="../js/tree.js"></script>
		<script type="text/javascript" src="../js/window.js"></script>
		<script type="text/javascript" src="../js/window_tree.js"></script>		
		<script>
		$(function(){		
			content = new schoolmule.controls.layout({
					cellsBlock: {
								display_footer_right: true,
								cells_right:[
												{
													cells:[{
														new_count : false,
														id : "main-box-header",
														title: "",
														width: '100%',
														height: '65px',
														border_bottom: true
													}]									
												},
												{
													cells:[
													{
														new_count : true,
														id : "gridbox",
														title: "",
														width: '100%',
														height: '88px'			
													}
													]													
												},
												{													
													cells:[
													{
														new_count : true,
														id : "content_assignments",
														title: "Assignment description for pupils",
														content: "Present view 2",
														width: '100%',
														height: '100%',
														border_right: true,
													},													
													{
														new_count : true,
														id : "notes_assignments",
														title: "Teachers private notes",
														content: "Present view",
														width: '270px',
														height: '100%',				
													}
													]
												}
										     ]
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