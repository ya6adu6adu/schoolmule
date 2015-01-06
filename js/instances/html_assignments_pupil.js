var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_assignments_pupil = new schoolmule.controls.html({
	onGetTemplate: function(){
		var template = '\
			<div class="template">\
				<div style="float:left;">\
					<div id="assignment_name"> <strong><%= assignment_name.label %>: </strong><span> <%= assignment_name.value %></span></div>\
					<div id="assignment_stg"> <strong><%= assignment_stg.label %>: </strong><span> <%= assignment_stg.value %></span></div>\
					<div id="room"> <strong><%= room.label %>: </strong><span> <%= room.value %></span></div>\
				</div>\
				<div style="float:left; margin-left: 20px">\
				    <div style="display: block !important;" id="assignment_publication"> <strong><%= assignment_publication.label %>: </strong><span> <%= assignment_publication.value %></span></div>\
					<div style="display: block !important;" id="activation_date"> <strong><%= activation_date.label %>: </strong><span> <%= activation_date.value %></span></div>\
					<div style="display: block !important;" id="deadline_date"> <strong><%= deadline_date.label %>: </strong><span> <%= deadline_date.value %></span></div>\
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
            room:{
                label:dlang("det_asses_hd_room","Courseroom"),
                value:dlang("header_asignment_view_submission","View Submissions")
            },
            view_submissions:{
                label:dlang("header_asignment_view_submission","View Submissions"),
                value:dlang("header_asignment_view_submission","View Submissions")
            },
            submission_image:{
                label:"submission",
                value:"submission"
            },
			assignment_name:{
				label:dlang("header_asignment_name","Name"),
				value:dlang("defaults")
			},
			assignment_id:{
				label:dlang("header_asignment_id","ID"),
				value:dlang("defaults")
			},
			assignment_stg:{
				label:dlang("header_asignment_stg","Studygroup"),
				value:dlang("defaults")
			},
			assignment_subm_total:{
				label:dlang("header_asignment_subm_totla","Subm. total"),
				value:dlang("defaults")
			},
			assignment_subm_submitted:{
				label:dlang("header_asignment_subm_submitted","Subm. submitted"),
				value:dlang("defaults")
			},
			assignment_subm_not_assesed:{
				label:dlang("header_asignment_subm_not_assess","Subm. not assesed"),
				value:"defaults"
			},
			assignment_subm_not_passed:{
                label:dlang("header_asignment_subm_npass","Subm. not passed"),
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
