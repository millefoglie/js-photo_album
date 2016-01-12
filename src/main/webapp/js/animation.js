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