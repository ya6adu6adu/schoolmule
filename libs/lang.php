<?php
	function dlang($key,$params=null){
		global $config;
		global $langXml;
		global $appPath;
        global $labels;
        if($_SESSION['labels']==1){
            return $key;
        }
		//todo: solve problem with single quotes in text
		$key = str_replace("'","_",$key);
		$langXPath = new DOMXPath(getLangXML());
		
		$result = $langXPath->query("/resources/string[@name='".$key."']");
		
		if($result->item(0)==null){
			$key = "".$key;

		}else{
			$val = $result->item(0)->textContent;
			if($val==""){

			}
			else
				$key = $val;
		}
		//use params
		if($params!=null){
			for($i=0;$i<count($params);$i++){
				$key = str_replace("#".($i+1),$params[$i],$key);
			}
		}
		
		return $key;
	}

	function getLangXML(){
		global $lang;
		global $langXml;
		global $appPath;
		if($langXml!=null){
			return $langXml;
		}else{
            $lang = $lang?$lang:"en";
			$langXml = new DomDocument;
			$langXml->load($appPath."lang/".$lang.".xml");
			return $langXml;
		}
	}
	