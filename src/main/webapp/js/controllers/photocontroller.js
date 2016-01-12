var photoView = require("../views/photoview.js");
var auth = require("../authorization.js");
var http = require("../http.js");

function start(photoId) {
	var url = "/photos/" + photoId;
	var context = {};

	var content = document.getElementById("content");
	var parent = content.parentNode;

	context.oldContent = parent.removeChild(content);

	parent.appendChild(content.cloneNode(false));

	http.get(url).then(function(result) {
		photoView.render(result).then(function(result) {
			bindEvents(context);
		});
	});
}

function bindEvents(context) {
	var photoPage = document.getElementById("photo-page");

	photoPage.addEventListener(
		"click", handlePhotoPageClick.bind(undefined, context), true);
}

function handlePhotoPageClick(context, evt) {
	var elem = evt.target;
	var content = document.getElementById("content");

	if (elem.id == "go-back") {
		evt.preventDefault();
		content.parentNode.replaceChild(context.oldContent, content);
	}

	if (elem.classList.contains("likes")) {
		evt.preventDefault();
		http.get("/like?photoId=" + elem.dataset.photoId)
		.then(function(result) {
			elem.innerHTML = "♥" + result.likesCount;

				// also update likes on original photos list page
				var i;
				var photosListLikes =
				context.oldContent.getElementsByClassName("likes");

				for (i = 0; i < photosListLikes.length; i++) {
					if (photosListLikes[i].dataset.photoId ==
						elem.dataset.photoId) {
						photosListLikes[i].innerHTML = "♥" + result.likesCount;
				}
			}
		}, function(error) {});
	}
}

module.exports = {start: start};