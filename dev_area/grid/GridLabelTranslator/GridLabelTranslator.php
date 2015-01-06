<?php
	require('LanguageTranslator.php');
	require("./../../libs/Connection.php");
	
	class LabelTranslate{
		private $db = false;
		private $s_lng;
		private $t_lng;
		private $translator;
		
		public function __construct($src_lng,$dst_lng){
			
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
			$this->s_lng = $src_lng;
			$this->t_lng = $dst_lng;
			$this->translator = new LanguageTranslator('TtXF/bDrVKcXs6CUTd3ApMDt8RFXedrxOIhtIwWC/gM=');
		}
		
		public function myTranslate(){
			echo $this->translator->translate('main', 'de', 'en');
				
		
		}
		public function translateNullLabels(){
			$result = mysql_query("SELECT label_id,label_".$this->s_lng." FROM labels WHERE label_".$this->s_lng." =''")or die(mysql_error());
			//$result = mysql_query("SELECT label_id,label_".$this->s_lng." FROM labels");
			$null_translated_labels = array();
			while($row = mysql_fetch_assoc($result) ){
				//return $row['label_en'];
				//echo $row['label_id'];
				//echo $row['label_'.$this->s_lng];
				echo $this->translator->translate($row['label_'.$this->s_lng], $this->t_lng, $this->s_lng);
				$null_translated_labels[$row['label_id']] = $this->translator->translate($row['label_'.$this->s_lng], $this->t_lng, $this->s_lng);
			}
			return $null_translated_labels;
			//return $result;
		}
		public function setTranslatedLabels($arr_labels){
			foreach($arr_labels as $key => $value){
				mysql_query("UPDATE labels SET label_".$this->t_lng." = '$value' WHERE label_id='$key'");
			}
		}
	}
	if(isset($_GET['s_lng'])&&isset($_GET['t_lng'])){
		$my_translator = new LabelTranslate($_GET['s_lng'],$_GET['t_lng']);
		//$array = $my_translator->translateNullLabels();
		//echo $array;
		//$my_translator->setTranslatedLabels($array);
		$my_translator->myTranslate();
	}
	
	
?>