var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_performance = new schoolmule.controls.html({
	onGetTemplate: function(){
		var template = '\
				<div class="template">\
					<div style="float:left;">\
						<div id = "name" > <strong><%= name.label %>: </strong><span> <%= name.value %></span></div>\
						<div id = "studygroup" > <strong><%= studygroup.label %>: </strong><span> <%= studygroup.value %></span></div>\
						<div id="view_assessments"><img /> <span style=" cursor:pointer; position: relative; top:-3px;"><%= view_assessments.value %></span></div>\
					</div>\
                    <div style="float:right; margin-left:10px;margin-right:0px;">\
                        <div style="float:left; margin-top: 1px; line-height:19px;" class="select_template_label">\
                            <div style="text-align:right;height: 17px;">\
                                <strong><%= activation.label %>:</strong>\
                            </div>\
                        </div>\
                        <div style="float:left; margin-left:5px; margin-right:0px; ">\
                            <div style="width: 140px; height: 17px">\
                                <span class="select" style="width: 117px; " id="selectprognose"></span>\
                                <select id="assignment_activation" class="styled" title="comment_0050" name="goal" style="width:140px;">\
                                    <% for(var i=0;i< activation.options.length; i++){ %>\
                                        <option value="<%= activation.options[i].value%>"><%= activation.options[i].label %> </option>\
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
            view_assessments:{
                label:dlang("header_asignment_view_assessments","View Assessments"),
                value:dlang("header_asignment_view_assessments","View Assessments")
            },
            assessments_image:{
                label:"assessments",
                value:"assessments"
            },
			name:{
				label:dlang("header_perform_name","Name"),
				value:dlang("defaults")
			},
			studygroup:{
				label:dlang("header_perform_stg","Studygroup"),
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
                label:dlang("det_asses_hd_publ","Publication"),
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
})