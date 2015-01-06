<?php
require("../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
require("../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");
require("../dhtmlx/dhtmlxConnector/php/codebase/options_connector.php");

class grid_runit{
    private $db = false;
    public function __construct(){
        $this->db = Connection::getDB();
        $conn = $this->db->getConn();
        $gridConn = new GridConnector($conn,"MySQL");
        $gridConn->event->attach(new EditData());
        $config = new GridConfiguration();

        $config->setHeader(dlang("Result unit name"));
        $config->setColIds("result_unit_en");
        $config->setInitWidthsP("*");
        $config->setColTypes("ed");
        $config->setColAlign("left");
        $config->setColSorting("str");
        $gridConn->set_config($config);
        $gridConn->render_sql("SELECT * FROM result_units WHERE result_unit_id < 5","result_unit_id","result_unit_en");
    }
}
?>