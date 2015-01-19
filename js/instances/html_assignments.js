var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_assignments = new schoolmule.controls.html({
	onGetTemplate: function(){
		var template = '\
			<div class="template">\
				<div style="float:left;">\
					<div id="assignment_name"> <strong><%= assignment_name.label %>: </strong><span> <%= assignment_name.value %></span></div>\
					<div id="assignment_stg"> <strong><%= assignment_stg.label %>: </strong><span> <%= assignment_stg.value %></span></div>\
					<div id="view_submissions"><img /> <span style=" cursor:pointer; position: relative; top:-3px;"><%= view_submissions.value %></span></div>\
				</div>\
				<div style="float:left; margin-left:50px;">\
				    <div id="assignment_subm_total"> <strong><%= assignment_subm_total.label %>: </strong> <span><%= assignment_subm_total.value %></span></div>\
					<div id="assignment_subm_submitted"> <strong><%= assignment_subm_submitted.label %>: </strong> <span><%= assignment_subm_submitted.value %></span></div>\
					<div id="assignment_subm_not_assesed"> <strong><%= assignment_subm_not_assesed.label %>: </strong> <span><%= assignment_subm_not_assesed.value %></span></div>\
					<div id="assignment_subm_not_passed"> <strong><%= assignment_subm_not_passed.label %>: </strong> <span><%= assignment_subm_not_passed.value %></span></div>\
				</div>\
				<div style="float:right; margin-left:10px;margin-right:0px;">\
					<div style="float:left; margin-top: -1px; line-height:19px;" class="select_template_label">\
						<div style="text-align:right;height: 17px;margin-top: 2px;">\
							<strong><%= publication.label %>:</strong>\
						</div>\
						<div style="text-align:right;height: 17px;margin-top: 2px;">\
							<strong><%= activation.label %>:</strong>\
						</div>\
						<div style="text-align:right;height: 17px;margin-top: 2px;">\
							<strong><%= deadline.label %>:</strong>\
						</div>\
					</div>\
					<div style="float:left; margin-left:5px; margin-right:0px; ">\
						<div style="width: 140px; height: 17px">\
							<span class="select" style="width: 117px; " id="selectgoal">Always</span>\
							<select id="assignment_publication" class="styled" title="comment_0050" name="goal" style="width:140px;">\
								<% for(var i=0;i< publication.options.length; i++){ %>\
									<option value="<%= publication.options[i].value%>"><%= publication.options[i].label %> </option>\
								<% }%>\
								<option value="none"></option>\
							</select>\
						</div>\
						<div style="margin-top: 2px; width: 140px; height: 17px">\
							<span class="select" style="width: 117px; " id="selectprognose">Always</span>\
							<select id="assignment_activation" class="styled" title="comment_0050" name="goal" style="width:140px;">\
								<% for(var i=0;i< activation.options.length; i++){ %>\
									<option value="<%= activation.options[i].value%>"><%= activation.options[i].label %> </option>\
								<% }%>\
								<option value="none"></option>\
							</select>\
						</div>\
						<div style="margin-top: 2px; width: 140px; height: 17px">\
							<span class="select" style="width: 117px; " id="selectgrade">No deadline</span>\
							<select id="assignment_deadline" class="styled" title="comment_0050" name="goal" style="width:140px;">\
								<% for(var i=0;i< deadline.options.length; i++){ %>\
									<option value="<%= deadline.options[i].value%>"><%= deadline.options[i].label %> </option>\
								<% }%>\
                                <option value="none"></option>\
							</select>\
						</div>\
					</div>\
				</div>\
			</div>\
		';
		return template;
    },
	onGetDefaultData: function(){
		var data = {
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
			},
			publication:{
				label:dlang("det_asses_hd_publ","Publication"),
				options:[{
						label:dlang("details_assess_submiss_header_always_select","Always"),
						value:"Always"
					},{
						label:dlang("details_assess_submiss_header_untill_deadline","Untill deadline"),
						value:"Untill deadline"
					},{
						label:dlang("details_assess_submiss_header_ffa","Forward from activation"),
						value:"Forward from activation"
					},{
						label:dlang("details_assess_submiss_header_act_to_dl","Activation to deadline"),
						value:"Activation to deadline"
					},{
						label:dlang("details_assess_submiss_header_notset","Not set"),
						value:"Not set"
					}
				]
			},
			activation:{
				label:dlang("det_asses_hd_act","Activation"),
				options:[{
						label:dlang("details_assess_submiss_header_always_select","Always"),
						value:"Always"
					},{
						label:dlang("details_assess_submiss_header_at_week_nr","At week nr."),
						value:"At week nr."
					},{
						label:dlang("details_assess_submiss_header_atdate_select","A date and time"),
						value:"A date and time"
					},{
						label:dlang("details_assess_submiss_header_now_select","Now"),
						value:"Now"
					},{
						label:dlang("details_assess_submiss_header_not_set_select","Not set"),
						value:"Not set"
					}				
					]
			},
			deadline:{
				label:dlang("det_asses_hd_dl","Deadline"),
				options:[{
						label:dlang("details_assess_submiss_header_nodeadline_select","No deadline"),
						value:"No deadline"
					},{
						label:dlang("details_assess_submiss_header_afterweeks_select","After # weeks"),
						value:"After # weeks"
					},
					{
						label:dlang("details_assess_submiss_header_atdate_select","At date and time"),
						value:"At date and time"
					},{
                        label:dlang("details_assess_submiss_header_now_select","Now"),
                        value:"Now"
				}]
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
