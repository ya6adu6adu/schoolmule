<?php


session_start();

include_once("libs/Connection.php");

$_SESSION['lng'] = $_GET['lng']?$_GET['lng']:'en';
$_POST['login'] = 'admin';
$_POST['password'] = 'admin';
$db = Connection::getDB();

if(isset($_SESSION['user'])){
    $id = $_SESSION['user'];
    $sql = "SELECT * FROM users WHERE user_id=$id";
    $result = $db->query($sql);
    while ($user = mysql_fetch_assoc($result)) {
        $login = $user['username'];
        $id = $user['user_id'];
        $role = $user['role'];
        echo $login;
    }
}elseif(isset($_POST['login']) && isset($_POST['password'])){
    $login = mysql_real_escape_string($_POST['login']);
    $password = mysql_real_escape_string($_POST['password']);
    $result = $db->query("SELECT user_id, username, role FROM users WHERE username='$login' AND password='$password'");
    while ($users = mysql_fetch_assoc($result)) {
        $user = array($users['user_id'],$users['username'],$users['role']);
    }
    if($user){
        $_SESSION['user'] = $user[0];
        echo json_encode(array('login'=>$user[1],'id'=>$user[0],'role'=>$user[2]));
    }else{
        echo "User with this login or password not exist!";
    }
}elseif(isset($_GET['action']) && $_GET['action']=="logout"){
    session_destroy();
}
