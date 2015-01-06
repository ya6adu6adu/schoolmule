<?php

class group extends Core{
	function group(){
		$this->Core("course_objective_groups");
		$this->addField("title_en");
	}
}

?>