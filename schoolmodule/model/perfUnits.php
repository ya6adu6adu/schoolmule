<?php

class perfUnits extends Core{
	function perfUnits(){
		$this->Core("pupil_performance_assessment");
		$this->addField("assessment");
		$this->addField("passed");
	}
}

?>