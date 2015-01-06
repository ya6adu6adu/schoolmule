	var Langs = [];
	function dlang(str){
        if(labels_shows==1){
            return str
        }
		//load and populate Langs array with value
		if(Langs.length == 0){
			var loader = dhtmlxAjax.postSync("./lang/"+gl_user_lang+".xml?time="+(new Date()).getTime());
			var xml = loader.xmlDoc.responseXML;
			var chCol = loader.doXPath("/resources/string");
			for(var i=0;i<chCol.length;i++){
				Langs[chCol[i].getAttribute("name")] = chCol[i].textContent;
			}
			Langs[0] = true;
		}
		var tmp_str = Langs[str];
		var str_out;
		if(tmp_str=='')
			str_out =  str;
		else if(typeof(tmp_str)=='undefined')
			str_out = ""+str;
		else
			str_out = Langs[str];
		//set arguments
		for(var i=1;i<arguments.length;i++){
			str_out = str_out.replace("#"+i,arguments[i]);
		}
		return str_out;
	}