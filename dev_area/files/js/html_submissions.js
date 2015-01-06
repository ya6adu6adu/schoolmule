var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_submissions = new schoolmule.controls.html({
	onGetTemplate: function(){
		var template = '\
			<div class="template">\
				<div style="float:left;">\
					<div id="assignment_name"> <strong><%= assignment_name.label %> :</strong><span> <%= assignment_name.value %></span></div>\
					<div id="assignment_id" > <strong><%= assignment_id.label %> :</strong> <%= assignment_id.value %></div>\
					<div id="assignment_courseroom"> <strong><%= assignment_courseroom.label %> :</strong> <%= assignment_courseroom.value %></div>\
					<div id="assignment_element" > <strong><%= assignment_element.label %> :</strong> <%= assignment_element.value %></div>\
				</div>\
				<div style="float:left; margin-left:50px;">\
					<div id="assignment_subm_total"> <strong><%= assignment_subm_total.label %> :</strong> <%= assignment_subm_total.value %></div>\
					<div id="assignment_subm_submitted"> <strong><%= assignment_subm_submitted.label %> :</strong> <%= assignment_subm_submitted.value %></div>\
					<div id="assignment_subm_not_assesed"> <strong><%= assignment_subm_not_assesed.label %> :</strong> <%= assignment_subm_not_assesed.value %></div>\
					<div id="assignment_subm_not_passed"> <strong><%= assignment_subm_not_passed.label %> :</strong> <%= assignment_subm_not_passed.value %></div>\
				</div>\
				<div style="float:right; margin-left:10px;">\
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
					<div style="float:left; margin-left:5px;">\
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
				label:"Name",
				value:"defaults"
			},
			assignment_id:{
				label:"ID",
				value:"defaults"
			},
			assignment_courseroom:{
				label:"Course room",
				value:"defaults"
			},
			assignment_element:{
				label:"Element",
				value:"defaults"
			},
			assignment_subm_total:{
				label:"Subm. total",
				value:"defaults"
			},
			assignment_subm_submitted:{
				label:"Subm. submitted",
				value:"defaults"
			},
			assignment_subm_not_assesed:{
				label:"Subm. not assesed",
				value:"defaults"
			},
			assignment_subm_not_passed:{
				label:"Subm. not passed",
				value:"defaults"
			},
			publication:{
				label:"Publication",
				options:[{
						label:"Always",
						value:"Always"
					},{
						label:"Untill deadline",
						value:"Untill deadline"
					},{
						label:"Forward from activation",
						value:"Forward from activation"
					},{
						label:"Activation to deadline",
						value:"Activation to deadline"
				}]
			},
			activation:{
				label:"Activation",
				options:[{
						label:"Always",
						value:"Always"
					},{
						label:"With element",
						value:"With element"
					},{
						label:"Next lesson",
						value:"Next lesson"
					},{
						label:"At lesson #",
						value:"At lesson #"
					},{
						label:"At week",
						value:"At week"
					},{
						label:"At date",
						value:"At date"
					},{
						label:"Now",
						value:"Now"
				}]
			},
			deadline:{
				label:"Deadline",
				options:[{
						label:"No deadline",
						value:"No deadline"
					},{
						label:"After # lessons",
						value:"After # lessons"
					},{
						label:"After # weeks",
						value:"After # weeks"
					},{
						label:"Before lesson #",
						value:"Before lesson #"
					},{
						label:"During lesson #",
						value:"During lesson #"
					},{
						label:"At date #",
						value:"At date #"
					},{
						label:"Now",
						value:"Now"
				}]
			}
		};
		return data;
	},
	onDrow: function(){
		this.setValues({
			assignment_publication:"Forward from activation",
			assignment_deadline:"At date #"
		});
		this.getValues();
	
	}
	
})
