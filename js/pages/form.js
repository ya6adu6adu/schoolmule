	var content;
	$(function(){
		addSettings();
	});

	function addSettings(){
		if(content){
			content.destroy();
		}
		content = new schoolmule.controls.layout({
		cellsBlock: {
					display_footer_right: true,
					display_footer_left: true,
					cells_left:[
									{
										id : "nav-header"						
									},
									{
										id : "nav-body"
									}
						   	   	],
					cells_right:[
									{													
										cells:[
										{
											id : "form_pupils",
											width: '100%',
											height: '100%'
										}
										]
									}
							     ]
			  }
		});
		
		var pupForm = new schoolmule.controls.form_pupils({
			//container : "form_pupils"
		});
		
		pupForm.attachTo("form_pupils");	
		content.elements.push(pupForm);	
			
		content.setTitle("main-content","Pupils form");
		
		content.attachButtons([
		{	
			label : "Save",
			id : "save",
			callback : function(){
				pupForm.saveData();
			}
		},
		{	
			label : "Cancel",
			id : "cancel",
			callback : function(){
			}
		}
		]);	
	}