Hash = {
	get: function() {
		var vars = {}, hash;
		var hashes = decodeURIComponent(window.location.hash.substr(1));
		if (hashes.length == 0) {return vars;}
		else {hashes = hashes.split('/');}
		
		for (var i in hashes) {
			hash = hashes[i].split('=');
			if (typeof hash[1] == 'undefined') {
				vars['anchor'] = hash[0];
			}
			else {
				vars[hash[0]] = hash[1];
			}
		}
		return vars;
	}

	,set: function(vars) {
		var hash = '';
		for (var i in vars) {
			hash += '/' + i + '=' + vars[i]
		}
		window.location.hash = hash.substr(1);
	}

	,add: function(key, val) {
		var hash = this.get();
		hash[key] = val;
		this.set(hash);
	}

	,remove: function(key) {
		var hash = this.get();
		delete hash[key];
		this.set(hash);
	}

	,clear: function() {
		window.location.hash = '';
	}
}