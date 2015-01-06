var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_pupil_assessment_by_stg = new schoolmule.controls.html({
    standart_process:true,
	onGetTemplate: function(){
		var template = '\
			<div class="template">\
				<div style="float:left; margin-right:10px">\
					<div id="photo"><img src="<%= photo.value %>"/></div>\
				</div>\
				<div style="float:left;">\
					<div id="pupil_name"> <strong><%= pupil_name.label %>: </strong><span> <%= pupil_name.value %></span></div>\
					<div id="studygroup" > <strong><%= studygroup.label %>: </strong> <span><%= studygroup.value %></span></div>\
					<div id="teacher"> <strong><%= teacher.label %>: </strong> <span><%= teacher.value %></span></div>\
					<div id="points"> <strong><%= points.label %>: </strong> <span><%= points.value %></span></div>\
				</div>\
				<div style="float:left; margin-left:10px;">\
					<div id="startdate"> <strong><%= startdate.label %>: </strong> <span><%= startdate.value %></span></div>\
					<div id="enddate"> <strong><%= enddate.label %>: </strong> <span><%= enddate.value %></span></div>\
				</div>\
				<div style="float:right; margin-right:0px;">\
					<div style="float:left; margin-top: -1px; line-height:19px;">\
						<div style="text-align:right;">\
							<strong><%= goal.label %>:</strong>\
						</div>\
						<div style="text-align:right;">\
							<strong><%= prognose.label %>:</strong>\
						</div>\
						<div style="text-align:right;">\
							<strong><%= grade.label %>:</strong>\
						</div>\
					</div>\
					<div style="float:left; margin-left:5px;">\
						<div>\
							<span class="select" style="width: 117px; " id="selectgoal">A</span>\
							<select id="goal" class="styled" title="comment_0050" name="goal" style="width:140px;">\
								<% for(var i=0;i< goal.options.length; i++){ %>\
									<option value="<%= goal.options[i].value%>"><%= goal.options[i].label %> </option>\
								<% }%>\
							</select>\
						</div>\
						<div style="margin-top: 2px;">\
							<span class="select" style="width: 117px; " id="selectprognose">A</span>\
							<select id="prognose" class="styled" title="comment_0050" name="prohnose" style="width:140px;">\
								<% for(var i=0;i< prognose.options.length; i++){ %>\
									<option value="<%= prognose.options[i].value%>"><%= prognose.options[i].label %> </option>\
								<% }%>\
							</select>\
						</div>\
						<div style="margin-top: 2px;">\
							<span class="select" style="width: 117px; " id="selectgrade">A</span>\
							<select id="grade" class="styled" title="comment_0050" name="grade" style="width:140px;">\
								<% for(var i=0;i< grade.options.length; i++){ %>\
									<option value="<%= grade.options[i].value%>"><%= grade.options[i].label %> </option>\
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
			photo:{
                label:dlang("header_obj_prog_pname","Pupil name"),
				value:"images/pupil.png"
			},
			pupil_name:{
                label:dlang("header_pupil_name","Pupil name"),
				value:dlang("defaults")
			},
			course:{
				label:dlang("header_obj_prog_course","Course"),
				value:dlang("defaults")
			},
			studygroup:{
				label:dlang("header_obj_prog_stg","Studygroup"),
				value:dlang("defaults")
			},
			teacher:{
				label:dlang("header_obj_prog_teacher","Teacher"),
				value:dlang("defaults")
			},
			points:{
				label:dlang("header_obj_prog_pts","Points"),
				value:dlang("defaults")
			},
			startdate:{
				label:dlang("header_obj_prog_sdate","Startdate"),
				value:dlang("defaults")
			},
			enddate:{
				label:dlang("header_obj_prog_edate","Enddate"),
				value:dlang("defaults")
			},
			prognose:{
				label:dlang("header_obj_prog_progn","Prognose"),
				options:[
                    {
                        label:"",
                        value:""
                    },
					{
						label:"A",
						value:"A"
					},{
						label:"B",
						value:"B"
					},{
						label:"C",
						value:"C"
					},{
						label:"D",
						value:"D"
					},{
						label:"E",
						value:"E"
					},{
						label:"F",
						value:"F"
					},{
						label:"Fx",
						value:"Fx"
					}

				]
			},
			grade:{
				label:dlang("header_obj_prog_grade","Grade"),
				options:[
                    {
                        label:"",
                        value:""
                    },
                    {
                        label:"A",
                        value:"A"
                    },{
                        label:"B",
                        value:"B"
                    },{
                        label:"C",
                        value:"C"
                    },{
                        label:"D",
                        value:"D"
                    },{
                        label:"E",
                        value:"E"
                    },{
                        label:"F",
                        value:"F"
                    },{
                        label:"Fx",
                        value:"Fx"
                    }
				]
			},
			goal:{
				label:dlang("header_obj_prog_goal","Goal"),
				options:[
                    {
                        label:"",
                        value:""
                    },
                    {
                        label:"A",
                        value:"A"
                    },{
                        label:"B",
                        value:"B"
                    },{
                        label:"C",
                        value:"C"
                    },{
                        label:"D",
                        value:"D"
                    },{
                        label:"E",
                        value:"E"
                    },{
                        label:"F",
                        value:"F"
                    },{
                        label:"Fx",
                        value:"Fx"
                    }
				]
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
