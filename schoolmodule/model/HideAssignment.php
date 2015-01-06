<?php

class HideAssignment extends Core{
	function HideAssignment(){
		$this->Core("hideassignment");
		$this->addField("assignment_id");
		$this->addField("hide_from");
		$this->addField("hide_from_id");
	}
}

?>