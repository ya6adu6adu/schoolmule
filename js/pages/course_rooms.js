$(function(){
	schoolmule.main.callback = viewRooms;
	if(schoolmule.main.user_id==null){
		schoolmule.main.showLogin();
	}else{
		viewRooms();
	}
});

function viewRooms(){
	var content = null;
	var script = "connectors/connector.php?control_id=tree_course_rooms";
	var navigation = new schoolmule.controls.layout({
	cellsBlock:{
		display_footer_left: true,
		cells_left:[
						{
							id : "nav-header"						
						},
						{
							id : "nav-body"
						}
			   	   	],
		cells_right:[]
		}
	});
	
	navigation.setTitle("navigation","Course room navigation");

	var acc = new schoolmule.controls.accordeon("nav-body",{});
	navigation.elements.push(acc);
		
	schoolmule.instances.tree_courserooms.attachTo("course_rooms",{actions:{
			"room": function(room_id){
				
				if(content){
					content.destroy();
				}
				
				// Ivan: I don't like that in the situation when we need jusat redray right part - we create new layout, which shgould create new layout ... for left part too. May be better aadd functions setLeftCells and setRightCells? And no need to destroy it
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
												height: '51px',
												border_bottom: true
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
				
				content.showLoader();
				var tiny = null;
				
				$.post(	script,
						{
							action:"getroom",
							id:room_id
						},
						function(json_response){
							content.hideLoader();
							tiny = new schoolmule.controls.editor(["room"],{
								container : "room_editor",
								type: "text",
								active_area: "room_editor_content",
								content : json_response.description
							});								
							schoolmule.instances.html_course_rooms.attachTo("main-box-header",false,json_response.info);
							content.elements.push(tiny);
						},
						"json"
				);	
									

				content.attachButtons([
					{	
						label : "Save",
						id : "save",
						callback : function(){
							content.showLoader();
							var room_description = tiny.getContent();
							$.post(
									script, 
									{
										action:"putroom",
										id:room_id,
										description:room_description
								 	},
								 	function(data){
										content.hideLoader();
									}
							);								
						}
					}
				]);
				
									
				content.setTitle("main-content","Course room");		
			},
				
			"assignment": function(assignment_id){
				if(content){
					content.destroy();
					content = null;
				}
				content = new schoolmule.controls.layout({
				cellsBlock: {
							display_footer_right: true,
							cells_right:[
											{
												cells:[{
													new_count : false,
													id : "main-box-header",
													title: "",
													width: '98%',
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
													border_right: true
												},													
												{
													new_count : true,
													id : "notes_assignments",
													title: "Teachers private notes",
													content: "Present view",
													width: '270px',
													height: '100%'
												}
												]
											}
									     ]
					  }
				});
				
				var tinyContent = null;
				var tinyNotes = null;
				content.showLoader();
				$.post(script, {action:"getassignment",id:assignment_id}, function(json_response){
					content.hideLoader();
					tinyContent = new schoolmule.controls.editor(["content"],{
						container : "content_assignments",
						type: "assignment",
						active_area: "content_assignments_content",
						content:json_response.content
					});
		
					tinyNotes = new schoolmule.controls.editor(["notes"],{
						container : "notes_assignments",
						type: "assignment_small",
						active_area: "notes_assignments_content",
						content:json_response.notes
					});
					schoolmule.instances.html_submissions.attachTo("main-box-header",false,json_response.info);
					schoolmule.instances.grid_assignments.attachTo("gridbox");
					content.elements.push(tinyNotes);
					content.elements.push(tinyContent);
				},"json");	
				
									
				content.attachButtons([
					{	
						label : "Save",
						id : "save",
						callback : function(){
							content.showLoader();
							var assignment_content = tinyContent.getContent();
							var assignment_notes = tinyNotes.getContent();
							$.post(script,
								{
									action:"putassignment",
									id:assignment_id,
									content:assignment_content,
									notes:assignment_notes
								},
								function(data){
									content.hideLoader();
								}
							);							
						}
					}
				]);
				
				content.setTitle("main-content","Assignment details");
			},
				
			"section": function(){
				if(content){
					content.destroy();
					content = null;
				}
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
				
				content.setTitle("main-content","Course room section");
				
				var tiny = new schoolmule.controls.editor(["Grade A","Grade B","Grade C"],{
					container : "room_editor",
					type: "text",
					active_area: "room_editor_content"
				});
				
				content.elements.push(tiny);
			},
			
			"element": function(){
				if(content){
					content.destroy();
					content = null;
				}
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
				
				content.setTitle("main-content","Course room element");
				
				var tiny = new schoolmule.controls.editor(["Grade A","Grade B","Grade C"],{
					container: "room_editor",
					type: "text",
					active_area: "room_editor_content"
				});
				
				content.elements.push(tiny);
			}		
	}});
	
	
	var tabbar = new schoolmule.controls.tabs({
		container:"second-menu",
		tabs_left:{
				id:'left-tab', 
				callback: function(){
				}, 
				label:'courserooms',
				select: false
			},
		tabs: [
			{
				id:'courserooms', 
				callback: function(){
				}, 
				label:'courserooms',
				select: true
			}
		]
	
	});
}		




