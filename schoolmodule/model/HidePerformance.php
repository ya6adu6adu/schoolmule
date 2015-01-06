<?php

class HidePerformance extends Core{
	function HidePerformance(){
		$this->Core("hideperformance");
		$this->addField("performance_id");
		$this->addField("hide_from");
		$this->addField("hide_from_id");
	}
}

?>