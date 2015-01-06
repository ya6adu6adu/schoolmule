<?php
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/options_connector.php");
	
 	class grid_setup_parents{
		private $db = false;
        private $user = false;
        private $portret_pass = 'images/users/';

		public function __construct(){
			$this->db = Connection::getDB();
			error_reporting(E_ALL ^ E_NOTICE);
            $this->user = new administrator();
			if(!isset($_POST['action'])){
				echo '<?xml version="1.0" encoding="UTF-8"?>';
				echo '<rows>';

				echo $this->getParents($_GET['pupil']);
				echo '</rows>';					
			}else{
				$this->db->query("START TRANSACTION");
				$response = "";
				$response = $this->parseRequest();
				$this->db->query("COMMIT");
				echo json_encode($response);					
			}
		}

		function parseRequest(){
		 	$action = $_POST['action'];
			$act = explode("_", $action);
			switch($act[0]){
				case "delete":
					$response = $this->deleteItem($act[1]);
					break;
                case "setpass":
                    $response = $this->setPassword($_POST['user'], $_POST['pass']);
                    break;
                case "setusername":
                    $response = $this->editUsername($_POST['user'], $_POST['username']);
                    break;
                case "editparentname":
                    $response = $this->editParentName($_POST['name'], $_POST['id']);
                    break;
                case "editparentsurname":
                    $response = $this->editParentSurName($_POST['name'], $_POST['id']);
                    break;
                case "getlogs":
                    $response = $this->getLogs();
                    break;
			}
			return $response;
		}

        protected function setPassword($user, $pass){
            $this->db->query("UPDATE users SET password = '$pass' WHERE user_id=$user");
            return array('newpass' => 1);
        }

        protected function editParentNameAuto($id){
            $res = $this->db->query("SELECT forename,lastname,user_id FROM parents WHERE parent_id=$id");
            $row = mysql_fetch_assoc($res);
            $uname = strtolower($row['forename'].'.'.$row['lastname']);
            $result = $this->db->query("SELECT * FROM users WHERE username LIKE '$uname%'");
            if(mysql_fetch_assoc($result)){
                $uname = $uname.'_'.(mysql_num_rows($result)+1);
            }
            $this->db->query("UPDATE users SET username = '$uname' WHERE user_id={$row['user_id']}");
            return $uname;
        }


        protected function editParentName($name, $id){
            $this->db->query("UPDATE parents SET forename = '$name' WHERE parent_id=$id");
            $username = $this->editParentNameAuto($id);
            return array('username' => $username);
        }
        protected function editParentSurName($name, $id){
            $this->db->query("UPDATE parents SET lastname = '$name' WHERE parent_id=$id");
            $username = $this->editParentNameAuto($id);
            return array('username' => $username);
        }

        protected function addLogItem($type, $name, $action = "Add new "){
            $text = $action.$type.': '.$name;
            $admin = new administrator();
            if($admin->login!=null){
                $user = $admin->login;
            }else{
                $user = "Guest";
            }
            $this->db->query("INSERT INTO setup_logs (time, text, user) VALUES (CURDATE(),'$text','$user')");
            return true;
        }

        protected function getLogs(){
            $logs = array();
            $result = $this->db->query("SELECT * FROM setup_logs");
            while($row = mysql_fetch_assoc($result)){
                $logs[] = array(
                    'time' => $row['time'],
                    'text' => $row['text'],
                    'user' => $row['user']
                );
            }
            return $logs;
        }


		
		protected function getParents($id){
            $entity =  $this->user->entity;
			$xml = "";
			$result = $this->db->query("SELECT parent_id, forename, lastname, users.user_id as user_id, username, email, password , users.created_at as created_at, active_until
			FROM parents, users WHERE pupil_id=$id AND users.user_id = parents.user_id AND parents.parent_id={$_GET['parent']} AND users.entity_id=$entity");
			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getParentsXml($row['parent_id'],$row['forename'],$row['lastname'], $row['username'], $row['password'], $row['user_id'], $row['email']);
			}
			return $xml;		
		}
		
		protected function getParentsXml($id,$name,$lname, $login, $pass, $user,$email){
			$xml = "";
			$xml .= '<row child="0" id="parent'.'_'.$id.'">';
			$xml .= '
			    <cell></cell>
			    <cell>'.$name.'</cell>
                <cell>'.$lname.'</cell>
                <cell>'.$login.'</cell>
                <cell>'.$email.'</cell>
                <cell>'.dlang("grid_reset_cell_text","reset").'</cell>

				<userdata name="pass">'.$pass.'</userdata>
                <userdata name="user">'.$user.'</userdata>
			';
			$xml .= '</row>';
			return $xml;
		}

        protected function deleteChecked($checked){
            $che = explode(',' , $checked);

            for($i=0; $i<count($che); $i++){
                $item = explode('_',$che[$i]);
                switch($item[0]){
                    case 'parent':
                        $response = $this->deleteParent($item[1]);
                        break;
                    default:
                        break;
                }
            }
            return $response;
        }

        protected function editUsername($user, $username){
            $sql = "SELECT user_id FROM users WHERE username = '$username'";
            $result = $this->db->query($sql);
            if(mysql_num_rows($result) == 0){
                $sql = "UPDATE users SET username = '$username'  WHERE user_id = $user";
                $this->db->query($sql);
                return 1;
            }else{
                return 0;
            }
        }

		protected function deleteParent($id){
			 $this->db->query("
				 DELETE parents,users FROM parents,users WHERE parents.parent_id={$id} AND users.user_id = parents.user_id;
			");
			return array('delete' => 1);
		}

        public function generate_password($number){
            $arr = array('a','b','c','d','e','f',
                'g','h','i','j','k','l',
                'm','n','o','p','r','s',
                't','u','v','x','y','z',
                'A','B','C','D','E','F',
                'G','H','I','J','K','L',
                'M','N','O','P','R','S',
                'T','U','V','X','Y','Z',
                '1','2','3','4','5','6',
                '7','8','9','0');
            $pass = "";
            for($i = 0; $i < $number; $i++)
            {
                $index = rand(0, count($arr) - 1);
                $pass .= $arr[$index];
            }
            return $pass;
        }

	}
?>