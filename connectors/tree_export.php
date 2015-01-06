<?php
include_once '../libs/Connection.php';
include_once '../libs/tree_editor.php';

class tree_export extends tree_programme_structure{

    public function __construct(){
        parent::__construct();
        if(!isset($_POST['action'])){
            header("content-type:text/xml;charset=UTF-8");
            if(isset($_GET['refresh'])){
                $refresh = $_GET['refresh'];
            }else{
                $refresh = false;
            }
            echo ($this->getXml($_GET['id'],$_GET['autoload'],$refresh));
        }else{
            $this->db->query("START TRANSACTION");
            $response = "";
            $response = $this->parseRequest();
            $this->db->query("COMMIT");
            echo json_encode($response);
        }
    }

    public function getXmlTree($id=0,$rf,$autoload = true){
        $xml = '<?xml version="1.0"?><tree id="'.$id.'">';
        $xml .= $this->getXmlMyCourseRoomsAuto($id,$rf,$autoload);
        $xml .= '</tree>';
        return $xml;
    }

    /********* Top level *****************/
    protected function getXmlMyCourseRoomsAuto($id,$rf,$autoload){
        $xml = '<item child="1" text="'.dlang("tree_export_users","Users").'" id="users" im1="folder_open.png" im2="folder_closed.png">';
        $tusers = new tree_users();
        $xml .= $tusers->getXmlMyCourseRoomsAuto(0,0,0);
        $xml .= '</item>';
        //$xml .= '<item child="0" text="-------------------------------------------------------"></item>';
        $xml .= '<item child="1" text="'.dlang("tree_export_pstruct","Programme structure").'" id="structure" im1="folder_open.png" im2="folder_closed.png">';
        $xml .= $this->getAcademicYears();
        $xml .= '</item>';
        return $xml;
    }
}
?>