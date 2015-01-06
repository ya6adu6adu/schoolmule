<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Course rooms - Course rooms</title>
		<link rel="stylesheet" type="text/css" media="screen" href="../css/pages.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/controls/form.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/controls/layout.css" />
		
		<link rel="stylesheet" type="text/css" href="../dhtmlx/dhtmlxWindows/codebase/dhtmlxwindows.css">
    	<link rel="stylesheet" type="text/css" href="../dhtmlx/dhtmlxWindows/codebase/skins/dhtmlxwindows_dhx_skyblue.css">
    	<link rel="stylesheet" type="text/css" href="../dhtmlx/dhtmlxWindows/codebase/skins/dhtmlxwindows_dhx_web.css">
    	<link rel="stylesheet" type="text/css" href="../dhtmlx/dhtmlxCalendar/codebase/dhtmlxcalendar.css">
    	<link rel="stylesheet" type="text/css" href="../dhtmlx/dhtmlxCalendar/codebase/skins/dhtmlxcalendar_omega.css">
		<link rel="stylesheet" type="text/css" href="../dhtmlx/dhtmlxCalendar/codebase/skins/dhtmlxcalendar_dhx_skyblue.css">

    	
    	<script type="text/javascript" src="../dhtmlx/dhtmlxCalendar/codebase/dhtmlxcalendar.js"></script>
		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/controls/layout.js"></script>
		<script type="text/javascript" src="../js/instances/form_pupils.js"></script>
		
		<script type="text/javascript" src="../dhtmlx/dhtmlxTree/codebase/dhtmlxcommon.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxWindows/codebase/dhtmlxcontainer.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxWindows/codebase/dhtmlxwindows.js"></script>

		<script type="text/javascript" src="../dhtmlx/dhtmlxConnector/php/codebase/dhtmlxdataprocessor.js"></script>
		
		
		<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxForm/codebase/skins/dhtmlxform_dhx_skyblue.css">
		<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxForm/codebase/skins/dhtmlxform_dhx_web.css">
		<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxForm/codebase/skins/dhtmlxform_dhx_terrace.css">		
		<script type="text/javascript" src="dhtmlx/dhtmlxForm/codebase/dhtmlxform.js"></script>
		<script type="text/javascript" src="dhtmlx/dhtmlxForm/codebase/ext/dhtmlxform_item_calendar.js"></script>
	    <script type="text/javascript" src="dhtmlx/dhtmlxForm/codebase/ext/dhtmlxform_item_upload.js"></script>
		<script type="text/javascript" src="dhtmlx/dhtmlxForm/codebase/ext/swfobject.js"></script>
		
		<script>
		$(function(){
		var content = new schoolmule.controls.layout({
		cellsBlock: {
					display_footer_right: true,
					display_footer_left: true,
					cells_left:[
									{
										id : "nav-header"						
									},
									{
										id : "nav-body"
									}
						   	   	],
					cells_right:[
									{													
										cells:[
										{
											id : "form_pupils",
											width: '100%',
											height: '100%',
										}
										]
									}
							     ]
			  }
		});
		
		var pupForm = new schoolmule.instances.form_pupils("form_pupils",{});
		content.elements.push(pupForm);	
			
		content.setTitle("main-content","Pupils form");
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
					<div id="overview-footer">
						<div id="buttons-left" style="left: 8px"></div>
						<div id="buttons-right"></div>									
					</div>
				</div>
			</div>
		</div>
	</body>
	
</html>