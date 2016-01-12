/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	window.onload = function() {
	
		var contentloader = __webpack_require__(1);
		var ui = __webpack_require__(6);
		var animation = __webpack_require__(4);
		var ieHelper = __webpack_require__(7);
		
		var controllers = {};
		"photosList, about, contact, signUp, signIn, signOut, search, upload, photo"
		.split(", ").forEach(function(it) {
			controllers[it + "Controller"] =
			__webpack_require__(10)("./" + it.toLowerCase() + "controller.js");
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var http = __webpack_require__(2);
	var auth = __webpack_require__(5);
	var modals = __webpack_require__(3);
	var animation = __webpack_require__(4);
	
	function ContentLoader() {}
	
	ContentLoader.prototype.init = function(options) {
		if (!options) {
			return;
		}
		
		this.containerId = options.containerId;
		this.path = options.path || "./html/";
		this.extention = options.extention || ".html";
	};
	
	ContentLoader.prototype.render = function(page) {
		var self = this;
	
		return new Promise(function(resolve, reject) {
			var xhr = new moxie.xhr.XMLHttpRequest();
			var url = self.path + page + self.extention;
	
			xhr.open("GET", url, true);
			xhr.timeout = 10000;
			
			xhr.onreadystatechange = function() {
				var container = document.getElementById(self.containerId);
	
				if (xhr.readyState == 4) {
					if (parseInt(xhr.status / 100) == 2) {
						animation.fadeOut(container, 200);
						container.innerHTML = xhr.response;
						animation.fadeIn(container, 200);
						resolve(xhr.response);
					} else {
						modals.showError(xhr.response);
						reject(xhr.response);
					}
				}
			};
	
			xhr.ontimeout = function() {
				modals.showError("Could not load page.");
				xhr.abort();
			};
			
			xhr.send();
		});
	};
	
	module.exports = new ContentLoader();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var modals = __webpack_require__(3);
	
	function Http() {}
	
	Http.prototype.get = function(url, requestBody, headers) {
		return this.performRequest("GET", url, requestBody, headers);
	};
	
	Http.prototype.post = function(url, requestBody, headers) {
		return this.performRequest("POST", url, requestBody, headers);
	};
	
	Http.prototype.performRequest = function(method, url, requestBody, headers) {
		var self = this;
		
		return new Promise(function(resolve, reject) {
			var xhr = new moxie.xhr.XMLHttpRequest();
			var result;
	
			xhr.open(method, url, true);
			
			for (var h in headers) {
				xhr.setRequestHeader(h, headers[h]);
			}
	
			xhr.timeout = 10000;
			
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (parseInt(xhr.status / 100) == 2) {
						try {
							result = JSON.parse(xhr.response);
						} catch (e) {
							result = xhr.response;
						}
	
						resolve(result);
					} else {
						modals.showError(xhr.response);
						reject(xhr.response);
					}
				}
			};
	
			xhr.ontimeout = function() {
				modals.showError("Could not receive response from the server.");
				xhr.abort();
			};
			
			xhr.send(requestBody);
		});
	};
	
	module.exports = new Http();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var animation = __webpack_require__(4);
	
	function ModalsHelper() {}
	
	ModalsHelper.prototype.showInfo = function(html, delay) {
		showModal(html, delay, "info");
	};
	
	ModalsHelper.prototype.showError = function(html, delay) {
		showModal(html, delay, "error");
	};
	
	function showModal(html, delay, clazz) {
		delay = delay || 4000;
	
		var modal = document.createElement("div");
	
		modal.classList.add(clazz);
		modal.innerHTML = html;
	
		document.body.appendChild(modal);
	
		animation.fadeIn(modal, 150);
	
		setTimeout(function() {
			animation.fadeOut(modal, 150);
			document.body.removeChild(modal);
		}, delay);
	}
	
	module.exports = new ModalsHelper();

/***/ },
/* 4 */
/***/ function(module, exports) {

	function Animation() {
		this.fps = 50;
	}
	
	Animation.prototype.init = function(options){
		if (!options) {
			return;
		}
	
		this.fps = options.fps || 50;
	};
	
	Animation.prototype.slider = function(container, frameDuration, fadeDuration) {
		var self = this;
		var images = container.getElementsByTagName("img");
		var idx;
	
		for (idx = 0; idx < images.length; idx++) {
			images[idx].style.opacity = 0;
		}
	
		idx = 0;
		images[idx].style.opacity = 1;
	
		setInterval(function() {
			self.fadeOut(images[idx], fadeDuration);
			idx = ++idx % images.length;
			self.fadeIn(images[idx], fadeDuration);
		}, frameDuration);
	};
	
	Animation.prototype.fadeIn = function(elem, duration) {
		if (supportsTransitions()) {
			elem.style.opacity = 1;
			elem.style.transition = 'opacity ' + duration / 1000 + 's linear';
			window.getComputedStyle(elem);
			return;
		}
	
		if (!!window.jQuery) {
			$(elem).fadeIn(duration);
			return;
		}
	
		var timePassed = 0;
		var timeStep = 1000 / this.fps;
		var step = timeStep / duration;
		var opacity = 0;
	
		elem.style.opacity = 0;
	
		var interval = setInterval(function() {
			timePassed += timeStep;
	
			// XXX: wtf js: doesn't work without counter
			opacity += step;
			elem.style.opacity = opacity;
			elem.style.opacity = Math.min(elem.style.opacity, 1);
	
			if (timePassed >= duration) {
				clearInterval(interval);
			}
		}, timeStep);
	};
	
	Animation.prototype.fadeOut = function(elem, duration) {
		if (supportsTransitions()) {
			elem.style.opacity = 0;
			elem.style.transition = 'opacity ' + duration / 1000 + 's linear';
			window.getComputedStyle(elem);
			return;
		}
	
		if (!!window.jQuery) {
			$(elem).fadeOut(duration);
			return;
		}
	
		var timePassed = 0;
		var timeStep = 1000 / this.fps;
		var step = timeStep / duration;
	
		elem.style.opacity = 1;
	
		var interval = setInterval(function() {
			timePassed += timeStep;
	
			elem.style.opacity -= step;
			elem.style.opacity = Math.max(elem.style.opacity, 0);
	
			if (timePassed >= duration) {
				clearInterval(interval);
			}
		}, timeStep);
	};
	
	function supportsTransitions() {
	    var b = document.body || document.documentElement,
	        s = b.style,
	        p = 'transition';
	
	    if (typeof s[p] == 'string') { return true; }
	
	    // Tests for vendor specific prop
	    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
	    p = p.charAt(0).toUpperCase() + p.substr(1);
	
	    for (var i=0; i<v.length; i++) {
	        if (typeof s[v[i] + p] == 'string') { return true; }
	    }
	
	    return false;
	}
	
	module.exports = new Animation();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var http = __webpack_require__(2);
	
	function Authorization() {}
	
	Authorization.prototype.signIn = function(username, password) {
		var requestBody = "username=" + username + "&password=" + password;
		var headers = {"Content-Type": "application/x-www-form-urlencoded"};
		
		return http.post("/signin", requestBody, headers).then(function() {
			sessionStorage.setItem("username", username);
		});
	};
	
	Authorization.prototype.signUp = function(username, password) {
		var headers = {"Content-Type": "application/x-www-form-urlencoded"};
		var requestBody = "username=" + username + "&password=" + password;
		requestBody = encodeURI(requestBody);
	
		return http.post("/signup", requestBody, headers).then(function() {
			http.post("/signin", requestBody, headers);
		}).then(function() {
			sessionStorage.setItem("username", username);
		});
	};
	
	Authorization.prototype.signOut = function() {
		var self = this;
		
		return http.get("/signout").then(function() {
			sessionStorage.removeItem("username");
		});
	};
	
	Authorization.prototype.getUsername = function() {
		return sessionStorage.getItem("username");
	};
	
	module.exports = new Authorization();

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var auth = __webpack_require__(5);
	
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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var meld = __webpack_require__(8);
	
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2011-2013 original author or authors */
	
	/**
	 * meld
	 * Aspect Oriented Programming for Javascript
	 *
	 * meld is part of the cujo.js family of libraries (http://cujojs.com/)
	 *
	 * Licensed under the MIT License at:
	 * http://www.opensource.org/licenses/mit-license.php
	 *
	 * @author Brian Cavalier
	 * @author John Hann
	 * @version 1.3.1
	 */
	(function (define) {
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	
		//
		// Public API
		//
	
		// Add a single, specific type of advice
		// returns a function that will remove the newly-added advice
		meld.before =         adviceApi('before');
		meld.around =         adviceApi('around');
		meld.on =             adviceApi('on');
		meld.afterReturning = adviceApi('afterReturning');
		meld.afterThrowing =  adviceApi('afterThrowing');
		meld.after =          adviceApi('after');
	
		// Access to the current joinpoint in advices
		meld.joinpoint =      joinpoint;
	
		// DEPRECATED: meld.add(). Use meld() instead
		// Returns a function that will remove the newly-added aspect
		meld.add =            function() { return meld.apply(null, arguments); };
	
		/**
		 * Add an aspect to all matching methods of target, or to target itself if
		 * target is a function and no pointcut is provided.
		 * @param {object|function} target
		 * @param {string|array|RegExp|function} [pointcut]
		 * @param {object} aspect
		 * @param {function?} aspect.before
		 * @param {function?} aspect.on
		 * @param {function?} aspect.around
		 * @param {function?} aspect.afterReturning
		 * @param {function?} aspect.afterThrowing
		 * @param {function?} aspect.after
		 * @returns {{ remove: function }|function} if target is an object, returns a
		 *  remover { remove: function } whose remove method will remove the added
		 *  aspect. If target is a function, returns the newly advised function.
		 */
		function meld(target, pointcut, aspect) {
			var pointcutType, remove;
	
			if(arguments.length < 3) {
				return addAspectToFunction(target, pointcut);
			} else {
				if (isArray(pointcut)) {
					remove = addAspectToAll(target, pointcut, aspect);
				} else {
					pointcutType = typeof pointcut;
	
					if (pointcutType === 'string') {
						if (typeof target[pointcut] === 'function') {
							remove = addAspectToMethod(target, pointcut, aspect);
						}
	
					} else if (pointcutType === 'function') {
						remove = addAspectToAll(target, pointcut(target), aspect);
	
					} else {
						remove = addAspectToMatches(target, pointcut, aspect);
					}
				}
	
				return remove;
			}
	
		}
	
		function Advisor(target, func) {
	
			var orig, advisor, advised;
	
			this.target = target;
			this.func = func;
			this.aspects = {};
	
			orig = this.orig = target[func];
			advisor = this;
	
			advised = this.advised = function() {
				var context, joinpoint, args, callOrig, afterType;
	
				// If called as a constructor (i.e. using "new"), create a context
				// of the correct type, so that all advice types (including before!)
				// are called with the correct context.
				if(this instanceof advised) {
					// shamelessly derived from https://github.com/cujojs/wire/blob/c7c55fe50238ecb4afbb35f902058ab6b32beb8f/lib/component.js#L25
					context = objectCreate(orig.prototype);
					callOrig = function (args) {
						return applyConstructor(orig, context, args);
					};
	
				} else {
					context = this;
					callOrig = function(args) {
						return orig.apply(context, args);
					};
	
				}
	
				args = slice.call(arguments);
				afterType = 'afterReturning';
	
				// Save the previous joinpoint and set the current joinpoint
				joinpoint = pushJoinpoint({
					target: context,
					method: func,
					args: args
				});
	
				try {
					advisor._callSimpleAdvice('before', context, args);
	
					try {
						joinpoint.result = advisor._callAroundAdvice(context, func, args, callOrigAndOn);
					} catch(e) {
						joinpoint.result = joinpoint.exception = e;
						// Switch to afterThrowing
						afterType = 'afterThrowing';
					}
	
					args = [joinpoint.result];
	
					callAfter(afterType, args);
					callAfter('after', args);
	
					if(joinpoint.exception) {
						throw joinpoint.exception;
					}
	
					return joinpoint.result;
	
				} finally {
					// Restore the previous joinpoint, if necessary.
					popJoinpoint();
				}
	
				function callOrigAndOn(args) {
					var result = callOrig(args);
					advisor._callSimpleAdvice('on', context, args);
	
					return result;
				}
	
				function callAfter(afterType, args) {
					advisor._callSimpleAdvice(afterType, context, args);
				}
			};
	
			defineProperty(advised, '_advisor', { value: advisor, configurable: true });
		}
	
		Advisor.prototype = {
	
			/**
			 * Invoke all advice functions in the supplied context, with the supplied args
			 *
			 * @param adviceType
			 * @param context
			 * @param args
			 */
			_callSimpleAdvice: function(adviceType, context, args) {
	
				// before advice runs LIFO, from most-recently added to least-recently added.
				// All other advice is FIFO
				var iterator, advices;
	
				advices = this.aspects[adviceType];
				if(!advices) {
					return;
				}
	
				iterator = iterators[adviceType];
	
				iterator(this.aspects[adviceType], function(aspect) {
					var advice = aspect.advice;
					advice && advice.apply(context, args);
				});
			},
	
			/**
			 * Invoke all around advice and then the original method
			 *
			 * @param context
			 * @param method
			 * @param args
			 * @param applyOriginal
			 */
			_callAroundAdvice: function (context, method, args, applyOriginal) {
				var len, aspects;
	
				aspects = this.aspects.around;
				len = aspects ? aspects.length : 0;
	
				/**
				 * Call the next function in the around chain, which will either be another around
				 * advice, or the orig method.
				 * @param i {Number} index of the around advice
				 * @param args {Array} arguments with with to call the next around advice
				 */
				function callNext(i, args) {
					// If we exhausted all aspects, finally call the original
					// Otherwise, if we found another around, call it
					return i < 0
						? applyOriginal(args)
						: callAround(aspects[i].advice, i, args);
				}
	
				function callAround(around, i, args) {
					var proceedCalled, joinpoint;
	
					proceedCalled = 0;
	
					// Joinpoint is immutable
					// TODO: Use Object.freeze once v8 perf problem is fixed
					joinpoint = pushJoinpoint({
						target: context,
						method: method,
						args: args,
						proceed: proceedCall,
						proceedApply: proceedApply,
						proceedCount: proceedCount
					});
	
					try {
						// Call supplied around advice function
						return around.call(context, joinpoint);
					} finally {
						popJoinpoint();
					}
	
					/**
					 * The number of times proceed() has been called
					 * @return {Number}
					 */
					function proceedCount() {
						return proceedCalled;
					}
	
					/**
					 * Proceed to the original method/function or the next around
					 * advice using original arguments or new argument list if
					 * arguments.length > 0
					 * @return {*} result of original method/function or next around advice
					 */
					function proceedCall(/* newArg1, newArg2... */) {
						return proceed(arguments.length > 0 ? slice.call(arguments) : args);
					}
	
					/**
					 * Proceed to the original method/function or the next around
					 * advice using original arguments or new argument list if
					 * newArgs is supplied
					 * @param [newArgs] {Array} new arguments with which to proceed
					 * @return {*} result of original method/function or next around advice
					 */
					function proceedApply(newArgs) {
						return proceed(newArgs || args);
					}
	
					/**
					 * Create proceed function that calls the next around advice, or
					 * the original.  May be called multiple times, for example, in retry
					 * scenarios
					 * @param [args] {Array} optional arguments to use instead of the
					 * original arguments
					 */
					function proceed(args) {
						proceedCalled++;
						return callNext(i - 1, args);
					}
	
				}
	
				return callNext(len - 1, args);
			},
	
			/**
			 * Adds the supplied aspect to the advised target method
			 *
			 * @param aspect
			 */
			add: function(aspect) {
	
				var advisor, aspects;
	
				advisor = this;
				aspects = advisor.aspects;
	
				insertAspect(aspects, aspect);
	
				return {
					remove: function () {
						var remaining = removeAspect(aspects, aspect);
	
						// If there are no aspects left, restore the original method
						if (!remaining) {
							advisor.remove();
						}
					}
				};
			},
	
			/**
			 * Removes the Advisor and thus, all aspects from the advised target method, and
			 * restores the original target method, copying back all properties that may have
			 * been added or updated on the advised function.
			 */
			remove: function () {
				delete this.advised._advisor;
				this.target[this.func] = this.orig;
			}
		};
	
		/**
		 * Returns the advisor for the target object-function pair.  A new advisor
		 * will be created if one does not already exist.
		 * @param target {*} target containing a method with the supplied methodName
		 * @param methodName {String} name of method on target for which to get an advisor
		 * @return {Object|undefined} existing or newly created advisor for the supplied method
		 */
		Advisor.get = function(target, methodName) {
			if(!(methodName in target)) {
				return;
			}
	
			var advisor, advised;
	
			advised = target[methodName];
	
			if(typeof advised !== 'function') {
				throw new Error('Advice can only be applied to functions: ' + methodName);
			}
	
			advisor = advised._advisor;
			if(!advisor) {
				advisor = new Advisor(target, methodName);
				target[methodName] = advisor.advised;
			}
	
			return advisor;
		};
	
		/**
		 * Add an aspect to a pure function, returning an advised version of it.
		 * NOTE: *only the returned function* is advised.  The original (input) function
		 * is not modified in any way.
		 * @param func {Function} function to advise
		 * @param aspect {Object} aspect to add
		 * @return {Function} advised function
		 */
		function addAspectToFunction(func, aspect) {
			var name, placeholderTarget;
	
			name = func.name || '_';
	
			placeholderTarget = {};
			placeholderTarget[name] = func;
	
			addAspectToMethod(placeholderTarget, name, aspect);
	
			return placeholderTarget[name];
	
		}
	
		function addAspectToMethod(target, method, aspect) {
			var advisor = Advisor.get(target, method);
	
			return advisor && advisor.add(aspect);
		}
	
		function addAspectToAll(target, methodArray, aspect) {
			var removers, added, f, i;
	
			removers = [];
			i = 0;
	
			while((f = methodArray[i++])) {
				added = addAspectToMethod(target, f, aspect);
				added && removers.push(added);
			}
	
			return createRemover(removers);
		}
	
		function addAspectToMatches(target, pointcut, aspect) {
			var removers = [];
			// Assume the pointcut is a an object with a .test() method
			for (var p in target) {
				// TODO: Decide whether hasOwnProperty is correct here
				// Only apply to own properties that are functions, and match the pointcut regexp
				if (typeof target[p] == 'function' && pointcut.test(p)) {
					// if(object.hasOwnProperty(p) && typeof object[p] === 'function' && pointcut.test(p)) {
					removers.push(addAspectToMethod(target, p, aspect));
				}
			}
	
			return createRemover(removers);
		}
	
		function createRemover(removers) {
			return {
				remove: function() {
					for (var i = removers.length - 1; i >= 0; --i) {
						removers[i].remove();
					}
				}
			};
		}
	
		// Create an API function for the specified advice type
		function adviceApi(type) {
			return function(target, method, adviceFunc) {
				var aspect = {};
	
				if(arguments.length === 2) {
					aspect[type] = method;
					return meld(target, aspect);
				} else {
					aspect[type] = adviceFunc;
					return meld(target, method, aspect);
				}
			};
		}
	
		/**
		 * Insert the supplied aspect into aspectList
		 * @param aspectList {Object} list of aspects, categorized by advice type
		 * @param aspect {Object} aspect containing one or more supported advice types
		 */
		function insertAspect(aspectList, aspect) {
			var adviceType, advice, advices;
	
			for(adviceType in iterators) {
				advice = aspect[adviceType];
	
				if(advice) {
					advices = aspectList[adviceType];
					if(!advices) {
						aspectList[adviceType] = advices = [];
					}
	
					advices.push({
						aspect: aspect,
						advice: advice
					});
				}
			}
		}
	
		/**
		 * Remove the supplied aspect from aspectList
		 * @param aspectList {Object} list of aspects, categorized by advice type
		 * @param aspect {Object} aspect containing one or more supported advice types
		 * @return {Number} Number of *advices* left on the advised function.  If
		 *  this returns zero, then it is safe to remove the advisor completely.
		 */
		function removeAspect(aspectList, aspect) {
			var adviceType, advices, remaining;
	
			remaining = 0;
	
			for(adviceType in iterators) {
				advices = aspectList[adviceType];
				if(advices) {
					remaining += advices.length;
	
					for (var i = advices.length - 1; i >= 0; --i) {
						if (advices[i].aspect === aspect) {
							advices.splice(i, 1);
							--remaining;
							break;
						}
					}
				}
			}
	
			return remaining;
		}
	
		function applyConstructor(C, instance, args) {
			try {
				// Try to define a constructor, but don't care if it fails
				defineProperty(instance, 'constructor', {
					value: C,
					enumerable: false
				});
			} catch(e) {
				// ignore
			}
	
			C.apply(instance, args);
	
			return instance;
		}
	
		var currentJoinpoint, joinpointStack,
			ap, prepend, append, iterators, slice, isArray, defineProperty, objectCreate;
	
		// TOOD: Freeze joinpoints when v8 perf problems are resolved
	//	freeze = Object.freeze || function (o) { return o; };
	
		joinpointStack = [];
	
		ap      = Array.prototype;
		prepend = ap.unshift;
		append  = ap.push;
		slice   = ap.slice;
	
		isArray = Array.isArray || function(it) {
			return Object.prototype.toString.call(it) == '[object Array]';
		};
	
		// Check for a *working* Object.defineProperty, fallback to
		// simple assignment.
		defineProperty = definePropertyWorks()
			? Object.defineProperty
			: function(obj, prop, descriptor) {
			obj[prop] = descriptor.value;
		};
	
		objectCreate = Object.create ||
			(function() {
				function F() {}
				return function(proto) {
					F.prototype = proto;
					var instance = new F();
					F.prototype = null;
					return instance;
				};
			}());
	
		iterators = {
			// Before uses reverse iteration
			before: forEachReverse,
			around: false
		};
	
		// All other advice types use forward iteration
		// Around is a special case that uses recursion rather than
		// iteration.  See Advisor._callAroundAdvice
		iterators.on
			= iterators.afterReturning
			= iterators.afterThrowing
			= iterators.after
			= forEach;
	
		function forEach(array, func) {
			for (var i = 0, len = array.length; i < len; i++) {
				func(array[i]);
			}
		}
	
		function forEachReverse(array, func) {
			for (var i = array.length - 1; i >= 0; --i) {
				func(array[i]);
			}
		}
	
		function joinpoint() {
			return currentJoinpoint;
		}
	
		function pushJoinpoint(newJoinpoint) {
			joinpointStack.push(currentJoinpoint);
			return currentJoinpoint = newJoinpoint;
		}
	
		function popJoinpoint() {
			return currentJoinpoint = joinpointStack.pop();
		}
	
		function definePropertyWorks() {
			try {
				return 'x' in Object.defineProperty({}, 'x', {});
			} catch (e) { /* return falsey */ }
		}
	
		return meld;
	
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(__webpack_require__(9)
	);


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./aboutcontroller.js": 11,
		"./contactcontroller.js": 13,
		"./photocontroller.js": 15,
		"./photoslistcontroller.js": 17,
		"./searchcontroller.js": 20,
		"./signincontroller.js": 22,
		"./signoutcontroller.js": 24,
		"./signupcontroller.js": 25,
		"./uploadcontroller.js": 27
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 10;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var aboutView = __webpack_require__(12);
	
	function start() {
		aboutView.render();
	}
	
	module.exports = {start: start};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var contentLoader = __webpack_require__(1);
	var ui = __webpack_require__(6);
	
	function render(model) {
		return contentLoader.render("about").then(function(result) {
			ui.authorization.menu().autoupdate();
			ui.album.menu().user().upload().update();
		});
	}
	
	module.exports = {render: render};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var contactView = __webpack_require__(14);
	
	function start() {
		contactView.render();
	}
	
	module.exports = {start: start};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var contentLoader = __webpack_require__(1);
	var ui = __webpack_require__(6);
	
	function render(model) {
		return contentLoader.render("contact").then(function(result) {
			ui.authorization.menu().autoupdate();
			ui.album.menu().user().upload().update();
		});
	}
	
	module.exports = {render: render};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var photoView = __webpack_require__(16);
	var auth = __webpack_require__(5);
	var http = __webpack_require__(2);
	
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

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var contentLoader = __webpack_require__(1);
	var ui = __webpack_require__(6);
	
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

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var photosListView = __webpack_require__(18);
	var photoController = __webpack_require__(15);
	var listenersRegistry = __webpack_require__(19);
	var auth = __webpack_require__(5);
	var http = __webpack_require__(2);
	
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

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var contentLoader = __webpack_require__(1);
	var ui = __webpack_require__(6);
	
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

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var meld = __webpack_require__(8);
	
	var listenersRegistry = {};
	
	listenersRegistry.registry = {};
	
	listenersRegistry.init = function() {
		var registry = this.registry;
	
		EventTarget.prototype.addEventListener =
		meld.around(EventTarget.prototype.addEventListener, function() {
			var joinpoint = meld.joinpoint();
	
			var obj = joinpoint.target;
			var eventType = joinpoint.args[0];
			var listener = joinpoint.args[1];
	
			registry[obj] = registry[obj] || {};
			registry[obj][eventType] = registry[obj][eventType] || [];
	
			if (registry[obj][eventType].indexOf(listener) < 0) {
				registry[obj][eventType].push(listener);
			}
	
			joinpoint.proceed();
		});
	};
	
	listenersRegistry.removeListeners = function(obj, eventType) {
		var registry = this.registry;
	
		if (!registry[obj]) {
			return;
		}
	
		if (eventType) {
			clearListenersForType(eventType);
		} else {
			for (var type in registry[obj]) {
				clearListenersForType(type);
			}
		}
	
		function clearListenersForType(type) {
			for (var lis in registry[obj][type]) {
				obj.removeEventListener(type, lis);
			}
	
			registry[obj][type] = [];
		}
	};
	
	listenersRegistry.getListeners = function(obj, eventType) {
		return this.registry[obj][eventType];
	};
	
	module.exports = listenersRegistry;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var searchView = __webpack_require__(21);
	var photosListController = __webpack_require__(17);
	
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

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var contentLoader = __webpack_require__(1);
	var ui = __webpack_require__(6);
	
	function render(model) {
		return contentLoader.render("search").then(function(result) {
			ui.authorization.menu().autoupdate();
			ui.album.menu().user().upload().update();
		});
	}
	
	module.exports = {render: render};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var signInView = __webpack_require__(23);
	var auth = __webpack_require__(5);
	var modals = __webpack_require__(3);
	
	function start() {
		signInView.render().then(function(result) {
			bindEvents();
		});
	}
	
	function bindEvents() {
		var form = document.getElementById("signin");
		
		form.addEventListener('submit', handleSubmit.bind(undefined, form), true);
	}
	
	function handleSubmit(form, evt) {
		evt.preventDefault();
	
		if (validate(form)) {
			auth.signIn(form.username.value, form.password.value)
			.then(
				function onFulfilled(result) {
					window.location.href = "#/photos";
				},
				function onRejected(error) {
					ui.showError(error);
				}	
			);
		}
	}
	
	function validate(form) {
		var u = form.username;
		var p = form.password;
		
		if (!u.value) {
			showError("Username field is empty.");
			return false;
		}
		
		if (!p.value) {
			showError("Password field is empty.");
			return false;
		}
		
		return true;
	}
	
	function showError(msg) {
		if (typeof HTMLFormElement.prototype.checkValidity != 'function') {
			modals.showError(msg);
		}
	}
	
	module.exports = {start: start};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var contentLoader = __webpack_require__(1);
	var ui = __webpack_require__(6);
	
	function render(model) {
		return contentLoader.render("signin").then(function(result) {
			ui.authorization.menu().autoupdate();
			ui.album.menu().update();
		});
	}
	
	module.exports = {render: render};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var auth = __webpack_require__(5);
	
	function start() {
		auth.signOut().then(function() {
			window.location.href = "#/photos";
		});
	}
	
	module.exports = {start: start};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var signUpView = __webpack_require__(26);
	var auth = __webpack_require__(5);
	var modals = __webpack_require__(3);
	
	function start() {
		signUpView.render().then(function(result) {
			bindEvents();
		});
	}
	
	function bindEvents() {
		var form = document.getElementById("signup");
		
		form.addEventListener("submit", handleSubmit.bind(undefined, form), true);
	}
	
	function handleSubmit(form, evt) {
		evt.preventDefault();
	
		if (validate(form)) {
			auth.signUp(form.username.value, form.password.value)
			.then(function() {
				window.location.href = "#/photos";
			});
		}
	}
	
	function validate(form) {
		var u = form.username;
		var p = form.password;
		var pr = form["password-repeat"];
	
		if (!u.value) {
			showError("Username field is empty.");
			return false;
		}
	
		if (!p.value) {
			showError("Password field is empty.");
			return false;
		}
	
		if (p.value.length < 4) {
			modals.showError("Password should be at least 4 chararcters long.");
			return false;
		}
	
		if (p.value != pr.value) {
			modals.showError("Passwords do not match.");
			return false;
		}
	
		return true;
	}
	
	function showError(msg) {
		if (typeof HTMLFormElement.prototype.checkValidity != 'function') {
			modals.showError(msg);
		}
	}
	
	module.exports = {start: start};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var contentLoader = __webpack_require__(1);
	var ui = __webpack_require__(6);
	
	function render(model) {
		return contentLoader.render("signup").then(function(result) {
			ui.authorization.menu().autoupdate();
			ui.album.menu().update();
		});
	}
	
	module.exports = {render: render};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var uploadView = __webpack_require__(28);
	var contentLoader = __webpack_require__(1);
	var modals = __webpack_require__(3);
	
	function start() {
		uploadView.render().then(function() {
			bindEvents();
		});
	}
	
	function bindEvents() {
		var form = document.getElementById("upload");
		var dropbox = document.getElementById("dropbox");
		var iframe = document.getElementById("upload-iframe");
		var dropboxSpan = dropbox.getElementsByTagName("span")[0];
		var originalDropboxText = dropboxSpan.innerHTML;
	
		var formOpts = {descriptionEntered: false};
	
		form.target = "upload-iframe";
	
		form.addEventListener("change", 
			handleFormChange.bind(
				undefined, form, formOpts, dropboxSpan), true);
	
		form.addEventListener("focus", 
			handleFormFocus.bind(
				undefined, form, formOpts), true);
	
		form.addEventListener("submit", 
			handleSubmit.bind(undefined, form), true);
	
		iframe.addEventListener("load", 
			handleIFrameLoad.bind(
				undefined, form, dropboxSpan, originalDropboxText), true);
	}
	
	function handleFormChange(form, formOpts, dropboxSpan, evt) {
		var input = evt.target;
	
		if (input == form.description) {
			if (!input.value && formOpts.descriptionEntered) {
				input.value = "Description";
				formOpts.descriptionEntered = false;
			}
		}
	
		if (input == form.fileselect) {
			var files = input.files;
	
			// for IE
			if (!files) {
				files = [];            
				files.push({
					name: input.value.substring(input.value.lastIndexOf("\\") + 1),
					size: 0,
					type: input.value.substring(input.value.lastIndexOf(".") + 1)
				});
	
				input.files = files;
			}
	
			showFileInfo(dropboxSpan, files[0]);
		}
	}
	
	function handleFormFocus(form, formOpts, evt) {
		var input = evt.target;
	
		if (input == form.description) {
			if (!formOpts.descriptionEntered) {
				input.value = "";
				formOpts.descriptionEntered = true;
			}
		}
	}
	
	
	function showFileInfo(dropboxSpan, file) {
		var text = file.name;
		text += file.size ? " (" + (file.size / (1024 * 1024)).toFixed(2) + " MB)" : "";
	
		dropboxSpan.innerHTML = text;
	}
	
	function handleSubmit(form, evt) {
		if (!validate(form)) { 
			evt.preventDefault();
			return; 
		}
	}
	
	function handleIFrameLoad(form, dropboxSpan, originalDropboxText, formOpts, evt) {
		if (form.fileselect.files[0]) {
			modals.showInfo("File uploaded", 2000);
		}
	
		form.reset();
		formOpts.descriptionEntered = false;
	
		dropboxSpan.innerHTML = originalDropboxText;
	}
	
	function validate(form) {
		var file = form.fileselect.files[0];
		var errorContainer = form.getElementsByClassName("form-heading")[0];
		
		if (file.size > 5 * 1024 * 1024) {
			modals.showError("File size cannot be greater than 5 MB.");
			return;
		}
		
		if (!file.type.match(/(^image\/|jpg|jpeg|png|bmp|gif)/)) {
			modals.showError("Only image files are accepted.");
			return false;
		}
		
		return true;
	}
	
	module.exports = {start: start};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var contentLoader = __webpack_require__(1);
	var ui = __webpack_require__(6);
	
	function render(model) {
		return contentLoader.render("upload").then(function(result) {
			ui.authorization.menu().autoupdate();
			ui.album.menu().user().upload().update();
		});
	}
	
	module.exports = {render: render};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map