<?php
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/options_connector.php");
	
 	class grid_admins{
		private $db = false;
		public function __construct(){
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
			$gridConn = new GridConnector($conn,"MySQL");
            $gridConn->event->attach(new EditData());
			$config = new GridConfiguration();
			$config->setColIds("first_name,last_name,customer_id,entity_id,rw,freeze,login_name,login_pass,zip,city,country_id,phone,email");
			$config->setHeader(dlang("First name").','.dlang("Last name").','.dlang("Customer").','.dlang("Educ. entity").','.dlang("rw").','.dlang("Freeze").','.dlang("User name").','.dlang("Password").','.dlang("Zip code").','.dlang("City").','.dlang("Country").','.dlang("Phone").','.dlang("Email"));
			
			//$config->setHeader("First name,Last name,Customer,Educ. entity,rw,Freeze,User name,Password,Zip code,City,Country,Phone,Email");
			$config->setInitWidths("120,120,120,120,40,50,120,120,60,100,100,100,100");
			$config->setColTypes("ed,ed,co,co,co,ch,ed,ed,ed,ed,co,ed,ed");
			$config->setColSorting("str,str,int,int,int,int,str,str,int,str,str,str,str");
			$config->attachHeader("#connector_text_filter,#connector_select_filter,#connector_select_filter,#connector_select_filter,,,,,,,,,");
			
			$gridConn->set_config($config);
			
			$gridConn->set_options("rw",array("0"=>"r", "1"=>"rw"));
			
			$options = new OptionsConnector($conn); 
			$options->render_table("customers","customer_id","customer_id(value),customer_name(label)");
			$gridConn->set_options("customer_id",$options);
			
			$options = new OptionsConnector($conn); 
			$options->render_table("educational_entities","entity_id","entity_id(value),entity_name(label)");
			$gridConn->set_options("entity_id",$options);
						
			$gridConn->render_table("administrators","admininstrator_id","first_name,last_name,customer_id,entity_id,rw,freeze,login_name,login_pass,zip,city,country_id,phone,email");
		}


	}

class EditData{
    private $db = false;
    public function __construct(){
        $this->db = Connection::getDB();
    }

    public function afterUpdate($data){
        $pass = $data->get_value('login_pass');
        $user = $data->get_value('login_name');
        $entity = $data->get_value('entity_id');
        $email = $data->get_value('email');
        $admin = $data->get_id();
        $sql = "UPDATE users, administrators SET users.username  = '$user', users.password = '$pass' , users.entity_id = '$entity', users.email = '$email' WHERE admininstrator_id = $admin AND administrators.user_id = users.user_id";
        $this->db->query($sql);
    }

    public function afterInsert($data){
        $aid = $data->get_new_id();
        $sql = "INSERT INTO users (username,role) VALUES('','superadmin')";
        $result = $this->db->query($sql);
        $num = mysql_insert_id();
        $sql = "UPDATE administrators SET user_id  = $num  WHERE admininstrator_id = $aid";
        $this->db->query($sql);
    }
}

?>