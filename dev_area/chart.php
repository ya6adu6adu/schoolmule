<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Course rooms - Course rooms</title>
		<link rel="stylesheet" type="text/css" media="screen" href="../css/main.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/form.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/layout.css" />
		<link rel="stylesheet" href="../dhtmlx/dhtmlxChart/codebase/dhtmlxchart.css" type="text/css" charset="utf-8">
		
		<script type="text/javascript" src="../js/layout.js"></script>
		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/chart.js"></script>
		<script src="../dhtmlx/dhtmlxChart/codebase/dhtmlxchart.js" type="text/javascript" charset="utf-8"></script>
		
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
		});
			
			var data = [
					{ view:20 },
					{ view:21 },
					{ view:22 },
					{ view:30 },
					{ view:28 },
					{ view:25 },
					{ view:29 },
					{ view:32 },
					{ view:38 },
					{ view:40 },
					{ view:45 },
					{ view:46 },
					{ view:47 },
					{ view:48 },
					{ view:49 },
					{ view:50 },
					{ view:51 },
					{ view:51 },
					{ view:52 },
					{ view:52 },
					{ view:52 },
					{ view:57 },
					{ view:65 },
					{ view:75 },
					{ view:88 },
					{ view:100 },
					{ view:110 },
					{ view:125 },
					{ view:140 },
					{ view:125 },
					{ view:105 },
					{ view:90 },
					{ view:70 },
					{ view:58 },
					{ view:50 },
					{ view:49 },
					{ view:47 },
					{ view:50 },
					{ view:52 },
					{ view:54 },
					{ view:54 },
					{ view:55 },
					{ view:57 },
					{ view:59 },
					{ view:60 },
					{ view:62 },
					{ view:63 },
					{ view:64 },
					{ view:65 },
					{ view:65 },
					{ view:65 },
					{ view:66 }
				];
			var	chart = new schoolmule.controls.chart("charts",{
													width : '100%',
													height : '50%',
													settings:{
														view:"line",
														container:"chart1",
														value:"#view#",
														item: {radius: 0},
														yAxis:{
															title:"Course room in view, %",
															start: 0,
															end: 200,
															step: 100
														},
														xAxis: {
															template:" ",
															title:"Weeks"
														}
													}
												}
			);
			
			chart.setData(data,"json");
			
			content.elements.push(chart);
			
			var	chart2 = new schoolmule.controls.chart("charts",{
													width : '100%',
													height : '50%',
													settings:{
														view:"line",
														container:"chart2",
														value:"#view#",
														item: {radius: 0},
														yAxis:{
															title:"Course room in view, %",
															start: 0,
															end: 200,
															step: 100
														},
														xAxis: {
															template:" ",
															title:"Weeks"
														}
													}
												}
			);
			
			chart2.setData(data,"json");
			content.elements.push(chart2);
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
					<div id="overview-body" style="top:24px">

					</div>
					<div id="overview-footer"></div>
			</div>
		</div>
	</body>
	
</html>