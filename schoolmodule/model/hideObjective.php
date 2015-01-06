<?php

class hideObjective extends Core{
	function hideObjective(){
		$this->Core("hideobjective");
		$this->addField("objective_id");
		$this->addField("pupil_id");
		$this->addField("studygroup_id");
		$this->addField("course_id");
	}
}

?>