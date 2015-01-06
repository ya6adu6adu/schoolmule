<?php

class assign_stgs_window{
    private $db = false;
    protected $user;

    public function __construct(){
        $this->db = Connection::getDB();
        $this->user = new administrator();
        $this->db->query("START TRANSACTION");
        header("content-type:text/xml;charset=UTF-8");
        if(isset($_POST['action']) && $_POST['action']=='savetree'){
            $stgs = $_POST['stgs'];
            $room = $_POST['room'];
            $moved = 0;
            $tree = new tree_assignments_by_studygroup(true);
            for ($i=0; $i < count($stgs); $i++){
                $id = $stgs[$i];

                $result = $this->db->query("
						SELECT course_room_id FROM studygroups
						WHERE studygroup_id={$id}
			    ");

                if(mysql_num_rows($result)==1){
                    $row = mysql_fetch_assoc($result);
                    $old_room = $row['course_room_id'];
                }else{
                    $old_room = 0;
                }

                if($old_room==$room){
                    continue;
                }

                $this->db->query("
                    UPDATE studygroups SET course_room_id = $room
                    WHERE studygroup_id={$id}
			    ");

                $tree->moveStudygroupItems($room,$id,$old_room);
                $moved++;
            }
            if($moved>0){
                $tree->setRoomForAll($room,'course_room','course_rooms',$room);
            }
        }elseif(isset($_POST['action']) && $_POST['action']=='getchecked'){
            $checked = array();
            $member = $_POST['member'];

            $result = $this->db->query("SELECT studygroup_id FROM course_room_members, studygroups
            WHERE  course_room_members.member_id = $member AND studygroups.course_room_id=course_room_members.course_room_id");

            while($row = mysql_fetch_assoc($result)){
                $checked[] = 'studygroup_'.$row['studygroup_id'];
            }
            echo json_encode($checked);
        }else{
            $xml = '<tree id="0">';
            $xml .='<item child="1" text="'.dlang("pupup_setup_tree_stg","Studygroups").'" id="studygroups" im1="folder_open.png" im2="folder_closed.png">';
            $xml .= $this->getStudygroups();
            $xml .= '</item>';
            $xml .= '</tree>';
            echo $xml;
        }
        $this->db->query("COMMIT");
    }

    protected function getStudygroups(){
        $xml = "";
        $entity = $this->user->entity;

        $result = $this->db->query("
              SELECT title_en, studygroup_id FROM studygroups WHERE entity_id = $entity
        ");
        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getStudygroupsXml($row['studygroup_id'],$row['title_en']);
        }
        return $xml;
    }


    protected function getStudygroupsXml($id,$title){
        $xml = "";
        $xml .= '<item child="1" id="studygroup'.'_'.$id.'" text="'.$title.'" im0="studygroup.png" im1="studygroup.png" im2="studygroup.png">';
        $xml .= '</item>';
        return $xml;
    }

}
?>