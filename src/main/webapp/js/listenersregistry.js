var meld = require("./lib/meld.js");

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