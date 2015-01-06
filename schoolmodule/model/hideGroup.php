<?php

class hideGroup extends Core{
	function hideGroup(){
		$this->Core("hidegroup");
		$this->addField("objectivegroup_id");
		$this->addField("pupil_id");
		$this->addField("studygroup_id");
		$this->addField("course_id");
	}
}

?>