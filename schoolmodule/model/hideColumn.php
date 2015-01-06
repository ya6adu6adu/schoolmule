<?php

class hideColumn extends Core{
	function hideColumn(){
		$this->Core("hidecolumn");
		$this->addField("hide_group");
		$this->addField("hide_objective");
		$this->addField("hide_assign");
		$this->addField("hide_unit");
		$this->addField("hide_max");
		$this->addField("hide_pass");
		$this->addField("hide_result");
		$this->addField("hide_quality");
		$this->addField("hide_assesment");
		$this->addField("pupil_id");
	}
}

?>