/* generated by Svelte v1.42.1 */
(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
	typeof define === "function" && define.amd ? define(factory) :
	(global.Component = factory());
}(this, (function () { "use strict";

	function create_main_fragment(state, component) {
		var div;

		var current_block_type = select_block_type(state);
		var if_block = current_block_type(state, component);

		return {
			c: function create() {
				div = createElement("div");
				if_block.c();
			},

			m: function mount(target, anchor) {
				insertNode(div, target, anchor);
				if_block.m(div, null);
			},

			p: function update(changed, state) {
				if (current_block_type !== (current_block_type = select_block_type(state))) {
					if_block.u();
					if_block.d();
					if_block = current_block_type(state, component);
					if_block.c();
					if_block.m(div, null);
				}
			},

			u: function unmount() {
				detachNode(div);
				if_block.u();
			},

			d: function destroy() {
				if_block.d();
			}
		};
	}

	// (2:4) {{#if foo}}
	function create_if_block(state, component) {
		var div;

		return {
			c: function create() {
				div = createElement("div");
				div.textContent = "foo";
			},

			m: function mount(target, anchor) {
				insertNode(div, target, anchor);
			},

			u: function unmount() {
				detachNode(div);
			},

			d: noop
		};
	}

	// (4:18) 
	function create_if_block_1(state, component) {
		var div;

		return {
			c: function create() {
				div = createElement("div");
				div.textContent = "bar";
			},

			m: function mount(target, anchor) {
				insertNode(div, target, anchor);
			},

			u: function unmount() {
				detachNode(div);
			},

			d: noop
		};
	}

	// (6:4) {{else}}
	function create_if_block_2(state, component) {
		var div;

		return {
			c: function create() {
				div = createElement("div");
				div.textContent = "baz";
			},

			m: function mount(target, anchor) {
				insertNode(div, target, anchor);
			},

			u: function unmount() {
				detachNode(div);
			},

			d: noop
		};
	}

	function select_block_type(state) {
		if (state.foo) return create_if_block;
		if (state.bar) return create_if_block_1;
		return create_if_block_2;
	}

	function Component(options) {
		init(this, options);
		this._state = assign({}, options.data);

		this._fragment = create_main_fragment(this._state, this);

		if (options.target) {
			this._fragment.c();
			this._fragment.m(options.target, options.anchor || null);
		}
	}

	assign(Component.prototype, {
	 	destroy: destroy,
	 	get: get,
	 	fire: fire,
	 	observe: observe,
	 	on: on,
	 	set: set,
	 	teardown: destroy,
	 	_set: _set,
	 	_mount: _mount,
	 	_unmount: _unmount
	 });

	Component.prototype._recompute = noop;

	function createElement(name) {
		return document.createElement(name);
	}

	function insertNode(node, target, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function noop() {}

	function init(component, options) {
		component.options = options;

		component._observers = { pre: blankObject(), post: blankObject() };
		component._handlers = blankObject();
		component._root = options._root || component;
		component._bind = options._bind;
	}

	function assign(target) {
		var k,
			source,
			i = 1,
			len = arguments.length;
		for (; i < len; i++) {
			source = arguments[i];
			for (k in source) target[k] = source[k];
		}

		return target;
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = this.get = noop;

		if (detach !== false) this._fragment.u();
		this._fragment.d();
		this._fragment = this._state = null;
	}

	function get(key) {
		return key ? this._state[key] : this._state;
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			handlers[i].call(this, data);
		}
	}

	function observe(key, callback, options) {
		var group = options && options.defer
			? this._observers.post
			: this._observers.pre;

		(group[key] || (group[key] = [])).push(callback);

		if (!options || options.init !== false) {
			callback.__calling = true;
			callback.call(this, this._state[key]);
			callback.__calling = false;
		}

		return {
			cancel: function() {
				var index = group[key].indexOf(callback);
				if (~index) group[key].splice(index, 1);
			}
		};
	}

	function on(eventName, handler) {
		if (eventName === 'teardown') return this.on('destroy', handler);

		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this._root._lock) return;
		this._root._lock = true;
		callAll(this._root._beforecreate);
		callAll(this._root._oncreate);
		callAll(this._root._aftercreate);
		this._root._lock = false;
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		for (var key in newState) {
			if (differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign({}, oldState, newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			dispatchObservers(this, this._observers.pre, changed, this._state, oldState);
			this._fragment.p(changed, this._state);
			dispatchObservers(this, this._observers.post, changed, this._state, oldState);
		}
	}

	function _mount(target, anchor) {
		this._fragment.m(target, anchor);
	}

	function _unmount() {
		this._fragment.u();
	}

	function blankObject() {
		return Object.create(null);
	}

	function callAll(fns) {
		while (fns && fns.length) fns.pop()();
	}

	function differs(a, b) {
		return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function dispatchObservers(component, group, changed, newState, oldState) {
		for (var key in group) {
			if (!changed[key]) continue;

			var newValue = newState[key];
			var oldValue = oldState[key];

			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}

	return Component;

})));