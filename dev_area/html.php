<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Course rooms - Course rooms</title>
		<link rel="stylesheet" type="text/css" media="screen" href="../css/main.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/layout.css" />
    	
   		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/layout.js"></script>
		<script type="text/javascript" src="../js/html.js"></script>
		<script type="text/javascript" src="../js/html_course_rooms.js"></script>
		<script type="text/javascript" src="../js/html_submissions.js"></script>
		
		
		<script>
		$(function(){
			var	content = new schoolmule.controls.layout({
			cellsBlock: {
				dispaly_footer : true,
				header : true,
				cells: [{
							id : "header",
							title: "Objective description",
							type : 'header',
							width: '100%',
							height: '42px'
					},{
						cellsr:[{
								new_count : true,
								id : "editor1",
								title: "",
								content: "Present view",
								width: '100%',
								height: '42px'
							},{
								new_count : true,
								id : "editor2",
								title: "",
								content: "Present view",
								width: '100%',
								height: '42px'
							}],
							
				}]	
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
					<div id="overview-footer">
						<div id="buttons-left" style="left: 8px"></div>
						<div id="buttons-right"></div>									
					</div>
				</div>
			</div>
		</div>
	</body>
	
</html>