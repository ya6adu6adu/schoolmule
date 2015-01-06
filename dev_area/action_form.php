<?php
	require("../libs/Connection.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/form_connector.php");
	$db = Connection::getDB();
	$conn = $db->getConn();
	$form = new FormConnector($conn,"MySQL");
	
	$form->event->attach("beforeUpdate","formatting");
	$form->event->attach("beforeRender","loadGuard");
	function loadGuard($row){
		$db = Connection::getDB();
		$id = $row->get_value("user_id");
		$result = $db->query("SELECT * FROM guardian WHERE user_id=$id");
		$arr;
		while ($line = mysql_fetch_assoc($result)) {
			$arr[] = array($line['guard_username'],$line['frizeaccess'],$line['guard_firstname'],
			$line['guard_surname'],$line['guardian'],$line['guard_address'],$line['guard_zip_code'],
			$line['guard_city'],$line['guard_phone'],$line['guard_email'],$line['guardian_id']);
		}
		$guards = json_encode($arr);
		$row->set_value("guardians","$guards");
	}
	
	function formatting($row){
		$db = Connection::getDB();
		$guards = json_decode($row->get_value("guardians"),true);
		$date = explode(" ",  $row->get_value("acc_valid_form"));
		$dateobj = date_parse($row->get_value("acc_valid_form"));
		$date = $dateobj['year'].'-'.$dateobj['month'].'-'.$dateobj['day'];
		$row->set_value("acc_valid_form",$date);
		
		$dateobj = date_parse($row->get_value("acc_valid_until"));
		$date = $dateobj['year'].'-'.$dateobj['month'].'-'.$dateobj['day'];
		$row->set_value("acc_valid_until",$date);
		
		foreach ($guards as $valueas) {
			foreach ($valueas as $value) {
				if($value['delete'] == 'true'){
					$guard_id = $value['guardian_id'];
					$db->query("DELETE FROM guardian WHERE guardian_id='$guard_id'");
				}
				$guard_username = $value['guard_username'];
				$frizeaccess = $value['frizeaccess'];
				$guard_firstname = $value['guard_firstname'];
				$guard_surname = $value['guard_surname'];
				$guardian = $value['guardian'];
				$guard_address = $value['guard_address'];
				$guard_zip_code = $value['guard_zip_code'];
				$guard_city = $value['guard_city'];
				$guard_phone = $value['guard_phone'];
				$guard_email = $value['guard_email'];
				$guard_id = $value['guardian_id'];
				$result = $db->query("SELECT guardian_id FROM guardian WHERE guardian_id=$guard_id");					
				if(mysql_num_rows($result)){
					$db->query("UPDATE guardian SET  guard_username='$guard_username',frizeaccess=$frizeaccess,guard_firstname='$guard_firstname',
													  guard_surname='$guard_surname',guardian='$guardian', guard_address='$guard_address',
													  guard_zip_code='$guard_zip_code',guard_city='$guard_city',guard_phone='$guard_phone',
													  guard_email='$guard_email'
													  WHERE guardian_id=$guard_id");					
				}else{			
					$user_id = $row->get_value("user_id");
					$db->query("INSERT INTO guardian (guard_username,frizeaccess,guard_firstname,guard_surname,guardian,
									guard_address,guard_zip_code,guard_city,guard_phone,guard_email,user_id)
								 VALUES ('$guard_username',$frizeaccess,'$guard_firstname','$guard_surname','$guardian',
								 '$guard_address','$guard_zip_code','$guard_city','$guard_phone','$guard_email','$user_id')");
				}				
			}
		}
	}
	
	$form->render_table("users","user_id","user_id,name,surname,username,id_number,programme,sex,protected_identity,
						start_year,study_year,omynding,acc_valid_form,acc_valid_until,address,zip_code,city,phone,email,guardians,photo");
