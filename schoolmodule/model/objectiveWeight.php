<?php

class objectiveWeight extends Core{
	function objectiveWeight(){
		$this->Core("objective_weight");
		$this->addField("objective_id");
		$this->addField("amount");
	}
}

?>