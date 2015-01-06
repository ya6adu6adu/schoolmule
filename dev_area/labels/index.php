<?php 

	include_once ('./../../libs/Connection.php');
	class Labels{
		private $db = false;
		//private $lng = false;
		public function __construct(){
			$this->db = Connection::getDB();
			//$this->lng = $language;
			//error_reporting(E_ALL ^ E_NOTICE);
		}
		
		public function getLabel($lng, $label){
			$result = $this->db->query("SELECT label_$lng as label FROM labels WHERE label_name = '$label'");
			while($row = mysql_fetch_assoc($result)){
				$label = $row['label'];
			}
			echo $label;
		}	
		
		public function getAllLabels($lng){
			$result = $this->db->query("SELECT label_name, label_$lng as label FROM labels");
			$object = array();
			$cur_obj;
			while($row = mysql_fetch_assoc($result)){
				
				$labels = split("\.",$row['label_name']);
					if(!isset($object[$labels[0]])){
						$object[$labels[0]] = array();
					}
				if(count($labels)>1){
						$lab = $labels[0];
						array_shift($labels);
						$object[$lab] = $this->setObject($labels,$object[$lab],$row['label']);
				}else {
					$object[$labels[0]] = $row['label'];
				}
			}
			echo json_encode($object);
		}
		
		public function setObject($s_array,$t_array,$value){
			
				if(!isset($t_array[$s_array[0]])){
					$t_array[$s_array[0]] = array();
				}
			if(count($s_array)>1){
				$cur= $s_array[0];
				array_shift($s_array);
				$t_array[$cur] = $this->setObject($s_array,$t_array[$cur],$value);	
			}else{
				$t_array[$s_array[0]] = $value;
			}
		return $t_array;
		}
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="./../../js/jquery.js"></script>
	</head>
	<body>
	<?php $lab = new Labels(); ?>
	<script>
	$(function(){
		var obj = $.parseJSON( '<?php echo $lab->getAllLabels('en');?>' );
		$('#all').html(obj.course_room.title+"<br> "+obj.course_room.elements.label);
	})
	</script>
		<div id="container">
			<div style="float:left; ">
				<div>Name: </div>
				<div >English label: </div>
				<div>Deutsch label: </div>
			</div>
			<div style='float:left; color:grey'>
				<div>course_room.title</div>
				<div><?php $lab->getLabel('en', 'course_room.title'); ?></div>
				<div><?php $lab->getLabel('de', 'course_room.title'); ?></div>
			</div>
			<div style='clear:both' >All:</div>
			<div id = 'all' >
			
			</div>
		</div>
	</body>
	
</html>