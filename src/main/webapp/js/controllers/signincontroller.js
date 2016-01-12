var signInView = require("../views/signinview.js");
var auth = require("../authorization.js");
var modals = require("../modals.js");

function start() {
	signInView.render().then(function(result) {
		bindEvents();
	});
}

function bindEvents() {
	var form = document.getElementById("signin");
	
	form.addEventListener('submit', handleSubmit.bind(undefined, form), true);
}

function handleSubmit(form, evt) {
	evt.preventDefault();

	if (validate(form)) {
		auth.signIn(form.username.value, form.password.value)
		.then(
			function onFulfilled(result) {
				window.location.href = "#/photos";
			},
			function onRejected(error) {
				ui.showError(error);
			}	
		);
	}
}

function validate(form) {
	var u = form.username;
	var p = form.password;
	
	if (!u.value) {
		showError("Username field is empty.");
		return false;
	}
	
	if (!p.value) {
		showError("Password field is empty.");
		return false;
	}
	
	return true;
}

function showError(msg) {
	if (typeof HTMLFormElement.prototype.checkValidity != 'function') {
		modals.showError(msg);
	}
}

module.exports = {start: start};