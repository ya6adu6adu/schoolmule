<?php

class studyGroup extends Core{
	function studyGroup(){
		$this->Core("studygroups");
		$this->addField("title_en");
	}
}

?>