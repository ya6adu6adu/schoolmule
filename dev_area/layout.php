<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Course rooms - Course rooms</title>
		<link rel="stylesheet" type="text/css" media="screen" href="../css/main.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/layout.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/accordeon.css" />
		<link rel="stylesheet" type="text/css" href="../dhtmlx/dhtmlxTree/codebase/dhtmlxtree.css">	
		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/accordeon.js"></script>
		<script type="text/javascript" src="../js/layout.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxAjax/codebase/dhtmlxcommon.js"></script>
		<script type="text/javascript" src="../dhtmlx/dhtmlxTree/codebase/dhtmlxtree.js"></script>
		<script>
		$(function(){
			var content = new schoolmule.controls.layout({
			/*  ===========two blocks of 50%================
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
												new_count : true,
												id : "charts",
												title: "Assignment description for pupils",
												content: "Present view",
												width: '50%',
												height: '100%',
												border_right: true					
											},
											{
												new_count : true,
												id : "right",
												title: "Teachers private notes",
												content: "Present view 2",
												width: '50%',
												height: '100%',
												border_right: false
											}
									]
									}
							     ]
			  }
				   
			  */
			/* ===========one block with header================
					cellsBlock: {
					display_footer_right: true,
					cells_left:[],
					cells_right:[
								{
									cells:[{
										new_count : false,
										id : "main-box-header",
										title: "",
										width: '100%',
										height: '51px'
									}]									
								},
								{
									cells:[{
										new_count : true,
										id : "room_editor",
										title: "",
										width: '100%',
										height: '100%'				
										}
										]
									}
							     ]
			    }
			   });
			 */
			
			/* ===========one block with header================
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
										cells:[{
											new_count : false,
											id : "main-box-header",
											title: "",
											width: '100%',
											height: '42px'
										}]									
									},
									{
										cells:[{
											new_count : true,
											id : "editor12",
											title: "Assignment description for pupils",
											content: "Present view",
											width: '250px',
											height: '100%',
											border_right: true					
										},
										{
											new_count : true,
											new_line : true,
											id : "editor1",
											title: "Teachers private notes",
											content: "Present view 2",
											width: '100%',
											height: '100%',
											border_right: true
										},
										{
											new_count : true,
											id : "chart-preview1",
											title: "Teachers private notes",
											content: "Present view 2",
											width: '250px',
											height: '250px'
										},
										{
											new_count : false,
											id : "chart-preview123",
											title: "Teachers private notes",
											content: "Present view 2",
											width: '250px',
											height: '250px'
										}
										]
									}
							     ]
			  }
			  */
		});
		
		content.setTitle("navigation","Navigation");
		content.setTitle("main-content","Content");

		//var acc = new schoolmule.controls.accordeon("nav-body",{
		//});
		
		content.elements.push(acc);
	})		
	</script>
	</head>
	<body>
		<div id="container">
			<div id="page-wrap">
				<div id="navigation">
					<div class="box-caption"></div>
				</div>	
				<div id="main-content">
					<div class="box-caption">
						<div class="expand_btn" id="hide-navigation" title="comment_0016"></div>
					</div>
					<div id="overview-body" style="top:24px"></div>
				</div>
			</div>
		</div>
	</body>
</html>