<?php

class assignPerfUnits extends Core{
	function assignPerfUnits(){
		$this->Core("resultsets");
		$this->addField("assignment_id");
		$this->addField("result_unit");
		$this->addField("result_max");
		$this->addField("result_pass");
		$this->addField("result");
		$this->addField("assessment");
	}
}

?>