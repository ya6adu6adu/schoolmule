<?php

class assignment extends Core{
	function assignmentOrPerformance(){
		$this->Core("course_rooms_assignments");
		$this->addField("objectiveId");
		$this->addField("assignPerfType");
		$this->addField("mandatory");
		$this->addField("assignPerfName");
	}
}

?>