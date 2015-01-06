<?php
	require('translate.php');
	require_once('connection.php');
	class labels_translator{
		private $db = false;
		private $s_lng;
		private $t_lng;
		private $translator;
		private $table;
		private $s_field;
		private $t_field;
		
		public function __construct($src_lng,$dst_lng){
			
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
			$this->s_lng = $src_lng;
			$this->t_lng = $dst_lng;
			$msData = array(
				'clientid'=>'label_translator',
				'clientsecret'=>'XqKpSs1YXaAoSNGoDZvPQh0SDnoZ78UhSY4C7wmUjeQ='
			);
			$this->translator = new translate($msData);
			
		}
		
		private function getNotTranslatedLabels(){
			return $this->getAllLabels("WHERE  ($this->t_field IS NULL) OR ( $this->t_field= '' )");
		}
		
		private function setTranslatedLabels($arr_labels){
			$id = substr($this->table, 0, strlen($this->table)-1).'_id';
			foreach($arr_labels as $key => $value){
				$value = mysql_real_escape_string($value);
				//$value = addslashes($value);
				$this->db->query("UPDATE $this->table SET $this->t_field = '$value' WHERE $id = $key")or die(mysql_error());
			}
		}
		private function getAllLabels($condition=''){
			$id = substr($this->table, 0, strlen($this->table)-1).'_id';
			$result = $this->db->query("SELECT $id,$this->s_field FROM $this->table $condition");
			$not_translated_labels = array();
			//$not_translated_labels_id = array();
			
			while($row = mysql_fetch_assoc($result) ){
				$not_translated_labels[$row[$id]] = $row[$this->s_field];
				//$not_translated_labels_id[] = ;
			}
			//print_r($not_translated_labels);
			return $not_translated_labels;
			
		}
		
		private function translateLabelsArray($not_translated_labels){
			$array_for_translate = array();
			foreach($not_translated_labels as $key => $value){
				$array_for_translate[] = $not_translated_labels[$key];
			}
			$labels_string = implode("-\\-", $array_for_translate);
			$translated_labels_string = $this->translator->translate($labels_string, $this->t_lng, $this->s_lng);
			$translated_labels = explode("-\\-", $translated_labels_string);	
			//$result_array = array();
			$i=0;
			foreach($not_translated_labels as $key => $value){
				$not_translated_labels[$key] = $translated_labels[$i];
				$i++;
			}
			/*for($i=0;$i<count($translated_labels);$i++){
				$result_array[$not_translated_labels_id[$i]] = $translated_labels[$i];
			}*/
			return $not_translated_labels;
		}
		private function translateLabelsArrayAsHTML($not_translated_labels){
		
			foreach($not_translated_labels as $key => $value){
			
			
			//		$not_translated_labels[$key] = $translated_labels[$i];
			//	}
			//$data = '<div id="sample">Hello, world <input type="text" value="Good">Ok</input>How are you?</div>';

				$res = preg_match_all("/((\>)([^\<]{1,})(\<))/", $not_translated_labels[$key], $mass);
				$res1 = preg_match_all("/((value[ ]{0,}=[\"|\'])([^\"|^\']{1,})([\"|\']{1}))/", $not_translated_labels[$key], $mass1);
				print_r($mass1);
				for($i=0; $i<$res1; $i++){ 
					$mass1[0][$i] = '/'.preg_quote($mass1[0][$i]).'/';
				}
				for($i=0; $i<$res; $i++){ 
					//$new_mass[] = '/\\'.substr($mass[0][$i], 0, strlen($mass[0][$i])-1).'\</';
					$mass[0][$i] = '/'.preg_quote($mass[0][$i]).'/';
				}

				$ready_array = $this->translateLabelsArray($mass[3]);	
				
				for($i=0;$i<count($ready_array);$i++){
					$ready_array[$i] = '>'.$ready_array[$i].'<';
				}
				$not_translated_labels[$key] = preg_replace (  $mass[0], $ready_array, $not_translated_labels[$key] );
				
				$ready_array = $this->translateLabelsArray($mass1[3]);	
				
				for($i=0;$i<count($ready_array);$i++){
					$ready_array[$i] = 'value ="'.$ready_array[$i].'"';
				}
				$not_translated_labels[$key] = preg_replace (  $mass1[0], $ready_array, $not_translated_labels[$key] );
				//$not_translated_labels[$key] = addslashes($not_translated_labels[$key]);
				
			}
			return $not_translated_labels;
			//echo $data;
		}
		
		private function setOptions($table, $src_field, $dst_field){
			$this->table = $table;
			$this->s_field = $src_field;
			$this->t_field = $dst_field;
		}
		
		private function getLabels($all_records){
			if($all_records){
				$not_translated_labels = $this->getAllLabels();
			}else{
				$not_translated_labels = $this->getNotTranslatedLabels();
			}
			return $not_translated_labels;
		}
		public function translateLabels($table, $src_field, $dst_field, $all_records=false){
			$this->setOptions($table, $src_field, $dst_field);
			$not_translated_labels = $this->getLabels($all_records);
			$translated_labels = $this->translateLabelsArray($not_translated_labels);
			$this->setTranslatedLabels($translated_labels);
		}
		
		public function translateHTML($table, $src_field, $dst_field, $all_records=false){
			$this->setOptions($table, $src_field, $dst_field);
			$not_translated_labels = $this->getLabels($all_records);
			$translated_labels = $this->translateLabelsArrayAsHTML($not_translated_labels);
			$this->setTranslatedLabels($translated_labels);
		
		}
	}
?>