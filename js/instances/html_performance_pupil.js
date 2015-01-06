var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_performance_pupil = new schoolmule.controls.html({
	onGetTemplate: function(){
		var template = '\
				<div class="template">\
					<div style="float:left;">\
						<div id = "name" > <strong><%= name.label %>: </strong><span> <%= name.value %></span></div>\
						<div id = "studygroup" > <strong><%= studygroup.label %>: </strong><span> <%= studygroup.value %></span></div>\
					</div>\
                <div style="float:left; margin-left: 20px">\
                    <div style="display: block !important;" id="activation_date"> <strong><%= activation_date.label %>: </strong><span> <%= activation_date.value %></span></div>\
				</div>\
				</div>\
		';
		return template;
    },

	onGetDefaultData: function(){
		var data = {
            assignment_publication:{
                label:dlang("det_asses_hd_publ","Publication"),
                value:dlang("header_asignment_view_submission","View Submissions")
            },
            activation_date:{
                label:dlang("det_asses_hd_act","Activation"),
                value:dlang("header_asignment_view_submission","View Submissions")
            },
            deadline_date:{
                label:dlang("det_asses_hd_dl","Deadline"),
                value:dlang("header_asignment_view_submission","View Submissions")
            },
			name:{
				label:dlang("header_perform_name","Name"),
				value:dlang("defaults")
			},
			studygroup:{
				label:dlang("header_perform_stg","Studygroup"),
				value:dlang("defaults")
			}
		};
		return data;
	}
})