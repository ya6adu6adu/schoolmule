<?php

class hidePupil extends Core{
	function hidePupil(){
		$this->Core("hidepupil");
		$this->addField("pupil_id");
		$this->addField("studygroup_id");
	}
}

?>