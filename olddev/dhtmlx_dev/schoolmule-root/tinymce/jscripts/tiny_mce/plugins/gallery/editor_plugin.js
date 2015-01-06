/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('gallery');
	
	var
		Node = tinymce.html.Node,
		JSON = tinymce.util.JSON;

	tinymce.create('tinymce.plugins.galleryPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			var self = this;
			function isGalleryImg(node) {
				return node && node.nodeName === 'IMG' && ed.dom.hasClass(node, 'mceItemGallery');
			};
		
			ed.onPreInit.add(function() {
				// Allow video elements
				//ed.schema.addValidElements('object[id|style|width|height|classid|codebase|*],param[name|value],embed[id|style|width|height|type|src|*],video[*],audio[*],source[*]');

				// Convert video elements to image placeholder
				/*
				ed.parser.addNodeFilter('object,embed,video,audio,script,iframe', function(nodes) {
					var i = nodes.length;

					while (i--)
						self.objectToImg(nodes[i]);
				});
				*/

				// Convert image placeholders to video elements
				ed.serializer.addNodeFilter('img', function(nodes, name, args) {
					var i = nodes.length, node;

					while (i--) {
						node = nodes[i];
						if ((node.attr('class') || '').indexOf('mceItemGallery') !== -1)
							self.imgToObject(node, args);
							//console.log('preview call');
					}
				});
			});
		
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mcegallery');
			ed.addCommand('mcegallery', function() {
				ed.windowManager.open({
					file : url + '/gallery.htm',
					width : 475 + parseInt(ed.getLang('gallery.delta_width', 0)),
					height : 170 + parseInt(ed.getLang('gallery.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					some_custom_arg : 'custom arg' // Custom argument
				});
			});

			// Register gallery button
			ed.addButton('gallery', {
				title : 'gallery.desc',
				cmd : 'mcegallery',
				image : url + '/img/gallery.png'
			});

			// Add a node change handler, selects the button in the UI when a image is selected
			ed.onNodeChange.add(function(ed, cm, n) {
				//cm.setActive('gallery', n.nodeName == 'IMG');
				cm.setActive('gallery', isGalleryImg(n));
			});
		},

		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
		createControl : function(n, cm) {
			return null;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Gallery plugin',
				author : 'Schoolmule',
				authorurl : 'http://schoolmule.com',
				infourl : 'http://schoolmule.com',
				version : "1.0"
			};
		},
		
		dataToImg : function(data, force_absolute) {
		/*
			var self = this, editor = self.editor, baseUri = editor.documentBaseURI, sources, attrs, img, i;

			data.params.src = self.convertUrl(data.params.src, force_absolute);

			attrs = data.video.attrs;
			if (attrs)
				attrs.src = self.convertUrl(attrs.src, force_absolute);

			if (attrs)
				attrs.poster = self.convertUrl(attrs.poster, force_absolute);

			sources = toArray(data.video.sources);
			if (sources) {
				for (i = 0; i < sources.length; i++)
					sources[i].src = self.convertUrl(sources[i].src, force_absolute);
			}
			*/
			
			var self = this;
			console.log(self);

			img = self.editor.dom.create('img', {
				id : data.id,
				style : data.style,
				align : data.align,
				src : self.editor.theme.url + '/img/trans.gif',
				'class' : 'mceItemMedia mceItemGallery',
				'data-mce-json' : JSON.serialize(data, "'")
			});

			img.width = data.width || "320";
			img.height = data.height || "240";

			return img;
		},
		
		
		/**
		 * Converts a tinymce.html.Node image element to video/object/embed.
		 */
		imgToObject : function(node, args) {
			var self = this, 
			editor = self.editor,
			data, obj, innerObj, script, value, style, i, s;

			data = JSON.parse(node.attr('data-mce-json'));
			//for (var x in data) console.log(x);
			
			style = node.attr('data-mce-style')
			if (!style) {
				style = node.attr('style');

				if (style)
					style = editor.dom.serializeStyle(editor.dom.parseStyle(style, 'img'));
			}
			
			obj = new Node('div', 1).attr({
				id : node.attr('id'),
				style : style
			});
			
			s = 'var data = [';
			for (i in data) {
				s += '{' +
				'image:' + '"' + data[i].image + '",' +
				'title:' + '"' + data[i].title + '",' +
				'description:' + '"' + data[i].description + '",' +
				'link:' + '"' + data[i].link + '"' +
				'},';
			}
			s = s.slice(0, -1);
			s += '];'
			
			script = new Node('script', 1).attr('type', 'text/javascript');
			value = new Node('#text', 3);
			value.value = s +
				'Galleria.loadTheme("galleria/themes/twelve/galleria.twelve.js");'+
				'$("#'+node.attr('id')+'").galleria({'+
						'width: ' + node.attr('width') + ',' +
						'height: ' + node.attr('height') + ',' +
						'data_source: data'+
					'});';
			script.append(value);
			
			//obj.append(innerObj);
			obj.append(script);
			
			if (obj) node.replace(obj);
			
			// Handle iframe
			/*
			if (typeItem.name === 'Iframe') {
				replacement = new Node('iframe', 1);

				tinymce.each(rootAttributes, function(name) {
					var value = node.attr(name);

					if (name == 'class' && value)
						value = value.replace(/mceItem.+ ?/g, '');

					if (value && value.length > 0)
						replacement.attr(name, value);
				});

				for (name in data.params)
					replacement.attr(name, data.params[name]);

				replacement.attr({
					style: style,
					src: data.params.src
				});

				node.replace(replacement);

				return;
			}

			// Handle scripts
			if (this.editor.settings.media_use_script) {
				replacement = new Node('script', 1).attr('type', 'text/javascript');

				value = new Node('#text', 3);
				value.value = 'write' + typeItem.name + '(' + JSON.serialize(tinymce.extend(data.params, {
					width: node.attr('width'),
					height: node.attr('height')
				})) + ');';

				replacement.append(value);
				node.replace(replacement);

				return;
			}

			// Add HTML5 video element
			if (typeItem.name === 'Video' && data.video.sources[0]) {
				// Create new object element
				video = new Node('video', 1).attr(tinymce.extend({
					id : node.attr('id'),
					width: node.attr('width'),
					height: node.attr('height'),
					style : style
				}, data.video.attrs));

				// Get poster source and use that for flash fallback
				if (data.video.attrs)
					posterSrc = data.video.attrs.poster;

				sources = data.video.sources = toArray(data.video.sources);
				for (i = 0; i < sources.length; i++) {
					if (/\.mp4$/.test(sources[i].src))
						mp4Source = sources[i].src;
				}

				if (!sources[0].type) {
					video.attr('src', sources[0].src);
					sources.splice(0, 1);
				}

				for (i = 0; i < sources.length; i++) {
					source = new Node('source', 1).attr(sources[i]);
					source.shortEnded = true;
					video.append(source);
				}

				// Create flash fallback for video if we have a mp4 source
				if (mp4Source) {
					addPlayer(mp4Source, posterSrc);
					typeItem = self.getType('flash');
				} else
					data.params.src = '';
			}

			// Do we have a params src then we can generate object
			if (data.params.src) {
				// Is flv movie add player for it
				if (/\.flv$/i.test(data.params.src))
					addPlayer(data.params.src, '');

				if (args && args.force_absolute)
					data.params.src = editor.documentBaseURI.toAbsolute(data.params.src);

				// Create new object element
				object = new Node('object', 1).attr({
					id : node.attr('id'),
					width: node.attr('width'),
					height: node.attr('height'),
					style : style
				});

				tinymce.each(rootAttributes, function(name) {
					if (data[name] && name != 'type')
						object.attr(name, data[name]);
				});

				// Add params
				for (name in data.params) {
					param = new Node('param', 1);
					param.shortEnded = true;
					value = data.params[name];

					// Windows media needs to use url instead of src for the media URL
					if (name === 'src' && typeItem.name === 'WindowsMedia')
						name = 'url';

					param.attr({name: name, value: value});
					object.append(param);
				}

				// Setup add type and classid if strict is disabled
				if (this.editor.getParam('media_strict', true)) {
					object.attr({
						data: data.params.src,
						type: typeItem.mimes[0]
					});
				} else {
					object.attr({
						classid: "clsid:" + typeItem.clsids[0],
						codebase: typeItem.codebase
					});

					embed = new Node('embed', 1);
					embed.shortEnded = true;
					embed.attr({
						id: node.attr('id'),
						width: node.attr('width'),
						height: node.attr('height'),
						style : style,
						type: typeItem.mimes[0]
					});

					for (name in data.params)
						embed.attr(name, data.params[name]);

					tinymce.each(rootAttributes, function(name) {
						if (data[name] && name != 'type')
							embed.attr(name, data[name]);
					});

					object.append(embed);
				}

				// Insert raw HTML
				if (data.object_html) {
					value = new Node('#text', 3);
					value.raw = true;
					value.value = data.object_html;
					object.append(value);
				}

				// Append object to video element if it exists
				if (video)
					video.append(object);
			}

			if (video) {
				// Insert raw HTML
				if (data.video_html) {
					value = new Node('#text', 3);
					value.raw = true;
					value.value = data.video_html;
					video.append(value);
				}
			}
			*/
		},
		
		/**
		 * Converts a tinymce.html.Node video/object/embed to an img element.
		 *
		 * The video/object/embed will be converted into an image placeholder with a JSON data attribute like this:
		 * <img class="mceItemMedia mceItemFlash" width="100" height="100" data-mce-json="{..}" />
		 *
		 * The JSON structure will be like this:
		 * {'params':{'flashvars':'something','quality':'high','src':'someurl'}, 'video':{'sources':[{src: 'someurl', type: 'video/mp4'}]}}
		 */
		objectToImg : function(node) {
			var object, embed, video, iframe, img, name, id, width, height, style, i, html,
				param, params, source, sources, data, type, 
				lookup = this.lookup,
				matches, attrs, 
				urlConverter = this.editor.settings.url_converter,
				urlConverterScope = this.editor.settings.url_converter_scope;

			function getInnerHTML(node) {
				return new tinymce.html.Serializer({
					inner: true,
					validate: false
				}).serialize(node);
			};

			// If node isn't in document
			if (!node.parent)
				return;

			// Handle media scripts
			if (node.name === 'script') {
				if (node.firstChild)
					matches = scriptRegExp.exec(node.firstChild.value);

				if (!matches)
					return;

				type = matches[1];
				data = {video : {}, params : JSON.parse(matches[2])};
				width = data.params.width;
				height = data.params.height;
			}

			// Setup data objects
			data = data || {
				video : {},
				params : {}
			};

			// Setup new image object
			img = new Node('img', 1);
			img.attr({
				src : this.editor.theme.url + '/img/trans.gif'
			});
			
			name = node.name;
			
			// Video element
			if (name === 'video') {
				video = node;
				object = node.getAll('object')[0];
				embed = node.getAll('embed')[0];
				width = video.attr('width');
				height = video.attr('height');
				id = video.attr('id');
				data.video = {attrs : {}, sources : []};

				// Get all video attributes
				attrs = data.video.attrs;
				for (name in video.attributes.map)
					attrs[name] = video.attributes.map[name];

				source = node.attr('src');
				if (source)
					data.video.sources.push({src : urlConverter.call(urlConverterScope, source, 'src', 'video')});

				// Get all sources
				sources = video.getAll("source");
				for (i = 0; i < sources.length; i++) {
					source = sources[i].remove();

					data.video.sources.push({
						src: urlConverter.call(urlConverterScope, source.attr('src'), 'src', 'source'),
						type: source.attr('type'),
						media: source.attr('media')
					});
				}

				// Convert the poster URL
				if (attrs.poster)
					attrs.poster = urlConverter.call(urlConverterScope, attrs.poster, 'poster', 'video');
			}

			// Object element
			if (node.name === 'object') {
				object = node;
				embed = node.getAll('embed')[0];
			}

			// Embed element
			if (node.name === 'embed')
				embed = node;

			// Iframe element
			if (node.name === 'iframe') {
				iframe = node;
				type = 'Iframe';
			}

			if (object) {
				// Get width/height
				width = width || object.attr('width');
				height = height || object.attr('height');
				style = style || object.attr('style');
				id = id || object.attr('id');

				// Get all object params
				params = object.getAll("param");
				for (i = 0; i < params.length; i++) {
					param = params[i];
					name = param.remove().attr('name');

					if (!excludedAttrs[name])
						data.params[name] = param.attr('value');
				}

				data.params.src = data.params.src || object.attr('data');
			}

			if (embed) {
				// Get width/height
				width = width || embed.attr('width');
				height = height || embed.attr('height');
				style = style || embed.attr('style');
				id = id || embed.attr('id');

				// Get all embed attributes
				for (name in embed.attributes.map) {
					if (!excludedAttrs[name] && !data.params[name])
						data.params[name] = embed.attributes.map[name];
				}
			}

			if (iframe) {
				// Get width/height
				width = iframe.attr('width');
				height = iframe.attr('height');
				style = style || iframe.attr('style');
				id = iframe.attr('id');

				tinymce.each(rootAttributes, function(name) {
					img.attr(name, iframe.attr(name));
				});

				// Get all iframe attributes
				for (name in iframe.attributes.map) {
					if (!excludedAttrs[name] && !data.params[name])
						data.params[name] = iframe.attributes.map[name];
				}
			}

			// Use src not movie
			if (data.params.movie) {
				data.params.src = data.params.src || data.params.movie;
				delete data.params.movie;
			}

			// Convert the URL to relative/absolute depending on configuration
			if (data.params.src)
				data.params.src = urlConverter.call(urlConverterScope, data.params.src, 'src', 'object');

			if (video)
				type = lookup.video.name;

			if (object && !type)
				type = (lookup[(object.attr('clsid') || '').toLowerCase()] || lookup[(object.attr('type') || '').toLowerCase()] || {}).name;

			if (embed && !type)
				type = (lookup[(embed.attr('type') || '').toLowerCase()] || {}).name;

			// Replace the video/object/embed element with a placeholder image containing the data
			node.replace(img);

			// Remove embed
			if (embed)
				embed.remove();

			// Serialize the inner HTML of the object element
			if (object) {
				html = getInnerHTML(object.remove());

				if (html)
					data.object_html = html;
			}

			// Serialize the inner HTML of the video element
			if (video) {
				html = getInnerHTML(video.remove());

				if (html)
					data.video_html = html;
			}

			// Set width/height of placeholder
			img.attr({
				id : id,
				'class' : 'mceItemMedia mceItem' + (type || 'Flash'),
				style : style,
				width : width || "320",
				height : height || "240",
				"data-mce-json" : JSON.serialize(data, "'")
			});
		}
	});

	// Register plugin
	tinymce.PluginManager.add('gallery', tinymce.plugins.galleryPlugin);
})();