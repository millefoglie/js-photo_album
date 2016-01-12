var signUpView = require("../views/signupview.js");
var auth = require("../authorization.js");
var modals = require("../modals.js");

function start() {
	signUpView.render().then(function(result) {
		bindEvents();
	});
}

function bindEvents() {
	var form = document.getElementById("signup");
	
	form.addEventListener("submit", handleSubmit.bind(undefined, form), true);
}

function handleSubmit(form, evt) {
	evt.preventDefault();

	if (validate(form)) {
		auth.signUp(form.username.value, form.password.value)
		.then(function() {
			window.location.href = "#/photos";
		});
	}
}

function validate(form) {
	var u = form.username;
	var p = form.password;
	var pr = form["password-repeat"];

	if (!u.value) {
		showError("Username field is empty.");
		return false;
	}

	if (!p.value) {
		showError("Password field is empty.");
		return false;
	}

	if (p.value.length < 4) {
		modals.showError("Password should be at least 4 chararcters long.");
		return false;
	}

	if (p.value != pr.value) {
		modals.showError("Passwords do not match.");
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