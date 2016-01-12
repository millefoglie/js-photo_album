var contentLoader = require("../contentloader.js");
var ui = require("../menushelper.js");

var directives = {
	photo: {
		src: function() {
			return this.filepath;
		}
	},
	author: {
		text: function() {
			return "@" + this.author;
		}
	},
	title: {
		text: function() {
			return this.title;
		}
	},
	likes: {
		text: function() {
			return "♥" + this.likes;
		},
		"data-photo-id": function() {
			return this.photoId;
		}
	},
	"added-on": {
		text: function() {
			return moment(this.addedOn).fromNow();
		}
	},
	description: {
		text: function() {
			return this.description;
		}
	}
};

function render(photoModel) {
	return contentLoader.render("photo").then(function(result) {
		ui.authorization.menu().autoupdate();
		ui.album.menu().user().upload().update();

		var template = document.getElementById("photo-page");
		var data = extractTransparencyData(photoModel);

		Transparency.render(template, data, directives);
	});
}

function extractTransparencyData(model) {
	var photoItem = {};

	photoItem.filepath = "/" + model.filepath;
	photoItem.author = model.author.username;
	photoItem.title = model.title;
	photoItem.likes = model.likesCount;
	photoItem.addedOn = new Date(model.addedOn);
	photoItem.photoId = model.id;
	photoItem.description = model.description;
	
	return photoItem;
}

module.exports = {render: render};