<?php
require_once 'Connection.php';
/*

HTML5/FLASH MODE

(MODE will detected on client side automaticaly. Working mode will passed to server as GET param "mode")

response format

if upload was good, you need to specify state=true and name - will passed in form.send() as serverName param
{state: 'true', name: 'filename'}

*/
//if (@$_REQUEST["mode"] == "html5" || @$_REQUEST["mode"] == "flash") {
	$filename = $_FILES["file"]["name"];
	$user = $_GET["login"];
	$id = $_GET["id"];
	$iid = $_GET["item_id"];
	$comment = $_GET["comment"];
	$db = Connection::getDB();
    $fname = null;
    $explodeFileName = explode('.',$filename);
    $fname = $user.'/'.rand(1,50000).time().'.'.end($explodeFileName);
	$file = "../user_files/".$fname;
	$fout = "user_files/".$fname;

    $temp = substr_count($filename,'.');

    $res = $db->query("SELECT sorder FROM files WHERE order_name='$filename' AND user_id = $id ORDER BY sorder DESC LIMIT 1");
    $num = mysql_fetch_assoc($res);
    $oname = $filename;
    $filrs = end($explodeFileName);
    $filename = explode('.'.$filrs,$filename);
    $filename  = $filename[0];
    $sorder = $num['sorder']+1;
    $filename = $filename.'_v'.$sorder.'.'.$filrs;
	$db->query("INSERT INTO files (file_name,file_pass,item_type,item_id,user_id,comment,sorder,order_name,format) VALUES ('$filename','$fout','assignment',$iid,'$id','$comment','{$sorder}','{$oname}','{$filrs}')");
	if(!is_dir("../user_files/".$user)){
		mkdir("../user_files/".$user);
	}
	
	move_uploaded_file($_FILES["file"]["tmp_name"],$file);
	print_r("{state: true, name:'".str_replace("'","\\'",$fout)."'}");
//}

/*

HTML4 MODE

response format:

to cancel uploading
{state: 'cancelled'}

if upload was good, you need to specify state=true, name - will passed in form.send() as serverName param, size - filesize to update in list
{state: 'true', name: 'filename', size: 1234}

*/



?>
