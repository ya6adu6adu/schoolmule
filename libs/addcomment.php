<?php
	require_once 'Connection.php';
    require_once 'lang.php';
    require_once 'administrator.php';
	$db = Connection::getDB();
    $user = new administrator();
    if(!$user){
        header('Location: login.php');
    }
    $db->query("START TRANSACTION");
	switch ($_POST['action']) {
			case 'add':
				$user = $_POST["user"];
				$id = $_POST["id"];
				$iid = $_POST["item_id"];
				$comment = $_POST["comment"];
				$type = $_POST["type"];
				$date = $_POST["date"];
				$pupil_id = $_POST["pupil_id"];
				$db->query("INSERT INTO files_comments (comment_text,date,user,user_id,type_item,item_id,pupil_id) VALUES ('$comment','$date','$user',$id,'$type',$iid,$pupil_id)");
				echo mysql_insert_id();
			break;
		case 'delete':
			$id = $_POST["id"];
			$arr = explode('_', $id);
			$id = $arr[1];
			$db->query("DELETE FROM files_comments WHERE comment_id=$id");
			$db->query("DELETE FROM files WHERE comment=$id");
			break;
        case 'add_marks':
            $id = $_POST["file"];
            $marks = $_POST["marks"];
            @session_start();
            $_SESSION['submissions_update'] = $_SESSION['user'];
            session_write_close();
            $db->query("UPDATE files SET marks = '$marks', saved = 1 WHERE file_id = $id");
            break;
        case 'get_marks':
            $id = $_POST["file"];
            $result = $db->query("
                SELECT
                    files.marks, files.published, files_comments.comment_text, files_comments.private_notes
                FROM files, files_comments
                WHERE files.file_id = $id
                AND files_comments.comment_id = files.comment
            ");

            $row  = mysql_fetch_assoc($result);
            $result = array(
                "marks" => preg_replace("/\n/","\\n", $row['marks']),
                "pbl" => $row['published'],
                "comment_text" => $row['comment_text'],
                "private_notes" => $row['private_notes']
            );

            echo json_encode($result);
            break;
        case 'publish_marks':
            $id = $_POST["file"];
            $pupil = $_POST["pupil"];
            $assign = $_POST["assign"];
            $user = $_POST["user"];
            $username = $_POST["username"];
            $marks = $_POST["marks"];
            $date = $_POST["date"];

            $comments = $_POST["comments"];
            $notes = $_POST["notes"];

            $text = $comments;

            @session_start();
            $_SESSION['submissions_update'] = $_SESSION['user'];
            session_write_close();

            if($user->role=="pupil" || $user->role=="parent"){
/*                $db->query("INSERT INTO files_comments (user,user_id,type_item,item_id,pupil_id,date) VALUES('$username',$user,'assignment',$assign,$pupil,'$date')");
                $comm = mysql_insert_id();

                $result = $db->query("SELECT * FROM files WHERE file_id = $id");
                $row = mysql_fetch_assoc($result);

                $res = $db->query("SELECT sorder FROM files WHERE order_name='{$row['order_name']}' ORDER BY sorder DESC LIMIT 1");
                $filename = $row['order_name'];
                $num = mysql_fetch_assoc($res);
                $oname = $filename;
                $filrs = end(explode('.',$filename));
                $filename = explode('.'.$filrs,$filename);
                $filename  = $filename[0];
                $sorder = $num['sorder']+1;
                $filename = $filename.'_v'.$sorder.'.'.$filrs;

                $db->query("INSERT INTO files (file_name,item_type,item_id,user_id,comment,sorder,order_name,format,marks,parent_file)
                  VALUES ('{$filename}','{$row['item_type']}',{$row['item_id']},'{$user}',{$comm},{$sorder},'{$row['order_name']}','{$row['format']}','{$marks}',$id)");*/

            }else{
                $db->query("INSERT INTO files_comments (comment_text,user,user_id,type_item,item_id,pupil_id,date,private_notes) VALUES('$text','$username',$user,'assignment',$assign,$pupil,'$date','$notes')");
                $comm = mysql_insert_id();

                $result = $db->query("SELECT * FROM files WHERE file_id = $id");
                $row = mysql_fetch_assoc($result);

                $res = $db->query("SELECT sorder FROM files WHERE order_name='{$row['order_name']}' ORDER BY sorder DESC LIMIT 1");
                $filename = $row['order_name'];
                $num = mysql_fetch_assoc($res);
                $oname = $filename;
                $filrs = end(explode('.',$filename));
                $filename = explode('.'.$filrs,$filename);
                $filename  = $filename[0];
                $sorder = $num['sorder']+1;
                $filename = $filename.'_v'.$sorder.'.'.$filrs;

                $db->query("INSERT INTO files (file_name,file_pass,item_type,item_id,user_id,comment,sorder,order_name,format,marks,parent_file,published)
                  VALUES ('{$filename}','{$row['file_pass']}','{$row['item_type']}',{$row['item_id']},'{$user}',{$comm},{$sorder},'{$row['order_name']}','{$row['format']}','{$marks}',$id,1)");

            }
            break;

		default: break;
	}
    $db->query("COMMIT");