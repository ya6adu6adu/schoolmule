<?php
	require_once 'Connection.php';
    require_once 'administrator.php';
        $db = Connection::getDB();
        if(isset($_GET['action'])){
            $pupil_id = $_GET["pupil"];
            $assign = $_GET["assign"];

            $result = $db->query("SELECT file_pass,file_name,studygroups.title_en as studygroup, forename, lastname
            FROM files,files_comments, pupli_submission_slot, pupil, studygroups WHERE files.comment = files_comments.comment_id AND files.item_type='assignment' AND files.item_id=$assign
            AND pupli_submission_slot.assignment_id = $assign AND pupil.pupil_id = pupli_submission_slot.pupil_id AND studygroups.studygroup_id = pupli_submission_slot.studygroup_id AND files_comments.pupil_id = pupil.pupil_id
            ");

            $zip = new ZipArchive();

            $result2 = $db->query("SELECT title_en
            FROM course_rooms_assignments WHERE assignment_id = $assign
            ");

            $row2 = mysql_fetch_assoc($result2);

            $zip_name = $row2['title_en'].".zip";


            if($zip->open($zip_name, ZIPARCHIVE::CREATE)!==TRUE){
                $error .= "Sorry ZIP creation failed at this time";
            }

            if(!mysql_num_rows($result)){
                $zip->addFromString("info.txt" , "Pupil not have submissions!");
            }
            while($row = mysql_fetch_assoc($result)){
                $zip->addEmptyDir($row['studygroup'].'('.$row['forename'].'_'.$row['lastname'].')');
                $zip->addFile('../'.$row['file_pass'], $row['studygroup'].'('.$row['forename'].'_'.$row['lastname'].')'.'/'.$row['file_name']);
            }
            $zip->close();

            if(file_exists($zip_name)){
                header('Content-type: application/zip');
                header('Content-Disposition: attachment; filename="'.$zip_name.'"');
                readfile($zip_name);
                unlink($zip_name);
            }else{
                echo "Pupil not have submissions";
            }

        }else{
            $id = $_POST["id"];
            $type = $_POST["type"];
            $pupil_id = $_POST["pupil_id"];
            $saved = null;

            $admin = new administrator();
            $files = array();
            $id = ($id=='0')?"":"item_id = $id AND ";
            $result = $db->query("SELECT files_comments.comment_text as comment, files_comments.user as user, files_comments.pupil_id as pupil,
             files_comments.date as date, files_comments.comment_id as kid, files_comments.private_notes as pnotes
             FROM files_comments WHERE $id type_item = '$type' AND pupil_id = '$pupil_id' ORDER BY comment_id DESC");

            while($row = mysql_fetch_assoc($result)){

                $files[$row['kid']]['comment'] = '<br>'.nl2br($row['comment']);

                if($admin->role=='staff' || $admin->role=='superadmin'){
                    $files[$row['kid']]['notes'] = $row['pnotes'];
                }


                $files[$row['kid']]['cid'] = $row['kid'];
                $files[$row['kid']]['user'] = $row['user'];
                $files[$row['kid']]['date'] = $row['date'];
                $files[$row['kid']]['file'] = array();
                $comm = $row['kid'];
                $result2 = $db->query("SELECT files.file_id as fid, files.file_name as fname,
                 files.file_pass as file, published as published, passed as passed, saved as saved, MAX(pupil_submission_result.assessment) as assessment
                  FROM files,pupli_submission_slot,pupil_submission_result WHERE comment=$comm
                  AND pupli_submission_slot.assignment_id = files.item_id AND pupli_submission_slot.pupil_id = {$row['pupil']} AND pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id");

                while($row2 = mysql_fetch_assoc($result2)){
                    if($admin->role=='staff' || $admin->role=='superadmin'){
                        $saved = $row2['saved'];
                    }else{
                        $saved = 0;
                    }
                    if(!$row2['fname']){
                        continue;
                    }
                    $files[$row['kid']]['file'][]= array(
                        'name' => $row2['fname'],
                        'full_name' =>$row2['file'],
                        'fid' =>$row2['fid'],
                        'passed' =>($row2['assessment']=='F'||$row2['assessment']=='Fx')?0:1,
                        'published' =>$row2['published'],
                        'saved' =>$saved
                    );
                }
            }
            echo json_encode($files);
        }
