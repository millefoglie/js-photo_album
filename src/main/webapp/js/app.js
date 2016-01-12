window.onload = function() {

	var contentloader = require("./contentloader.js");
	var ui = require("./menushelper.js");
	var animation = require("./animation.js");
	var ieHelper = require("./iehelper.js");
	
	var controllers = {};
	"photosList, about, contact, signUp, signIn, signOut, search, upload, photo"
	.split(", ").forEach(function(it) {
		controllers[it + "Controller"] =
		require("./controllers/" + it.toLowerCase() + "controller.js");
	});
	
	var routes = {
		"/about": controllers.aboutController.start,
		"/contact": controllers.contactController.start,
		"/signup": controllers.signUpController.start,
		"/signin": controllers.signInController.start,
		"/signout": controllers.signOutController.start,
		"/upload": controllers.uploadController.start,
		"/search": controllers.searchController.start,
		"/profile": controllers.photosListController.showUsersPhotos,
		"/photos": controllers.photosListController.start,
	};
	
	var router = new Router(routes);

	contentloader.init({containerId: "content"});
	router.init();
	animation.init();

	if (navigator.appVersion.indexOf("MSIE 8") > -1) {
		ieHelper.init();
	}

	animation.slider(document.getElementById("slider"), 7500, 2500);

	ui.authorization.menu().autoupdate();
	ui.album.menu().user().upload().update();
};
