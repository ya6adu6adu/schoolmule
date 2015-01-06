<?php
	require_once('Translate.php');
	
	class LabelsTranslator{
		private $db = false;
		private $s_lng;
		private $t_lng;
		private $translator;
		
		public function __construct($src_lng,$dst_lng){
			
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
			$this->s_lng = $src_lng;
			$this->t_lng = $dst_lng;
			$msData = array(
				'clientid'=>'label_translator',
				'clientsecret'=>'XqKpSs1YXaAoSNGoDZvPQh0SDnoZ78UhSY4C7wmUjeQ='
			);
			$this->translator = new Translate($msData);
			
		}
		
		public function translateNullLabels(){
			$result = $this->db->query("SELECT label_id,label_".$this->s_lng." FROM labels WHERE  (label_".$this->t_lng." IS NULL) OR ( label_".$this->t_lng." = '' )");
			$not_translated_labels = array();
			$not_translated_labels_id = array();
			
			while($row = mysql_fetch_assoc($result) ){
				//$null_translated_labels[$row['label_id']] = $this->translator->translate($row['label_'.$this->s_lng], $this->t_lng, $this->s_lng);
				$null_translated_labels[] = $row['label_'.$this->s_lng];
				$not_translated_labels_id[] = $row['label_id'];
			}
			
			$labels_string = implode("!", $null_translated_labels);
			$translated_labels_string = $this->translator->translate($labels_string, $this->t_lng, $this->s_lng);
			$translated_labels = split("!", $translated_labels_string);	
			$result_array = array();
			
			for($i=0;$i<count($translated_labels);$i++){
				$result_array[$not_translated_labels_id[$i]] = $translated_labels[$i];
			}
			return $result_array;
		}
		
		public function setTranslatedLabels($arr_labels){
			foreach($arr_labels as $key => $value){
				$this->db->query("UPDATE labels SET label_".$this->t_lng." = '$value' WHERE label_id='$key'");
			}
		}
		
		public function translateLabels(){
			$this->setTranslatedLabels($this->translateNullLabels());
		}
	}
?>