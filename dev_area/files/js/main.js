$(function(){
		var content = new schoolmule.controls.layout({
			cellsBlock: {
				display_footer_left: true,
				display_footer_right: true,
				cells_left:[{
					id : "nav-header"						
				},{
					id : "nav-body"
				}],
				cells_right:[{
						cells:[{
								new_count : false,
								id : "main-box-header",
								title: "",
								width: '100%',
								height: '150px'
							},{
								new_count : false,
								id : "main-box-header2",
								title: "",
								width: '100%',
								height: '200px'
							}]									
						},{
							cells:[]
						}
				]}
		});
		schoolmule.instances.tree_courserooms.attachTo("nav-body");
		//schoolmule.instances.html_course_rooms.attachTo("main-box-header");
		schoolmule.instances.grid_assignments.attachTo("main-box-header2");
		schoolmule.instances.html_submissions.attachTo("main-box-header");
});