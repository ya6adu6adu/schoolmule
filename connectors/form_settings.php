<?php
	require("../dhtmlx/dhtmlxConnector/php/codebase/form_connector.php");
	
	class form_settings{
		private $db = false;
		
		public function __construct(){
			session_start();
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
			$form = new FormConnector($conn,"MySQL");
			$form->event->attach(new EditData());
			$form->render_table("superadmin","superadmin_id","username,password");
		}			
	}
	
	class EditData{	
		private $db = false;
		
		public function __construct(){
			$this->db = Connection::getDB();
		}
		public function beforeRender($data){
			//$data->set_value("password","");
		}
		
		public function afterUpdate($data){
            $pass = $data->get_value('username');
            $user = $data->get_value('password');
            $sql = "UPDATE users SET users.username  = '$user', users.password = '$pass' WHERE user_id = 1";
            $this->db->query($sql);
		}
	}