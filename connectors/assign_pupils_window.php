<?php

class assign_pupils_window{
    private $db = false;
    protected $user;

    public function __construct(){
        $this->db = Connection::getDB();
        $this->user = new administrator();
        $this->db->query("START TRANSACTION");
        header("content-type:text/xml;charset=UTF-8");
        if(isset($_POST['action']) && $_POST['action']=='savetree'){
            $pupils = $_POST['pupils'];
            $pg = $_POST['pg'];

            $this->db->query("DELETE FROM pupil_pupilgroup WHERE pupilgroup_id = $pg");

            for ($i=0; $i < count($pupils); $i++){
                $this->db->query("INSERT INTO pupil_pupilgroup (pupil_id,pupilgroup_id) VALUES ({$pupils[$i]},$pg)");
            }

        }elseif(isset($_POST['action']) && $_POST['action']=='getchecked'){
            $checked = array();
            $pg = $_POST['pupilgroup'];

            $result = $this->db->query("SELECT pupil.pupil_id, forename, lastname FROM pupil,pupil_pupilgroup WHERE pupil.pupil_id = pupil_pupilgroup.pupil_id AND pupil_pupilgroup.pupilgroup_id=$pg");

            while($row = mysql_fetch_assoc($result)){
                $checked[] = 'pupil_'.$row['pupil_id'];
            }
            echo json_encode($checked);
        }else{
            $xml = '<tree id="0">';
            $xml .='<item child="1" text="'.dlang("pupup_setup_tree_pupils","Pupils").'" id="pupils" im1="folder_open.png" im2="folder_closed.png">';
            $xml .= $this->getPupilgroups();
            $xml .= '</item>';
            $xml .= '</tree>';
            echo $xml;
        }
        $this->db->query("COMMIT");
    }

    protected function getPupilgroups(){
        $xml = "";
        $entity = $this->user->entity;

        $result = $this->db->query("
              SELECT pupilgroup_id,title_en FROM pupilgroups WHERE entity_id = $entity
        ");
        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getPupilgroupsXml($row['pupilgroup_id'],$row['title_en']);
        }
        return $xml;
    }


    protected function getPupilgroupsXml($id,$title){
        $xml = "";
        $xml .= '<item child="0" id="pupil'.'_'.$id.'" text="'.$title.'" im0="pupilgroup.png" im1="pupilgroup.png" im2="pupilgroup.png">';
        $xml .= $this->getPupils($id);
        $xml .= '</item>';
        return $xml;
    }

    protected function getPupils($id){
        $xml = "";
        $entity = $this->user->entity;

        $result = $this->db->query("
              SELECT pupil.pupil_id, forename, lastname FROM pupil,pupil_pupilgroup WHERE pupil.pupil_id = pupil_pupilgroup.pupil_id AND pupil_pupilgroup.pupilgroup_id=$id
        ");
        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getPupilsXml($row['pupil_id'],$row['forename'].' '.$row['lastname']);
        }
        return $xml;
    }


    protected function getPupilsXml($id,$title){
        $xml = "";
        $xml .= '<item child="0" id="pupil'.'_'.$id.'" text="'.$title.'" im0="pupil.png" im1="pupil.png" im2="pupil.png">';
        $xml .= '</item>';
        return $xml;
    }

}
?>