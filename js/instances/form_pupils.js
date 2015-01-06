var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.form_pupils = function(_options){
	var self = this;
	
	var defaults = {
		photo_path : "dev_area/photos/photo_",
		connector : "connectors/connector.php",
		id: "form_pupils",
		user_id: "55"
	};
	var container = null;
	var myForm;
	var guars = [];
	
	var options = $.extend(defaults, _options);


	this.unloadForm = function (){
		$("#loadImage").remove();
		myForm.unload();
		myForm = null;
		for(var i=0; i<guars.length; i++){
			if((typeof guars[i]) == 'object'){
				guars[i].unload();
				guars[i] = null;
			}
		}	
		guars = null;
		$("#leftpart").remove();
		$("#rightpart").remove();
	}
	
	this.saveData = function () {
		var gua = [];
		for(var i=0; i<guars.length; i++){
			if((typeof guars[i]) == 'object'){
					if(guars[i].isItemChecked('freeze_access'))
						guars[i].setItemValue('freeze_access','1')
					else guars[i].setItemValue('freeze_access','0')
					var adr = guars[i].getItemValue("guard_address1")+'addressSeparator'+guars[i].getItemValue("guard_address2");
					guars[i].setInputsArray("phone");
					guars[i].setInputsArray("email");
					gua.push([{"user_name":guars[i].getItemValue('user_name'),
					"freeze_access":guars[i].getItemValue('freeze_access'),
					"first_name":guars[i].getItemValue('first_name'),
					"last_name":guars[i].getItemValue('last_name'),
					"is_guardian":guars[i].getItemValue('is_guardian'),
					"zip_code":guars[i].getItemValue('zip_code'),
					"city":guars[i].getItemValue('city'),
					"email":guars[i].getItemValue('email'),
					"phone":guars[i].getItemValue('phone'),
					"address":adr,
					"guardian_id":guars[i].getItemValue('guardian_id')
					}]);
				}else{
					gua.push([{"delete":true,
					"guardian_id":guars[i]
					}]);
				}
		}
		var adr = myForm.getItemValue("address1")+'addressSeparator'+myForm.getItemValue("address2");
		myForm.setItemValue("address", adr);			
		var Json_string = JSON.stringify(gua);
		myForm.setItemValue("guardians", Json_string);		
		myForm.setInputsArray("phone");
		myForm.setInputsArray("email");
		myForm.save();
	}
	
	self.refresh = function(){
		var height = parseInt(container.css('height'));
		var height2 = parseInt(container.css('height'))-15;
		var width = parseInt($("#leftpart").css('width'));
		var width2 = parseInt($("#rightpart").css('width'));
		$("#leftpart").css('height',height+'px');			
		$("#rightpart").css('height',height2+'px');
		container.css({width:(width+width2)+'px',margin:"0 auto"});
	}
	
	self.refreshExpand = function(he){
		if (he) {				
			$("#rightpart").css({
				width:'550px',
				left:'657px'
			});
		}
		else {
			$("#rightpart").css({
				width:'441px',
				left:'457px'
			});
		}		
	}	
	
	function createCustomItems(){
		dhtmlXForm.prototype.setInputsArray = function (name) {
			return this.doWithItem(name,"setInputsArr");
		}
		
		dhtmlXForm.prototype.setFormData_customItem = function(name, value) {
			return this.doWithItem(name, "setValue", value)
		};
 
		dhtmlXForm.prototype.getFormData_customItem = function(name) {
			return this.doWithItem(name, "getValue")
		};
		
		dhtmlXForm.prototype.items.customItem = {
			render: function(item, data) {
				item.itemArray = [];
				item._type = "customItem";
				jitem = $(item);
				var lb = $("<label for='"+data.name+"'>"+data.label+"</label>");
				jitem.append(lb);
				item.name = data.name;
				jitem.append('<br>');
				var inp = $("<input type='text' name='"+data.name+"' class='inps' id='"+data.name+"'/>");
				jitem.append(inp);
				item.itemArray.push(inp);
				var butt = $("<input type='button' value='+' class='button'/>");
				jitem.append(butt);
				this.addItem(item,jitem,butt,data);
				return this;
			},
			
			destruct: function(item) {
				item.innerHTML = "";
			},
			
			enable: function(item) {
				item.lastChild.style.color = "black";
				item._is_enabled = true;
			},
			
			addItem: function(item,jitem,butt,data) {
				self = this;
				butt.click(function(){
					jitem.append("<br>");
					var inp = $("<input type='text' name='"+data.name+"' class='inps' id='"+data.name+"'/>");
					item.itemArray.push(inp);
					jitem.append(inp);
					self.addButton(item,jitem,inp);
				});
			},
			disable: function(item) {
				item._is_enabled = false;
			},
					
			setInputsArr: function(item) {
				var items = item.itemArray;
				var arr = [];
				for(var i=0;i<items.length;i++){
						if(items[i].val())
							arr.push(items[i].val());
				}
				item._value = arr.join();
				item.value = item._value;
			},
			
			addButton: function(item,jitem,input) {
				var butt = $("<input type='button' value='-' class='button'/>");
				jitem.append(butt);
				butt.click(function(){
					input.val("");
					var pr = input.prev();
					pr.remove();
					input.remove();
					butt.remove();
				});
			},
			
			setValue: function(item, val) {
				var jitem = $(item);
				var inputs = val.split(',');
				var items = item.itemArray;
				items[0].val(inputs[0]);
				for(var i=1;i<inputs.length;i++){
					jitem.append("<br>");
					var inp = $("<input type='text' name='"+item.name+"' class='inps'/>");
					inp.val(inputs[i]);
					jitem.append(inp);
					item.itemArray.push(inp);
					this.addButton(item,jitem,inp);
				}
				item._value = val;
			},
 
			getValue: function(item) {
				return item._value;
			}
		};
				
	}
	
	function setFormConfig(){
		config = [
				{type:"block", className:"leftPart", list:[
					 {type:"block",className:"mainBlock",list:[
					 	 {type:"block", name:"userPhoto", id:"userPhoto", inputHeight:"200",inputWidth:"150",className:"imageBlock"},
					 	 {type:"newcolumn"},
					 	  {type:"block",className:"mainBlockRight",list:[
						 	 {type:"input",name:"first_name",label:"First name",position:"label-top",value:"",validate:"NotEmpty"},
						 	 {type:"input",name:"last_name",label:"Surname",position:"label-top",value:"",validate:"NotEmpty"},
						 	 {type:"input",name:"user_name",label:"Username",position:"label-top",value:"",validate:"NotEmpty"},
						 	 {type:"input",name:"id_number",label:"ID Number",position:"label-top",value:"",validate:"NotEmpty"},
						 	 {type:"input",name:"programme",label:"Programme",position:"label-top",value:"",validate:"NotEmpty"}
					 	 ]}
					 ]},
					 
					 {type:"block",className:"sexBlock",list:[
					 	{type:"radio",name:"sex",label:"Male",value:"0",position:"label-right",checked:"true"},
					 	{type:"newcolumn"},
					 	{type:"radio",name:"sex",label:"Female",value:"1",position:"label-right"}
					 ]},
					 
					 {type:"block",className:"protId",list:[
					 	{type:"checkbox",name:"protected_identity", label:"Protected Identity", position:"label-right",className:"checkboxstyle"},
					 	{type:"newcolumn"},
					 	{type:"block",className:"years",list:[
					 		{type:"input",name:"start_year",label:"Start Year",position:"label-top",value:"",validate:"NotEmpty,ValidInteger"},
					 		{type:"newcolumn"},
					 		{type:"block",className:"inps",list:[
					 			{type:"input",name:"study_year",label:"Study Year",position:"label-top",value:"",validate:"NotEmpty,ValidInteger"}
					 		]}
					 	]}	 	
					 ]},
					 
					  {type:"block",className:"accValid",list:[
					 	{type:"checkbox",name:"omynding", label:"Omynding", position:"label-right",className:"checkboxstyle"},
					 	{type:"newcolumn"},
					 	{type:"block",className:"accounValid",list:[
					 		{type:"calendar",name:"acc_valid_form",dateFormat:"%Y-%m-%d",label:"Account Valid form",position:"label-top",value:"",validate:"NotEmpty"},
					 		{type:"newcolumn"},
					 		{type:"block",className:"inps",list:[
					 		{type:"calendar",name:"acc_valid_until",dateFormat:"%Y-%m-%d",label:"Account Valid until",position:"label-top",value:"",validate:"NotEmpty"}
					 		]}
					 	]}						  	
					  ]},
					  
					  {type:"block",className:"address",list:[
					  	{type:"input",name:"address1",label:"Address",position:"label-top",value:"",validate:"NotEmpty"},
					  	{type:"input",name:"address2",value:"",className:"secondAddr"}
					  ]},
					  
					  {type:"block",className:"city",list:[
					  	{type:"input",name:"zip_code",label:"Zip Code",position:"label-top",value:"",validate:"NotEmpty"},
					  	{type:"newcolumn"},
					  	{type:"block",className:"inps",list:[
					  		{type:"input",name:"city",label:"City",position:"label-top",value:"",validate:"NotEmpty"}
					  	]}
					  ]},
					  
					  {type:"block",className:"customItems",list:[
					  	{type:"customItem",name:"phone",label:"Phone",position:"label-top",validate:"NotEmpty"}
					  ]},
					  
					  {type:"block",className:"customItems",list:[
					  	{type:"customItem",name:"email",label:"Email",position:"label-top",validate:"NotEmpty"},
					  	{type:"block",className:"brClass"}
					  ]},
					  
					  {type:"hidden",name:"address"},
					  {type:"hidden",name:"guardians"},
					  {type:"hidden",name:"pupil_id"}
				]}
		]	
		return config;
	}
	
	function setGuardianConfig(){
		config = [
				{type:"block", name:"rightPart", className:"rightPart", list:[
					{type:"block",className:"br_block",name:"br_bl"},
					{type:"block",className:"buttonsBlock",name:"buttonsCont",list:[
						{type: "label", label: "", name:"guardLabel",className:"guardLabel"},
						{type:"newcolumn"},
						{type:"block", name:"customButt",className:"buttons",list:[
						]}
					]},
			
					{type: "block",className:"guardName",list:[
						{type:"input",name:"user_name",label:"Username",position:"label-top",value:"",validate:"NotEmpty"},
						{type:"newcolumn"},
						{type: "block", className:"frizeaccess",list:[
							{type:"checkbox",name:"freeze_access", label:"Frize Access", position:"label-right", value:"1"}
						]}
					]},
					
				  	{type:"block",className:"guards_info",list:[
				  		{type:"input",name:"first_name",label:"First name",position:"label-top",value:"",validate:"NotEmpty"},
				  		{type:"newcolumn"},
				  		{type:"block",className:"inps",list:[
				  			{type:"input",name:"last_name",label:"Surname",position:"label-top",value:"",validate:"NotEmpty"}
				  		]}
				    ]},
				    
					{type:"block",className:"guardBool",list:[
					 	{type:"radio",name:"is_guardian",label:"Guardian",value:"0",position:"label-right",checked:"true"},
					 	{type:"newcolumn"},
					 	{type:"radio",name:"is_guardian",label:"Other",value:"1",position:"label-right"}
					]},	
								    
					{type:"block",className:"address",list:[
					  	{type:"input",name:"guard_address1",label:"Address",position:"label-top",value:"",validate:"NotEmpty"},
					  	{type:"input",name:"guard_address2",value:"",className:"secondAddr"}
					]},
					
					{type:"block",className:"city",list:[
					  	{type:"input",name:"zip_code",label:"Zip Code",position:"label-top",value:"",validate:"NotEmpty"},
					  	{type:"newcolumn"},
					  	{type:"block",className:"inps",list:[
					  		{type:"input",name:"city",label:"City",position:"label-top",value:"",validate:"NotEmpty"}
					  	]}
					]},					
									    
					 {type:"block",className:"customItems",list:[
					  	{type:"customItem",name:"phone",label:"Phone",position:"label-top",validate:"NotEmpty",value:""}
					 ]},
					  
					 {type:"block",className:"customItems",list:[
					  	{type:"customItem",name:"email",label:"Email",position:"label-top",validate:"NotEmpty",value:""},
					  	{type:"block",className:"brClass"}
					 ]},
					{type:"hidden",name:"guardian_id"},
					{type:"hidden",name:"address"}
				]}
			]
		return config;				
	}
	
	function getOffsetRect(elem) {
	    var box = elem.getBoundingClientRect()
	    var body = document.body
	    var docElem = document.documentElement
	    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
	    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
	    var clientTop = docElem.clientTop || body.clientTop || 0
	    var clientLeft = docElem.clientLeft || body.clientLeft || 0
	    var top  = box.top +  scrollTop - clientTop
	    var left = box.left + scrollLeft - clientLeft
	    return { top: Math.round(top), left: Math.round(left) }
	}
		
	function setBlocks(){
		var height = parseInt(container.css('height'));
		var leftpart = $("<div id='leftpart'></div>");
		leftpart.css('height',height+'px');
		var rightpart = $("<div id='rightpart'></div>");
		rightpart.css('height',height-15+'px');
		container.append(rightpart);
		container.append(leftpart);
		var loadImage = $("<img id='loadImage' src='gfx/ajax-loader.gif'>");
		loadImage.css('display','none');
		$("#main-content .box-caption").append(loadImage);	
	}
	
	function setGuardian(guardianForm, guardian){
		for(num in guardian){
			guardianForm.setItemValue(num, guardian[num]);
		}
	}

	function removeGuardian(button){
		var formid = parseInt(button.id);
		var form = guars[formid];
		button.parentNode.removeChild(button);
		guars[formid] = guars[formid].getItemValue('guardian_id');
		form.unload();
		form = null;		
	}
		
	this.initForm = function(attachCont){
		if(!options.container && !attachCont){
			return false;
		}
		
		if(attachCont){
			container = $("#"+attachCont);
		}else{
			container = $("#"+options.container);
		}
		
		var numberGuard=0;
		var guardianCounter=0;
		var config = setFormConfig();
		setBlocks();
		createCustomItems();
		
		myForm = new dhtmlXForm("leftpart",config);
		var dhxCalendar = myForm.getCalendar("acc_valid_form");
		dhxCalendar.setSkin('omega');
		dhxCalendar = myForm.getCalendar("acc_valid_until");
		dhxCalendar.setSkin('omega');
		
		var imgBlock = $('.imageBlock');
		imgBlock.mouseover(function(){
			this.style.cursor = "pointer";
		});
		imgBlock.mouseout(function(){
			this.style.cursor = "default";
		});
		
		imgBlock.click(function(){
			var elem = document.getElementById(options.container);
			var dhxWins= new dhtmlXWindows();
			var win = dhxWins.createWindow("window",getOffsetRect(elem).left,getOffsetRect(elem).top, 380, 120);
				
			$(window).resize(function(){
				dhxWins.window("window").setPosition(getOffsetRect(elem).left,getOffsetRect(elem).top);
			});
			
			dhxWins.window("window").setText("Upload photo");
			dhxWins.setSkin("dhx_web");
			dhxWins.window("window").denyMove();
			
			var dhxForm = dhxWins.window('window').attachForm();
			dhxForm.loadStructString('<items><item type="upload" name="myPhoto" inputWidth="330"/></items>');
			dhxForm.setSkin("dhx_terrace");
			
			var myUploader = dhxForm.getUploader("myPhoto");
			myUploader.setURL("libs/ItemUpload.php?id="+options.user_id);
			
			dhxForm.attachEvent("onUploadFile",function(realName,serverName){
				$('.imageBlock').css("background","url(photos/"+serverName+") center center no-repeat");
				dhxWins.window("window").close();
				myUploader.clear();
			});	
		});

		var img=new Image();
		$(img).error(function(){
			imgBlock.css("background","url("+options.photo_path+"default.jpg) center center no-repeat");
			
		});
		img.src = options.photo_path+options.user_id+".jpg";

		imgBlock.css("background","url("+options.photo_path+options.user_id+".jpg) center center no-repeat");

		myForm.load(options.connector+'?id='+options.user_id+'&control_id='+options.id,function(id, response){
		var adr = myForm.getItemValue("address");
		var arradd = adr.split('addressSeparator');
		myForm.setItemValue("address1", arradd[0]);
		myForm.setItemValue("address2", arradd[1]);
		
		var username = myForm.getItemValue("user_name");
		var guards = username.split('|sep');
		var gtr =JSON.parse(guards[1]);
		myForm.setItemValue("user_name",guards[0]);
		for(num in gtr){
			var guardianForm = new dhtmlXForm('rightpart',setGuardianConfig());							
			guars.push(guardianForm);
			if(gtr[num][1] == '1')
				guardianForm.checkItem('freeze_access');
			numberGuard++;
			var adr = gtr[num][5];
			var arradd = adr.split('addressSeparator');
			
			guardianForm.setItemLabel("guardLabel", "Guardian "+numberGuard);
			
			setGuardian(guardianForm,{
							"user_name": gtr[num][0],
							"freeze_access": gtr[num][1],
							"first_name": gtr[num][2],
							"last_name": gtr[num][3],
							"is_guardian": gtr[num][4],
							"guard_address1": arradd[0],
							"guard_address2": arradd[1],
							"zip_code": gtr[num][6],
							"city": gtr[num][7],
							"phone": gtr[num][8],
							"email": gtr[num][9],
							"guardian_id": gtr[num][10]
			});
			var buttr;
			if(numberGuard == 1){
				guardianForm.removeItem("br_bl");
				var butt = $("<input type='button' value='+' class='button blockButtons'/>");	
				$($(".buttons")[numberGuard-1]).append(butt);
				butt.click(function(){
					var guardianForm= new dhtmlXForm('rightpart',setGuardianConfig());
					numberGuard++;
					guardianForm.setItemLabel("guardLabel", "Guardian "+numberGuard);
					guars.push(guardianForm);
					guardianCounter++;
					var buttr = $("<input type='button' id='"+guardianCounter+"' value='-' class='button blockButtons'/>");
					
					$($(".buttons")[numberGuard-1]).append(buttr);
					buttr.click(function(){
						removeGuardian(this);
						numberGuard--;					
					});				
				});		
			}else{
				guardianCounter++;
				var buttr = $("<input type='button' id='"+guardianCounter+"' value='-' class='button blockButtons'/>");			
				$($(".buttons")[numberGuard-1]).append(buttr);
				buttr.click(function(){
					removeGuardian(this);
					numberGuard--;						
				});					
			}		
		}
			
		});
		myForm.attachEvent("onBeforeSave", function (id, values){
		    $("#loadImage").css('display','block');
			return true;
		});
		 myForm.attachEvent("onAfterSave", function (id, values){
		 	 $("#loadImage").css('display','none');
		});
						
		var mydp = new dataProcessor(options.connector+'?control_id='+options.id);
		mydp.init(myForm);		
	};
	
	this.initForm();
};

schoolmule.controls.form_pupils.prototype = new schoolmule.controls.form();