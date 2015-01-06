<?php

class assignmentPerformance extends Core{
	function assignmentPerformance(){
		$this->Core("pupilprogress_assignmentPerformance");
		$this->addField("objectiveId");
		$this->addField("assignPerfType");
		$this->addField("mandatory");
		$this->addField("assignPerfName");
		$this->addField("assignUnit");
		$this->addField("assignMax");
		$this->addField("assignPass");
		$this->addField("subResult");
		$this->addField("subAssessment");
	}
}

?>