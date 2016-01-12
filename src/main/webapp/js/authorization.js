var http = require("./http.js");

function Authorization() {}

Authorization.prototype.signIn = function(username, password) {
	var requestBody = "username=" + username + "&password=" + password;
	var headers = {"Content-Type": "application/x-www-form-urlencoded"};
	
	return http.post("/signin", requestBody, headers).then(function() {
		sessionStorage.setItem("username", username);
	});
};

Authorization.prototype.signUp = function(username, password) {
	var headers = {"Content-Type": "application/x-www-form-urlencoded"};
	var requestBody = "username=" + username + "&password=" + password;
	requestBody = encodeURI(requestBody);

	return http.post("/signup", requestBody, headers).then(function() {
		http.post("/signin", requestBody, headers);
	}).then(function() {
		sessionStorage.setItem("username", username);
	});
};

Authorization.prototype.signOut = function() {
	var self = this;
	
	return http.get("/signout").then(function() {
		sessionStorage.removeItem("username");
	});
};

Authorization.prototype.getUsername = function() {
	return sessionStorage.getItem("username");
};

module.exports = new Authorization();