<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Course rooms - Course rooms</title>
		<link rel="stylesheet" type="text/css" media="screen" href="../css/main.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/form.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/layout.css" />
		<link rel="stylesheet" href="../dhtmlx/dhtmlxScheduler/codebase/dhtmlxscheduler.css" type="text/css" charset="utf-8">
		
		<script type="text/javascript" src="../js/layout.js"></script>
		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/scheduler.js"></script>
		<script src="../dhtmlx/dhtmlxScheduler/codebase/dhtmlxscheduler.js" type="text/javascript" charset="utf-8"></script>
		
		<script>
		$(function(){
			var content = new schoolmule.controls.layout({
			cellsBlock: {
						display_footer_left: true,
						display_footer_right: true,
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
												id : "scheduler_here",
												title: "",
												content: "Present view",
												width: '100%',
												height: '100%'
											}									
										]
									}
							     ]
			  }
		});
					
		var	scheduler = new schoolmule.controls.scheduler("scheduler_here",{events : "dhtmlx/xml/events.xml"});
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