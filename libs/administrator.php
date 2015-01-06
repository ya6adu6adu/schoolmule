<?php
ini_set('display_errors','off');
class administrator{
	private $db = false;
	public $login = null;
	public $id = null;
    public $role = null;
    public $first_login = null;
    public $entity_title = null;
    public $full_name = null;
    public $langs = 'en,se,ru,da,fi,nw,pl,ge,it';
	
	public function __construct(){
        session_start();

        if(isset($_GET['action'])){
            switch ($_GET['action']){
                case "select_language":
                    $this->selectLanguage($_POST['lang']);
                    return true;
                    break;
            }
        }

        $this->db = Connection::getDB();
        if(isset($_POST['action']) && $_POST['action']=='pass_reset'){
            $pass = $_POST['password'];
            $email = $_POST['email'];
            echo $this->resetPass($email,$pass);
            return true;
        }

        if(isset($_GET['user']) && isset($_GET['hash'])){
            session_destroy();
            $sql = "SELECT username, password, user_id, role, change_time FROM users WHERE user_id={$_GET['user']}";
            $result = $this->db->query($sql);
            $user = mysql_fetch_assoc($result);

            $today = date("Y-m-d H:i:s");

            $interval =  abs((strtotime($today)-strtotime($user['change_time'])+2*60*60)/60);

            if($_GET['hash'] == md5($user['password']) && $interval<=15){

                $this->role = $user['role'];
                $this->getName($user['user_id'],$this->login);
                $this->getName($user['user_id'],$this->login);
                $this->login = $user['username'];
                $this->first_login = 1;
            }

            return 1;
        }

        if(isset($_SESSION['user'])){
            $id = $_SESSION['user'];
            $sql = "SELECT * FROM users WHERE user_id=$id";
            $result = $this->db->query($sql);
            while ($user = mysql_fetch_assoc($result)){
                $dir = 'user_files/'.$user['username'];
                if (!file_exists($dir)) {
                    mkdir($dir);
                }

                $_SESSION['isLoggedIn']=true;
                $_SESSION['filesystem.rootpath']= '../../../user_files/'.$user['username'];
                $_SESSION['moxiemanager.filesystem.rootpath'] =  '../../../user_files/'.$user['username'];

                $this->login = $user['username'];
                $this->id = $user['user_id'];
                $this->role = $user['role'];
                $this->first_login = $user['first_login'];

                $this->getName($id,$user['username']);

                if($user['first_login']==1){
                    $this->db->query("UPDATE users SET first_login = 0 WHERE user_id=$id");
                }
                $this->entity = $user['entity_id'];
                $sql = "SELECT * FROM educational_entities WHERE entity_id={$this->entity}";
                $resulte = $this->db->query($sql);
                $ent = mysql_fetch_assoc($resulte);
                $this->entity_title = $ent['entity_name'];
            }
        }
        if(isset($_POST['login']) && isset($_POST['password'])){
            $login = mysql_real_escape_string($_POST['login']);
            $password = mysql_real_escape_string($_POST['password']);
            $user = $this->getUser($login,$password);
            if($user){
                $this->login($user[0]);
                if($this->role == 'mainadmin'){
                    header('Location: backend.php');
                }
                echo json_encode(array('login'=>$user[1],'id'=>$user[0],'role'=>$user[2],'first_login'=>$user[3],'entity'=>$user[4],'entity_title'=>$user[5]));
            }else{
                echo json_encode(array("User with this login or password not exist!"));
            }
        }elseif(isset($_GET['action']) && $_GET['action']=="logout"){
            session_destroy();
        }
	}

    public function getName($id,$login){
        switch($this->role){
            case 'superadmin' :
                $sql = "SELECT * FROM administrators WHERE user_id=$id";
                $result = $this->db->query($sql);
                $row = mysql_fetch_assoc($result);
                $this->full_name = $row['first_name'].' '.$row['last_name'];
                break;
            case 'staff' :
                $sql = "SELECT * FROM staff_members WHERE user_id=$id";
                $result = $this->db->query($sql);
                $row = mysql_fetch_assoc($result);
                $this->full_name = $row['fore_name'].' '.$row['last_name'];
                break;
            case 'pupil' :
                $sql = "SELECT * FROM pupil WHERE user_id=$id";
                $result = $this->db->query($sql);
                $row = mysql_fetch_assoc($result);
                $this->full_name = $row['forename'].' '.$row['lastname'];
                break;
            case 'parent' :
                $sql = "SELECT * FROM parents WHERE user_id=$id";
                $result = $this->db->query($sql);
                $row = mysql_fetch_assoc($result);
                $this->full_name = $row['forename'].' '.$row['lastname'];
                break;
            default:
                $this->full_name = $login;
        }
    }

    public function selectLanguage($lang){

        if(strpos($this->langs,$lang)<0){
            $lang = 'en';
        }

        $_SESSION['lng'] = $lang;
        echo $lang;
    }

    private function resetPass($email,$password){
        $sql = "SELECT user_id, username, role, first_login FROM users WHERE username='$email'";
        $result = $this->db->query($sql);
        while ($user = mysql_fetch_assoc($result)){
            $this->db->query("UPDATE users SET password = '$password' WHERE user_id={$user['user_id']}");
            $_SESSION['user'] = $user['user_id'];
            return 1;
        }
        return 0;
    }

	private function getUser($login,$password){
		$sql = "SELECT user_id, username, role, first_login, entity_id FROM users WHERE username='$login' AND password='$password'";
		$result = $this->db->query($sql);
        while ($user = mysql_fetch_assoc($result)) {
            $sql = "SELECT * FROM educational_entities WHERE entity_id={$user['entity_id']}";
            $resulte = $this->db->query($sql);
            $ent = mysql_fetch_assoc($resulte);
            return array($user['user_id'],$user['username'],$user['role'],$user['first_login'],$user['entity_id'],$ent['entity_name']);
        }

		return false;
	}
		
	private function login($user){
		$_SESSION['user'] = $user;
		$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
	}
	
}