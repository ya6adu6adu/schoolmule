tinyMCEPopup.requireLangPack();

var ExampleDialog = {
	init : function() {
		var form = document.forms[0];
	},

	insert : function() {
		var form = document.forms[0],
		JSON = tinymce.util.JSON;
		
		//width and height
		var gal_width = form.elements[0].value;
		var gal_height = form.elements[1].value;
		
		var alignIndex = form.gallery_align.selectedIndex;
		var divStyle = '', imgStyle = '';
		
		switch (alignIndex) {
		case 0:
			divStyle = 'style="float:left;margin-right:8px;"';
			imgStyle = 'float:left;margin-right:8px;';
			break;
		case 1:
			divStyle = 'style="width:'+gal_width+'px;height:'+gal_height+'px;margin:0 auto 8px;"';
			imgStyle = 'margin:0 auto 8px;';
			break;
		case 2:
			divStyle = 'style="float:right;margin-left:8px;"';
			imgStyle = 'float:right;margin-left:8px;';
			break;
		}
		
		var fCount = Math.floor(form.elements.length / 4) - 1;
		
		var i, path, title, desc, link, data = [];
		/*
		s = '<p id="gallery-div" '+divStyle+'></p>'+
			'<script type="text/javascript">'+
				'var data = [';
		*/
				
		for (i = 0; i < fCount; i++) {
			path  =  form.elements[4 + (i * 4) + 0].value;
			title =  form.elements[4 + (i * 4) + 1].value;
			desc  =  form.elements[4 + (i * 4) + 2].value;
			link  =  form.elements[4 + (i * 4) + 3].value;
			
			/*
			s += '{' +
				'image:' + '"' + path + '",' +
				'title:' + '"' + title + '",' +
				'description:' + '"' + desc + '",' +
				'link:' + '"' + link + '"' +
				'},';
				
			if (i == (fCount - 1)) s = s.slice(0, -1);
			*/
			
			data[i] = new Object();
			data[i].image = path;
			data[i].title = title;
			data[i].description = desc;
			data[i].link = link;
		}
		
		/*
		s += '];' +
			'Galleria.loadTheme("galleria/themes/twelve/galleria.twelve.js");'+
			'$("#gallery-div").galleria({'+
					'width: ' + gal_width + ',' +
					'height: ' + gal_height + ',' +
					'data_source: data'+
				'});'+
			'</script>';
		*/
		//console.log(s);
		//console.log(imgStyle);
		
		var editor = tinyMCEPopup.editor;
		
		//editor.execCommand('mceInsertContent', false, s);
		
		editor.execCommand('mceRepaint');
		tinyMCEPopup.restoreSelection();
		/*
		var data = 
		[
			{
				image: '/schoolmule-root-dev/images/01.jpg',
				title: 'Some title',
				description: 'Some description',
				link: 'http://www.google.com/'
			},
			{
				image: '/schoolmule-root-dev/images/02.jpg',
				title: 'Some title',
				description: 'Some description',
				link: 'http://www.google.com/'
			}
		];
		*/

		var img = editor.dom.create('img', {
				id : "imgid",
				//style : 'width:'+gal_width+'px;height:'+gal_height+'px;'+imgStyle,
				style : imgStyle,
				src : editor.theme.url + '/img/trans.gif',
				'class' : 'mceItemMedia mceItemGallery',
				//'class' : 'mceItemGallery',
				width : gal_width,
				height : gal_height,
				"data-mce-json" : JSON.serialize(data, "'")
			});
			
		//editor.selection.setNode(editor.plugins.galleryPlugin.dataToImg(data));
		editor.selection.setNode(img);
		
		tinyMCEPopup.close();
	}
};

tinyMCEPopup.onInit.add(ExampleDialog.init, ExampleDialog);
