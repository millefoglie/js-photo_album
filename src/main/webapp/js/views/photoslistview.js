var contentLoader = require("../contentloader.js");
var ui = require("../menushelper.js");

var directives = {
	"photo-item" : {
		photo: {
			src: function() {
				return this.filepath;
			},
			alt: function() {
				return this.title;
			},
			"data-photo-id": function() {
				return this.photoId;
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
		}
	}
};

function render(photosListModel) {
	return contentLoader.render("photoslist").then(function(result) {
		ui.authorization.menu().autoupdate();
		ui.album.menu().user().upload().sort().filter().update();

		var template = document.getElementById("photos-list");
		var data = extractTransparencyData(photosListModel);

		Transparency.render(template, data, directives);

		var pageControls = document.createElement("div");
		pageControls.classList.add("page-controls");

		template.setAttribute("data-page-number", photosListModel.number);

		if (!photosListModel.first) {
			createPagingButton("go-prev", "Previous", pageControls);
		}

		if (!photosListModel.last) {
			createPagingButton("go-next", "Next", pageControls);
		}

		if (pageControls.innerHTML) {
			document.getElementById("photos-list-wrapper")
			.appendChild(pageControls);
		}
	});
}

function extractTransparencyData(model) {
	var data = [];
	
	model.content.forEach(function(it, idx) {
		var photoItem = {};
		
		photoItem.filepath = "/" + it.filepath;
		photoItem.author = it.author.username;
		photoItem.title = it.title;
		photoItem.likes = it.likesCount;
		photoItem.addedOn = new Date(it.addedOn);
		photoItem.photoId = it.id;
		
		data[idx] = {"photo-item" : photoItem};
	});
	
	return data;
}

function createPagingButton(id, caption, container) {
	var btn = document.createElement("a");
	btn.setAttribute("id", id);
	btn.setAttribute("href", "#");
	btn.classList.add("pure-button");
	btn.classList.add("pure-button-primary");
	btn.innerHTML = caption;

	if (container.hasChildNodes()) {
		container.appendChild(document.createTextNode(" "));
	}
	
	container.appendChild(btn);
}

module.exports = {render: render};