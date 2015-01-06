var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.form_settings = new schoolmule.controls.form({
		connector : "connectors/connector.php",
		id: "form_settings",
		user_id: "1",
		setFormConfig: function(){
			config = [
						 {type:"block",className:"settingsBlock",list:[
						 	 {type:"input",name:"username",label:"Super administrator login name",position:"label-top",value:"",validate:"NotEmpty", className:'setting'},
						 	 {type:"input",name:"password",label:"Super administrator password",position:"label-top",value:"", className:'setting'}
						 ]}
			]	
			return config;
		}
})





