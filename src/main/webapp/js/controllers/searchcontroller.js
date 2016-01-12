var searchView = require("../views/searchview.js");
var photosListController = require("../controllers/photoslistcontroller.js");

function start() {
	searchView.render().then(function(result) {
		bindEvents();
	});
}

function bindEvents() {
	var form = document.getElementById("search");
	
	form.addEventListener('submit', handleSubmit.bind(undefined, form), true);
}

function handleSubmit(form, evt) {
	evt.preventDefault();
	
	var query = {};
	
	query.author = form.author.value;
	query.title = form.title.value;
	
	photosListController.fetchPhotos(query);
}

module.exports = {start: start};