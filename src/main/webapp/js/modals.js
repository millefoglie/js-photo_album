var animation = require("./animation.js");

function ModalsHelper() {}

ModalsHelper.prototype.showInfo = function(html, delay) {
	showModal(html, delay, "info");
};

ModalsHelper.prototype.showError = function(html, delay) {
	showModal(html, delay, "error");
};

function showModal(html, delay, clazz) {
	delay = delay || 4000;

	var modal = document.createElement("div");

	modal.classList.add(clazz);
	modal.innerHTML = html;

	document.body.appendChild(modal);

	animation.fadeIn(modal, 150);

	setTimeout(function() {
		animation.fadeOut(modal, 150);
		document.body.removeChild(modal);
	}, delay);
}

module.exports = new ModalsHelper();