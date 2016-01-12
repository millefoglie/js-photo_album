var meld = require("./lib/meld.js");

function IEHelper() {}

IEHelper.prototype.init = function() {
	if (!jQuery) {
		throw new Error("jQuery not found for IEHelper");
	}

	if (!meld) {
		throw new Error("Meld not found for IEHelper");
	}

	Transparency.render = meld.around(Transparency.render, function() {
		var joinpoint = meld.joinpoint();

		var template = $(joinpoint.args[0]);
		var data = joinpoint.args[1];
		var directives = joinpoint.args[2];

		var photoItem = template.find(".photo-item");

		for (var i = 0; i < data.length; i++) {
			template.append(photoItem);
			ie8updateStyles(photoItem.get(0));
			// joinpoint.proceed(photoItem.get(0), data[i]['photo-item'], directives['photo-item']);
			photoItem = $(ie8deepCloneNode(photoItem.get(0)));
		}

		document.body.className = document.body.className;
	});
};

function ie8deepCloneNode(node) {
	if (node.nodeType == 3) {
		return document.createTextNode(node.nodeValue);
	}

	var clone = node.cloneNode(false);
	var children = node.childNodes;

	for (var i = 0; i < children.length; i++) {
		clone.appendChild(ie8deepCloneNode(children[i]));
	}

	clone.className = node.className;
	ie8updateStyles(clone);

	return clone;
}

function ie8updateStyles(node) {
	if (node.nodeType == 3) {
		return;
	}

	var disp = node.style.display;
	node.style.display = "none";
	var redrawFix = node.offsetHeight;
	node.style.display = disp;

	var children = node.childNodes;

	for (var i = 0; i < children.length; i++) {
		ie8updateStyles(children[i]);
	}
}

module.exports = new IEHelper();