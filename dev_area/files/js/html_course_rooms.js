var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_course_rooms = new schoolmule.controls.html({
	onGetTemplate: function(){
		var template = '\
				<div class="template">\
					<div style="float:left;">\
						<div id = "course_room_name" > <strong><%= course_room_name.label %> :</strong><span> <%= course_room_name.value %></span></div>\
						<div id = "course_room_courses" > <strong><%= course_room_courses.label %> :</strong> <%= course_room_courses.value %></div>\
						<div id = "course_room_elements" > <strong><%= course_room_elements.label %> :</strong> <%= course_room_elements.value %></div>\
					</div>\
					<div style="float:left; margin-left:50px;">\
						<div id="course_room_assignments"> <strong><%= course_room_assignments.label %> :</strong> <%= course_room_assignments.value %></div>\
						<div id="course_room_teachers"> <strong><%= course_room_teachers.label %> :</strong> <%= course_room_teachers.value %></div>\
						<div id="course_room_new_submissions"> <strong><%= course_room_new_submissions.label %> :</strong> <%= course_room_new_submissions.value %></div>\
					</div>\
				</div>\
		';
		return template;
    },
	onGetDefaultData: function(){
		var data = {
			course_room_name:{
				label:"Course room name",
				value:"defaults"
			},
			course_room_courses:{
				label:"Courses in room",
				value:"defaults"
			},
			course_room_elements:{
				label:"Course room elements",
				value:"defaults"
			},
			course_room_assignments:{
				label:"Assignments",
				value:"defaults"
			},
			course_room_teachers:{
				label:"Teacher(s)",
				value:"defaults"
			},
			course_room_new_submissions:{
				label:"New submissions not assessed",
				value:"defaults"
			}
		};
		return data;
	}
})
