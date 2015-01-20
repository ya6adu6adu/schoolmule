var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_course_objectives = new schoolmule.controls.html({
	onGetTemplate: function(){
		var template = '\
				<div class="template">\
					<div style="float:left; margin-top: 2px;">\
						<div id = "course_objectives_objective" > <strong><%= course_objectives_objective.label %>: </strong><span> <%= course_objectives_objective.value %></span></div>\
						<div id = "course_objectives_programme"> <strong><%= course_objectives_programme.label %>: </strong><span> <%= course_objectives_programme.value %></span></div>\
						<div id="course_objectives_teachers"> <strong><%= course_objectives_teachers.label %>: </strong> <span><%= course_objectives_teachers.value %></span></div>\
					</div>\
					<div style="float:left; margin-left:50px;margin-top: 2px;">\
						<div id="course_objectives_weight"> <strong><%= course_objectives_weight.label %>: </strong><span> <%= course_objectives_weight.value %></span></div>\
						<input id="course_objectives_weight_input" value="<%= course_objectives_weight.value %>">\
						<div id="course_objectives_course"> <strong><%= course_objectives_course.label %>: </strong><span> <%= course_objectives_course.value %></span></div>\
					</div>\
					<div style="float:right;  margin-right:0px;">\
					    <button id="change_course_objectives_weight" class="button">'+dlang("headre_objective_change_weight","Objective weight")+'</button>\
					\</div>\
				</div>\
		';
		return template;
    },
	onGetDefaultData: function(){
		var data = {
			course_objectives_objective:{
				label:dlang("headre_objective_obj","Objective"),
				value:dlang("defaults")
			},
            course_objectives_course:{
                label:dlang("headre_objective_course","Course code"),
                value:dlang("defaults")
            },
			course_objectives_objective_group:{
				label:dlang("headre_objective_objgr","Objective group"),
				value:dlang("defaults")
			},
			course_objectives_subject:{
				label:dlang("headre_objective_stg2","Studygroup"),
				value:dlang("defaults")
			},
			course_objectives_programme:{
				label:dlang("headre_objective_stg2","Studygroup"),
				value:dlang("defaults")
			},
			course_objectives_teachers:{
				label:dlang("headre_objective_teacers","Teacher(s)"),
				value:dlang("defaults")
			},
			course_objectives_weight:{
				label:dlang("headre_objective_weight","Weight"),
				value:dlang("defaults")
			}
		};
		return data;
	}
})
