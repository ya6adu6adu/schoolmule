var TynyMCEadapter = function(area,editor,_options){
	var self = this;
	var edits = [];
	var active;
	
	var defaults = {
		type : "text"
	};
	
	var options = $.extend(defaults, _options);
	
	self.refrash = function(){
		//alert("refrash "+editor[0]);
	}
			
	self.getContent = function(){
		if(arguments[0]){
			return tinyMCE.get(arguments[0]).getContent();
		}else{
			var eds = {};
			for(var edit in edits){
				if(active==edit)
					eds[edit] = tinyMCE.get(options.active_area).getContent();
				else
					eds[edit] = edits[edit];
			}
			return JSON.stringify(eds);
		}	
	}
	
	self.setContent = function(){
		 for(var i=0; i<arguments.length; i++){
		 	for(var edit in arguments[i]){
				edits[edit] = arguments[i][edit];

				//if(edit == options.active_area) 	
					//tinyMCE.get(options.active_area).setContent(arguments[i][edit]);
			}
		 }
	}
	
	self.selectEditor = function(edit){
		if(tinyMCE.get(options.active_area).getContent())
			edits[active] = tinyMCE.get(options.active_area).getContent();
		tinyMCE.get(options.active_area).setContent(edits[edit]);
		active = edit;
	}
	
	function init(){
		var settings;
		var ed = area+"_content";
		
		$("#"+area).append("<div id='"+area+"_content' style='width:100%; height:100%; overflow-x:hidden; overflow-y:auto;'></div");
		if(options.type == "text"){
			settings={
				mode : "exact",
				theme : "advanced",
				skin : "default",
				width : "100%",
				elements : ed,
				theme_advanced_toolbar_location : "top",		
				width : "100%",
				height : "100%",
				oninit : "resizeTiny",
				plugins : "preview,fullscreen,print,paste,searchreplace,lists,template,directionality,pagebreak,table,advlist,emotions,inlinepopups,style,gallery,flash,assignment,courseroom,audio,insertfile,video,iframe",	
				theme_advanced_buttons1 : "code,|,preview,fullscreen,|,print,|,cut,copy,paste,pastetext,pasteword,|,undo,redo,|,search,replace,|,removeformat,|,tablecontrols,|,hr,pagebreak",
				theme_advanced_buttons2 : "bold,italic,underline,strikethrough,|,sub,sup,|,bullist,numlist,|,outdent,indent,|,justifyleft,justifycenter,justifyright,justifyfull,|,ltr,rtl,|,template,|,link,unlink,anchor,|,image,gallery,flash,video,audio,insertfile,iframe,|,courseroom,assignment",
				theme_advanced_buttons3 : "styleselect,formatselect,fontselect,fontsizeselect,forecolor,backcolor,emotions,charmap,|,styleprops",	
				theme_advanced_fonts : "Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;"+
				"Michroma=Michroma, serif;Terminal Dosis Light=Terminal Dosis Light, serif;Cabin Sketch=Cabin Sketch, serif;Oswald=Oswald, serif;EB Garamond=EB Garamond, serif;"+
				"Amaranth=Amaranth, serif;Pacifico=Pacifico, serif;MedievalSharp=MedievalSharp, serif;Candal=Candal, serif;Corben=Corben, serif;"+
				"Dancing Script=Dancing Script, serif;Cuprum=Cuprum, serif;Lekton=Lekton, serif;Bentham=Bentham, serif;Gruppo=Gruppo, serif;"+
				"Orbitron=Orbitron, serif;Arimo=Arimo, serif;Permanent Marker=Permanent Marker, serif;UnifrakturMaguntia=UnifrakturMaguntia, serif;Tangerine=Tangerine, serif",
				theme_advanced_toolbar_location : "top",
				theme_advanced_toolbar_align : "left",
				content_css : "http://fonts.googleapis.com/css?family=Michroma|Terminal+Dosis+Light|Cabin+Sketch|Oswald|EB+Garamond|Amaranth|Pacifico|MedievalSharp|Candal|Corben|Dancing+Script|Cuprum|Lekton|Bentham|Gruppo|Orbitron|Arimo|Permanent+Marker|UnifrakturMaguntia|Tangerine",
				// Style formats
				style_formats : [
					{title : 'Bold text', inline : 'b'},
				{title : 'Red text', inline : 'span', styles : {color : '#ff0000'}},
				{title : 'Red header', block : 'h1', styles : {color : '#ff0000'}},
				{title : 'Example 1', inline : 'span', classes : 'example1'},
				{title : 'Example 2', inline : 'span', classes : 'example2'},
				{title : 'Table styles'},
				{title : 'Table row 1', selector : 'tr', classes : 'tablerow1'}
			]}
		}
		
		if(options.type == "small"){
			settings={
				mode : "exact",
				theme : "advanced",
				skin : "default",
				elements : ed,
				height : "100%",
				theme_advanced_buttons1 : "bold,italic,underline,|,link,unlink",					
				theme_advanced_toolbar_location : "top",
				theme_advanced_toolbar_align : "left",					
				width : "100%",
				oninit : "resizeTiny"
			}
		}
		
		tinyMCE.init(settings);
	}
	
	init();
};