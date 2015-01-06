<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Course rooms - Course rooms</title>
		<link rel="stylesheet" type="text/css" media="screen" href="../css/main.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="../css/layout.css" />	
		<script type="text/javascript" src="../js/layout.js"></script>
		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../tinymce/tiny_mce.js" ></script>
		<script type="text/javascript" src="../js/editor.js"></script>	
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
													id : "editor1",
													title: "Assignment description for pupils",
													content: "Present view",
													width: '50%',
													height: '100%',
													border_right: true					
												},
												{
													new_count : true,
													id : "editor2",
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
						
		var tiny = new schoolmule.controls.editor("editor1",["Grade A","Grade B","Grade C"],{
			type: "small",
			active_area: "editor1_content"
		});
		
		tiny.setContent(
						{"Grade A" : 'content 1'},
						{"Grade B" : 'content 2'},
						{"Grade C" : 'content 3'}
					   );
		content.elements.push(tiny);
		var optionsSelect = [{label:"Grade A",value:"Grade A"},{label:"Grade B",value:"Grade B"},{label:"Grade C",value:"Grade C"}];
							
		content.setHeaderSelect("editor1", optionsSelect, function(val){ 
			tiny.selectEditor(val);				
		});

		var tiny2 = new schoolmule.controls.editor("editor2",["Grade A","Grade B","Grade C"],{
			type: "text",
			active_area: "editor2_content"
		});
		
		content.appendElement(tiny2);	
	})		
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
		</div>
	</body>
	
</html>