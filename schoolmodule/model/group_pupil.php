<?php

class group_pupil extends Core{
	function group_pupil(){
		$this->Core("group_pupil");
		$this->addField("objectivegroup_id");
		$this->addField("pupil_id");
	}
}

?>