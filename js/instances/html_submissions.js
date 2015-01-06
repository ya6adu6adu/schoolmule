var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_submissions = new schoolmule.controls.html({
	onGetTemplate: function(){
		var template = '\
			<div class="template">\
				<div style="float:left;">\
					<div id="assignment_name"> <strong><%= assignment_name.label %>: </strong><span> <%= assignment_name.value %></span></div>\
					<div id="assignment_id" > <strong><%= assignment_id.label %>: </strong> <span><%= assignment_id.value %></span></div>\
					<div id="assignment_courseroom"> <strong><%= assignment_courseroom.label %>: </strong><span> <%= assignment_courseroom.value %></span></div>\
					<div id="assignment_element" > <strong><%= assignment_element.label %>: </strong> <span><%= assignment_element.value %></span></div>\
				</div>\
				<div style="float:left; margin-left:50px;">\
					<div id="assignment_subm_total"> <strong><%= assignment_subm_total.label %>: </strong> <span><%= assignment_subm_total.value %></span></div>\
					<div id="assignment_subm_submitted"> <strong><%= assignment_subm_submitted.label %>: </strong> <span><%= assignment_subm_submitted.value %></span></div>\
					<div id="assignment_subm_not_assesed"> <strong><%= assignment_subm_not_assesed.label %>: </strong> <span><%= assignment_subm_not_assesed.value %></span></div>\
					<div id="assignment_subm_not_passed"> <strong><%= assignment_subm_not_passed.label %>: </strong> <span><%= assignment_subm_not_passed.value %></span></div>\
				</div>\
				<div style="float:right; margin-left:10px;margin-right:0px;">\
					<div style="float:left; margin-top: -1px; line-height:19px;">\
						<div style="text-align:right;">\
							<strong><%= publication.label %>:</strong>\
						</div>\
						<div style="text-align:right;">\
							<strong><%= activation.label %>:</strong>\
						</div>\
						<div style="text-align:right;">\
							<strong><%= deadline.label %>:</strong>\
						</div>\
					</div>\
					<div style="float:left; margin-left:5px; margin-right:0px; ">\
						<div>\
							<span class="select" style="width: 117px; " id="selectgoal">Always</span>\
							<select id="assignment_publication" class="styled" title="comment_0050" name="goal" style="width:140px;">\
								<% for(var i=0;i< publication.options.length; i++){ %>\
									<option value="<%= publication.options[i].value%>"><%= publication.options[i].label %> </option>\
								<% }%>\
							</select>\
						</div>\
						<div style="margin-top: 2px;">\
							<span class="select" style="width: 117px; " id="selectprognose">Always</span>\
							<select id="assignment_activation" class="styled" title="comment_0050" name="goal" style="width:140px;">\
								<% for(var i=0;i< activation.options.length; i++){ %>\
									<option value="<%= activation.options[i].value%>"><%= activation.options[i].label %> </option>\
								<% }%>\
							</select>\
						</div>\
						<div style="margin-top: 2px;">\
							<span class="select" style="width: 117px; " id="selectgrade">No deadline</span>\
							<select id="assignment_deadline" class="styled" title="comment_0050" name="goal" style="width:140px;">\
								<% for(var i=0;i< deadline.options.length; i++){ %>\
									<option value="<%= deadline.options[i].value%>"><%= deadline.options[i].label %> </option>\
								<% }%>\
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
			assignment_name:{
				label:dlang("Name"),
				value:dlang("defaults")
			},
			assignment_id:{
				label:dlang("ID"),
				value:dlang("defaults")
			},
			assignment_stg:{
				label:dlang("Studygroup"),
				value:dlang("defaults")
			},
			assignment_subm_total:{
				label:dlang("Subm. total"),
				value:dlang("defaults")
			},
			assignment_subm_submitted:{
				label:dlang("Subm. submitted"),
				value:dlang("defaults")
			},
			assignment_subm_not_assesed:{
				label:dlang("Subm. not assesed"),
				value:"defaults"
			},
			assignment_subm_not_passed:{
				label:dlang("Subm. NPassed"),
				value:dlang("defaults")
			},
			publication:{
				label:dlang("Publication"),
				options:[{
						label:dlang("Always"),
						value:dlang("Always")
					},{
						label:dlang("Untill deadline"),
						value:dlang("Untill deadline")
					},{
						label:dlang("Forward from activation"),
						value:dlang("Forward from activation")
					},{
						label:dlang("Activation to deadline"),
						value:dlang("Activation to deadline")
					},{
						label:dlang("Not set"),
						value:dlang("Not set")
					}
				]
			},
			activation:{
				label:dlang("Activation"),
				options:[{
						label:dlang("Always"),
						value:dlang("Always")
					},{
						label:dlang("At week nr."),
						value:dlang("At week nr.")
					},{
						label:dlang("A date and time"),
						value:dlang("A date and time")
					},{
						label:dlang("Now"),
						value:dlang("Now")
					},{
						label:dlang("Not set"),
						value:dlang("Not set")
					}				
					]
			},
			deadline:{
				label:dlang("Deadline"),
				options:[{
						label:dlang("No deadline"),
						value:dlang("No deadline")
					},{
						label:dlang("After # weeks"),
						value:dlang("After # weeks")
					},
					{
						label:dlang("At date and time"),
						value:dlang("At date and time")
					},{
						label:dlang("Now"),
						value:dlang("Now")
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
