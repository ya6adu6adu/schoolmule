<?php
class studyGroup_pupil extends Core{
	function studyGroup_pupil(){
		$this->Core("pupil_studygroup");
		$this->addField("pupil_id");
		$this->addField("studygroup_id");
	}
}
?>