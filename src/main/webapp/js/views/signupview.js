var contentLoader = require("../contentloader.js");
var ui = require("../menushelper.js");

function render(model) {
	return contentLoader.render("signup").then(function(result) {
		ui.authorization.menu().autoupdate();
		ui.album.menu().update();
	});
}

module.exports = {render: render};