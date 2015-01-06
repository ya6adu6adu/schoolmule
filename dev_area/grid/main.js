$(function(){
			schoolmule.instances.grid_assignments.attachTo("gridbox");
			$('#update').click(function(){
				$.get('GridLabelTranslator.php?s_lng=en&t_lng=de',function(){
					schoolmule.instances.grid_assignments.refresh();
				});
			
			});
		})