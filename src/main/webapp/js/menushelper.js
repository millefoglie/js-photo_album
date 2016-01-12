var auth = require("./authorization.js");

function MenusHelper() {
	this.album = new AlbumMenuHelper();
	this.authorization = new AuthorizationMenuHelper();
}

function AlbumMenuHelper() {
	this.menuContainer = document.getElementById("album-nav");
}

AlbumMenuHelper.prototype.menu = function() {
	this.ul = document.createElement("ul");

	this.ul.setAttribute("id", "album-menu");
	
	return this;
};

AlbumMenuHelper.prototype.user = function() {
	if (auth.getUsername()) {
		this.ul.innerHTML += 
		"<li><a href=\"#/profile\">" + auth.getUsername() + "</a></li>";
	}
	
	return this;
};

AlbumMenuHelper.prototype.upload = function() {
	if (auth.getUsername()) {
		this.ul.innerHTML += "<li><a href=\"#/upload\">Upload</a></li>";
	}

	return this;
};

AlbumMenuHelper.prototype.sort = function() {
	this.ul.innerHTML += "<li><a href=\"#\">Sort</a>" +
						"<ul id=\"sort-submenu\">" +
							"<li><a href=\"#\" data-sort-key=\"title\" " + 
							"data-sort-dir=\"asc\">title asc</a></li>" +
							"<li><a href=\"#\" data-sort-key=\"title\" " +
							"data-sort-dir=\"desc\">title desc</a></li>" +
							"<li><a href=\"#\" data-sort-key=\"addedOn\" " + 
							"data-sort-dir=\"asc\">date added asc</a></li>" +
							"<li><a href=\"#\" data-sort-key=\"addedOn\" " + 
							"data-sort-dir=\"desc\">date added desc</a></li>" +
							"<li><a href=\"#\" data-sort-key=\"likesCount\" " + 
							"data-sort-dir=\"asc\">likes asc</a></li>" +
							"<li><a href=\"#\" data-sort-key=\"likesCount\" " + 
							"data-sort-dir=\"desc\">likes desc</a></li>" +
						"</ul>" +
					"</li>";

	return this;
};

AlbumMenuHelper.prototype.filter = function() {
	this.ul.innerHTML += "<li><a href=\"#\">Filter</a>" +
						"<ul id=\"filter-submenu\">" +
							"<li><a href=\"#\" data-filter-key=\"addedOn\" " + 
							"data-filter-comparison=\"gt\" data-filter-value=\"" +
							moment().startOf("day").valueOf() + "\">today</a></li>" +
							"<li><a href=\"#\" data-filter-key=\"addedOn\" " + 
							"data-filter-comparison=\"gt\" data-filter-value=\"" +
							moment().startOf("day").subtract(1, "days").valueOf() +
							 "\">yesterday</a></li>" +
							"<li><a href=\"#\" data-filter-key=\"addedOn\" " + 
							"data-filter-comparison=\"gt\" data-filter-value=\"" +
							moment().startOf("week").valueOf() + "\">this week</a></li>" +
							"<li><a href=\"#\" data-filter-key=\"addedOn\" " + 
							"data-filter-comparison=\"gt\" data-filter-value=\"" +
							moment().startOf("month").valueOf() + "\">this month</a></li>" +
							"<li><a href=\"#\" data-filter-key=\"addedOn\">all time</a></li>" +
						"</ul>" +
					"</li>";
	return this;
};

AlbumMenuHelper.prototype.update = function() {
	var container = this.menuContainer;
	var oldUl = document.getElementById("album-menu");
	
	oldUl.parentNode.replaceChild(this.ul, oldUl);
};


function AuthorizationMenuHelper() {
	this.menuContainer = document.getElementById("main-nav");
}

AuthorizationMenuHelper.prototype.menu = function() {
	this.ul = document.createElement("ul");
	this.ul.setAttribute("id", "authorization-menu");
	
	return this;
};

AuthorizationMenuHelper.prototype.signUp = function() {
	this.ul.innerHTML += "<li><a href=\"#/signup\">Sign Up</a></li>";
	
	return this;
};

AuthorizationMenuHelper.prototype.signIn = function() {
	this.ul.innerHTML += "<li><a href=\"#/signin\">Sign In</a></li>";
	
	return this;
};

AuthorizationMenuHelper.prototype.signOut = function() {
	this.ul.innerHTML += "<li><a href=\"#/signout\">Sign Out</a></li>";
	
	return this;
};

AuthorizationMenuHelper.prototype.update = function() {
	var container = this.menuContainer;
	var oldUl = container.getElementById("authorization-menu");
	
	container.replaceChild(this.ul, oldUl);
};

AuthorizationMenuHelper.prototype.autoupdate = function() {
	var container = this.menuContainer;
	var oldUl = document.getElementById("authorization-menu");
	
	if (auth.getUsername()) {
		this.signOut();
	} else {
		this.signUp();
		this.signIn();
	}
	
	oldUl.parentNode.replaceChild(this.ul, oldUl);
};

module.exports = new MenusHelper();