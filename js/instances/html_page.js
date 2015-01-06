var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_page = new schoolmule.controls.html({
	onGetTemplate: function(){
		var template = '\
			<div class="template">\
				<div style="float:left;">\
					<div id="page_name"> <strong><%= page_name.label %>: </strong><span> <%= page_name.value %></span></div>\
					<div id="course_room" > <strong><%= course_room.label %>: </strong> <span><%= course_room.value %></span></div>\
					<div id="study_groups" > <strong><%= study_groups.label %>: </strong> <span><%= study_groups.value %></span></div>\
				</div>\
			</div>\
		';
		return template;
    },
	onGetDefaultData: function(){
		var data = {
            page_name:{
				label:dlang("header_page_name","Name"),
				value:dlang("defaults")
			},
            course_room:{
				label:dlang("header_page_room","Course room"),
				value:dlang("defaults")
			},
            study_groups:{
                label:dlang("header_page_stg","Studygroup(s)"),
                value:dlang("defaults")
            }
		};
		return data;
	}
/*	onDraw: function(){
		this.setValues({
			assignment_publication:"Forward from activation",
			assignment_deadline:"At date #"
		});
		this.getValues();
	
	}
	*/
})
