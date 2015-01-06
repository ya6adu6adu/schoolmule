$(function(){
    schoolmule.main.callback = viewSetup;
	if(schoolmule.main.user_id==null){
		schoolmule.main.showLogin();
	}else{
		viewSetup();
	}
});

var content = null;
var acc = null;
var navigation = null;
var tabbar = null;

function viewSetup(){
	tabbar = new schoolmule.controls.tabs({
		container:"second-menu",
		width:'60px',
		tabs_left:{
				id:'left-tab',
				callback: function(){
                    showSearchResult();
				},
				label:dlang('Search'),
				select: true
			},
        tabs: [
            {
                id:'import',
                callback: function(){
                    showSearchResult();
                },
                label:dlang('Search'),
                select: true
            }
        ]
	});
}

function cleanArea(){
	if(navigation){
		navigation.destroyNav();
		navigation = null;
	}
	if(content){
		content.setTitle("main-content","");
		content.destroy();
		content = null;
	}
}

function showSearchResult(){
	var script = "connectors/connector.php?control_id=grid_search";
	cleanArea();
	content = new schoolmule.controls.layout({
	cellsBlock:{
		display_footer_left: true,
		display_footer_right: true,
		cells_right:[								
			{
				cells:[
                {
                    new_count : false,
                    id : "search_field",
                    width: '100%',
                    height: '50px',
                    border_bottom: true
                },
                {
					new_count : false,
					id : "grid_search",
					title: "",
					width: '100%',
					height: '100%',
					border_bottom: false,
					display_footer_right:true
				}]									
			}			
		]
		}
	});
    var query =  parseGetParams().query;
    if(!query){
        query = "";
    }

    createSearch(query);

	schoolmule.instances.grid_search.attachTo("grid_search");
    var grid = schoolmule.instances.grid_search.getGrid().grid;
    if(query != ""){
        content.showLoader();
        grid.loadXML(script+'&query='+query);
    }else{
        grid.loadXML(script);
    }

	content.setTitle("main-content",dlang("Search results"));
}

function parseGetParams() {
    var $_GET = {};
    var __GET = window.location.search.substring(1).split("&");
    for(var i=0; i<__GET.length; i++) {
        var getVar = __GET[i].split("=");
        $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
    }
    return $_GET;
}

function createSearch(query){
    var search = $('<button class="button search-button">Search</button>');
    search.click(function(){
        var grid = schoolmule.instances.grid_search.getGrid().grid;
        content.showLoader();
        grid.clearAndLoad("connectors/connector.php?control_id=grid_search"+'&query='+$('#search_field input').val().toLowerCase(),function(){
            content.hideLoader();
        });
    });
    $('#search_field').append('<input type="text" value="'+query+'">');
    $('#search_field').append(search);
    $('#search_field').append('<div> results found</div>');
}