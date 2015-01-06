$(function(){
	var content = null;	
	if(content){
		content.destroy();
	}
	content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[
                    {
                        id : "labels",
                        title: "Labels",
                        width: '100%',
                        height: '100%'
                    }
                    ]
                }
            ]
        }
	});

	schoolmule.instances.grid_labels.attachTo("labels");
	
	content.attachButtons([
        {
            label : "Translate from bing",
            id : "but_translate",
            callback : function(){
                content.showLoader();
                $.get('../connectors/connector.php?control_id=grid_labels&translate=1&s_lng=en&t_lng=de',function(){
                    schoolmule.instances.grid_labels.refresh();
                    content.hideLoader();
                });
            }
        }
	]);
});