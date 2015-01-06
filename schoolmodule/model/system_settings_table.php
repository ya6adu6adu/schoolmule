<?php

class system_settings_table extends Core{
	function system_settings_table(){
		$this->Core("grade_definition");
		$this->addField("title_en");
	}
}

?>