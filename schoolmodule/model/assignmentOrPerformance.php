<?php

class assignmentOrPerformance extends Core{
	function assignmentOrPerformance(){
		$this->Core("pupilprogress_assignmentOrPerformance");
		$this->addField("objectiveId");
		$this->addField("assignPerfType");
		$this->addField("mandatory");
		$this->addField("assignPerfName");
	}
}

?>