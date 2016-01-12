var auth = require("../authorization.js");

function start() {
	auth.signOut().then(function() {
		window.location.href = "#/photos";
	});
}

module.exports = {start: start};