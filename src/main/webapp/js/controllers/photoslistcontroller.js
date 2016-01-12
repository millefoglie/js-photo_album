var photosListView = require("../views/photoslistview.js");
var photoController = require("../controllers/photocontroller.js");
var listenersRegistry = require("../listenersregistry.js");
var auth = require("../authorization.js");
var http = require("../http.js");

function start() {
	showAllPhotos();
}

function showUsersPhotos() {
	var query = {};

	query.author = auth.getUsername();
	query.sort = [{
		key: "addedOn",
		direction: "desc"
	}];
	
	fetchPhotos(query);
}

function showAllPhotos() {
	var query = {};

	query.sort = [{
		key: "addedOn",
		direction: "desc"
	}];
	
	fetchPhotos(query);
}

function fetchPhotos(query) {
	query.page = query.page || 0;
	query.size = query.size || 9;

	var context = {};
	context.query = query;

	var url = encodeURI(makeUrl(query));
	
	http.get(url).then(function(result) {
		photosListView.render(result).then(function() {
			bindEvents(context);
		});
	});
}

function makeUrl(query) {
	var url = "/photos?";
	var chunks = [];
	var filterChunks = [];

	if (query.author || query.title || query.filter) {
		if (query.author) {
			chunks.push("author==" + query.author);
		}

		if (query.title) {
			chunks.push("title==" + query.title);
		}

		if (query.filter) {
			query.filter.forEach(function(it) {
				if (it.key && it.comparison && it.value) {
					filterChunks.push(
						it.key + "=" + it.comparison + "=" + it.value);
				}
			});
		}

		if (filterChunks.length) {
			chunks.push(filterChunks.join(";"));
		}

		if (chunks.length) {
			url += "q=";
			url += chunks.join(";");
			url += "&";
		}
	}

	return url + makeRestParamsString(query);
}

function makeRestParamsString(query) {
	query.page = query.page || 0;
	query.size = query.size || 0;

	var sortChunks = [];
	var sortItem;

	if (query.sort) {
		query.sort.forEach(function(it) {
			if (it.key && it.direction) {
				sortChunks.push(it.key + "," + it.direction);
			}
		});
	}

	var str = "";

	str += "page=" + query.page;
	str += "&size=" + query.size;
	str += (sortChunks.length) ? "&sort=" + sortChunks.join("&") : "";
	
	return str;
}

function bindEvents(context) {
	var photosListWrapper = document.getElementById("photos-list-wrapper");
	var albumMenu = document.getElementById("album-menu");

	photosListWrapper.addEventListener(
		"click", handlePhotosListClick.bind(undefined, context), true);

	albumMenu.addEventListener(
		"click", handleAlbumMenuClick.bind(undefined, context), true);
}

function handlePhotosListClick(context, evt) {
	var elem = evt.target;
	var query;

	if (elem.id == "go-prev") {
		evt.preventDefault();
		query = clone(context.query);
		query.page--;

		fetchPhotos(query);
	}

	if (elem.id == "go-next") {
		evt.preventDefault();
		query = clone(context.query);
		query.page++;

		fetchPhotos(query);
	}

	if (elem.classList.contains("likes")) {
		evt.preventDefault();
		http.get("/like?photoId=" + elem.dataset.photoId).then(function(result) {
			elem.innerHTML = "♥" + result.likesCount;
		}, function(error) {});
	}

	if (elem.tagName == "IMG" && elem.classList.contains("photo")) {
		photoController.start(elem.dataset.photoId);
	}
}

function handleAlbumMenuClick(context, evt) {
	var elem = evt.target;
	var query;

	if (elem.tagName == "A") {
		if (elem.dataset.sortKey) {
			evt.preventDefault();

			query = clone(context.query);
			query.page = 0;

			var sortOption = {};
			sortOption.key = elem.dataset.sortKey;
			sortOption.direction = elem.dataset.sortDir;
			query.sort = [];

			query.sort.push(sortOption);

			fetchPhotos(query);
		}

		if (elem.dataset.filterKey) {
			evt.preventDefault();

			query = clone(context.query);
			query.page = 0;

			var filterOption = {};
			filterOption.key = elem.dataset.filterKey;
			filterOption.comparison = elem.dataset.filterComparison;
			filterOption.value = elem.dataset.filterValue;
			query.filter = [];

			if (filterOption.key) {
				query.filter.push(filterOption);
			}

			fetchPhotos(query);
		}
	}
}

function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

module.exports = {
	start: start,
	showUsersPhotos: showUsersPhotos,
	showAllPhotos: showAllPhotos,
	fetchPhotos: fetchPhotos
};