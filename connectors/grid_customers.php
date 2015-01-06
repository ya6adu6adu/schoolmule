<?php
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/options_connector.php");
	
 	class grid_customers{
		private $db = false;
		public function __construct(){
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
			$gridConn = new GridConnector($conn,"MySQL");
			$gridConn->event->attach(new EditData());

			$config = new GridConfiguration();
			$config->setColIds("customer_name,organisation_number,tax_id,accounting_system_id,max_user_agreed,users_now,max_mb_agreed,mb_now,frozen,address,zip,city,country_id,contact_person,phone,email,valid_from,valid_to");
			$config->setHeader("Customer name,Org. nr,Tax ID,Acc. ID,Users agreed,Users now,Max. Mb agreed,Mb now,Frozen,Address,Zip code,City,Country,Contact person,Phone,Email,Valid from,Valid to");
			$config->setInitWidths("120,80,80,80,80,80,100,80,50,120,100,100,100,120,100,100,100,100");
			$config->setColTypes("ed,ed,ed,ed,ed,ro,ed,ro,ch,ed,ed,ed,co,ed,ed,ed,ed,ed");
			$config->setColSorting("str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str");
			$config->attachHeader("#connector_text_filter,,,,,,,,,,,,,,,,,");
			$gridConn->set_config($config);
			$gridConn->render_table("customers","customer_id","customer_name,organisation_number,tax_id,accounting_system_id,max_user_agreed,users_now,max_mb_agreed,mb_now,frozen,address,zip,city,country_id,contact_person,phone,email,valid_from,valid_to");
		}			
	}

	class EditData{
		private $db = false;
		public function __construct(){
			$this->db = Connection::getDB();
		}
		public function beforeRender($data){
			$id = $data->get_value("customer_id");
			$sql = "SELECT admininstrator_id FROM administrators WHERE customer_id=$id";
			$result = $this->db->query($sql);
			$data->set_value("cnt_admins",mysql_num_rows($result));
			$sql = "SELECT entity_id FROM educational_entities WHERE customer_id=$id";
			$result = $this->db->query($sql);
			$data->set_value("cnt_entities",mysql_num_rows($result));
		}
	}
	

	
?>