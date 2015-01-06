<?php
	//this file should always be located in directory lang in the root of the project. Default language is "en"
	$xml = new DomDocument;
	$xml->load(getcwd()."/en.xml");
	$langXPath = new DOMXPath($xml);
	
	$added_count=0;
	processDirs(getcwd()."/../",$xml,$langXPath);
	echo $added_count." strings added to lang/en.xml";
				
	$xml->save(getcwd()."/en.xml");
	//add formating
	$xmlStr = file_get_contents(getcwd()."/en.xml");
	$xmlStr = str_replace("/><","/>\n<",$xmlStr);
	file_put_contents(getcwd()."/en.xml",$xmlStr);
				
	function processDirs($path,$xml,$langXPath){
		global $added_count;
		$dir = scandir($path);
		foreach($dir as $file){
			if(is_file($path."/".$file)){
				//find string of format "[lang] Some text" and replace it with dlang("Some text")
				//add "Some text" as key for XML node for further translation

				$fCont = file_get_contents($path."/".$file);

				preg_match_all('|dlang\(\"|([^\"]+)\"|', $fCont, $matches,PREG_PATTERN_ORDER);
				for($i=0;$i<count($matches[1]);$i++){
					//todo: solve problem with single quotes in text
					$key = str_replace("'","_",$matches[1][$i]);
					$res = $langXPath->query("/lang/it[@key='".$key."']");
					if($res->item(0)!=null)
						continue;
					$added_count++;
					$node = $xml->createElement("it");
					$xml->documentElement->appendChild($node);
					$node->setAttribute("key",$key);
					$node->setAttribute("value","");				
				}


				/*$fCont = preg_replace("|\"\[lang\]([^\"]+)\"|","dlang(\"$1\")",$fCont);
				file_put_contents($path."/".$file,$fCont);*/
				
				
			}else{
			//ignore dirs inclusing "_" which is for test purposes
				if($file!="." && $file!=".." && $file!=".svn" && $file!="_"){
					processDirs($path."/".$file,$xml,$langXPath);
				}
			}
		}
	}
?>