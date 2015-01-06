<?php
	require("dhtmlx/dhtmlxConnector/php/codebase/form_connector.php");
	
	class FormPupils{
		private $db = false;
		
		public function __construct(){
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
			$form = new FormConnector($conn,"MySQL");
			$form->event->attach(new EditData());
			$form->render_table("pupils","pupil_id","pupil_id,first_name,last_name,user_name,id_number,programme,sex,protected_identity,
								 start_year,study_year,omynding,acc_valid_form,acc_valid_until,address,zip_code,city,phone,email");
		}			
	}
	
	class EditData{
		
		private $db = false;
		
		public function __construct(){
			$this->db = Connection::getDB();
		}
		public function beforeRender($data){
			$id = $data->get_value("pupil_id");
			$sql = "SELECT * FROM guardians WHERE pupil_id=$id";
			$result = $this->db->query($sql);
			$arr;
			while ($line = mysql_fetch_assoc($result)) {
				$arr[] = array($line['user_name'],$line['freeze_access'],$line['first_name'],
				$line['last_name'],$line['is_guardian'],$line['address'],$line['zip_code'],
				$line['city'],$line['phone'],$line['email'],$line['guardian_id']);
			}
			$guards = json_encode($arr);
			$data->set_value("user_name",$data->get_value("user_name")."|sep".$guards);
		}
		
		public function beforeUpdate($data){
			$guards = json_decode($data->get_value("guardians"),true);
			$date = explode(" ",  $data->get_value("acc_valid_form"));
			$dateobj = date_parse($data->get_value("acc_valid_form"));
			$date = $dateobj['year'].'-'.$dateobj['month'].'-'.$dateobj['day'];
			$data->set_value("acc_valid_form",$date);
			
			$dateobj = date_parse($data->get_value("acc_valid_until"));
			$date = $dateobj['year'].'-'.$dateobj['month'].'-'.$dateobj['day'];
			$data->set_value("acc_valid_until",$date);
			
			foreach ($guards as $valueas) {
				foreach ($valueas as $value) {
					if($value['delete'] == 'true'){
						$guard_id = $value['guardian_id'];
						$this->db->query("DELETE FROM guardians WHERE guardian_id='$guard_id'");
						break;
					}
					$user_name = $value['user_name'];
					$freeze_access = $value['freeze_access'];
					$first_name = $value['first_name'];
					$last_name = $value['last_name'];
					$is_guardian = $value['is_guardian'];
					$address = $value['address'];
					$zip_code = $value['zip_code'];
					$city= $value['city'];
					$phone = $value['phone'];
					$email = $value['email'];
					$guardian_id = $value['guardian_id'];
										
					if($guardian_id!=""){
						$this->db->query("UPDATE guardians SET  user_name='$user_name',freeze_access=$freeze_access,first_name='$first_name',
														  last_name='$last_name',is_guardian='$is_guardian', address='$address',
														  zip_code='$zip_code',city='$city',phone='$phone',
														  email='$email'
														  WHERE guardian_id=$guardian_id");					
					}else{		
						$user_id = $data->get_value("pupil_id");
						$this->db->query("INSERT INTO guardians (user_name,freeze_access,first_name,last_name,is_guardian,
										address,zip_code,city,phone,email,pupil_id)
									 VALUES ('$user_name',$freeze_access,'$first_name','$last_name','$is_guardian',
									 '$address','$zip_code','$city','$phone','$email','$user_id')");
					}				
				}
			}		
		}
	}
