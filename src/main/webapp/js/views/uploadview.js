var contentLoader = require("../contentloader.js");
var ui = require("../menushelper.js");

function render(model) {
	return contentLoader.render("upload").then(function(result) {
		ui.authorization.menu().autoupdate();
		ui.album.menu().user().upload().update();
	});
}

module.exports = {render: render};