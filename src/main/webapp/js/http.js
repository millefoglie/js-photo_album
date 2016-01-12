var modals = require("./modals.js");

function Http() {}

Http.prototype.get = function(url, requestBody, headers) {
	return this.performRequest("GET", url, requestBody, headers);
};

Http.prototype.post = function(url, requestBody, headers) {
	return this.performRequest("POST", url, requestBody, headers);
};

Http.prototype.performRequest = function(method, url, requestBody, headers) {
	var self = this;
	
	return new Promise(function(resolve, reject) {
		var xhr = new moxie.xhr.XMLHttpRequest();
		var result;

		xhr.open(method, url, true);
		
		for (var h in headers) {
			xhr.setRequestHeader(h, headers[h]);
		}

		xhr.timeout = 10000;
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (parseInt(xhr.status / 100) == 2) {
					try {
						result = JSON.parse(xhr.response);
					} catch (e) {
						result = xhr.response;
					}

					resolve(result);
				} else {
					modals.showError(xhr.response);
					reject(xhr.response);
				}
			}
		};

		xhr.ontimeout = function() {
			modals.showError("Could not receive response from the server.");
			xhr.abort();
		};
		
		xhr.send(requestBody);
	});
};

module.exports = new Http();