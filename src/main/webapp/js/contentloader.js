var http = require("./http.js");
var auth = require("./authorization.js");
var modals = require("./modals.js");
var animation = require("./animation.js");

function ContentLoader() {}

ContentLoader.prototype.init = function(options) {
	if (!options) {
		return;
	}
	
	this.containerId = options.containerId;
	this.path = options.path || "./html/";
	this.extention = options.extention || ".html";
};

ContentLoader.prototype.render = function(page) {
	var self = this;

	return new Promise(function(resolve, reject) {
		var xhr = new moxie.xhr.XMLHttpRequest();
		var url = self.path + page + self.extention;

		xhr.open("GET", url, true);
		xhr.timeout = 10000;
		
		xhr.onreadystatechange = function() {
			var container = document.getElementById(self.containerId);

			if (xhr.readyState == 4) {
				if (parseInt(xhr.status / 100) == 2) {
					animation.fadeOut(container, 200);
					container.innerHTML = xhr.response;
					animation.fadeIn(container, 200);
					resolve(xhr.response);
				} else {
					modals.showError(xhr.response);
					reject(xhr.response);
				}
			}
		};

		xhr.ontimeout = function() {
			modals.showError("Could not load page.");
			xhr.abort();
		};
		
		xhr.send();
	});
};

module.exports = new ContentLoader();