var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.html_pupil = new schoolmule.controls.html({
	onGetTemplate: function(){
		var template = '\
			<div class="template">\
				<div style="float:left; margin-right:10px">\
					<div id="photo"><img src="<%= photo.src %>"/></div>\
				</div>\
				<div style="float:left;">\
					<div id="pupil_name"> <strong><%= pupil_name.label %>: </strong><span> <%= pupil_name.value %></span></div>\
					<div id="id" > <strong><%= id.label %>: </strong> <span><%= id.value %></span></div>\
					<div id="programme_head"> <strong><%= programme_head.label %>: </strong><span> <%= programme_head.value %></span></div>\
					<div id="pupilgroup_head" > <strong><%= pupilgroup_head.label %>: </strong> <span><%= pupilgroup_head.value %></span></div>\
				</div>\
			</div>\
		';
		return template;
    },
	onGetDefaultData: function(){
		var data = {
			photo:{
				src:"images/pupil.png"
			},
			pupil_name:{
				label:dlang("header_pupil_name","Pupil name"),
				value:dlang("defaults")
			},
			id:{
				label:dlang("header_obj_prog_id","ID"),
				value:dlang("defaults")
			},
            programme_head:{
                label:dlang("header_programme","Programme"),
                value:dlang("defaults")
            },
            pupilgroup_head:{
                label:dlang("header_pgroup","Pupilgroup"),
                value:dlang("defaults")
            }
		};
		return data;
	}
})
