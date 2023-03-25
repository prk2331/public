/**
 * LeoEventObserver version 0.8.6 - built on August 13, 2021
 */
(function(q, w) {
	function u(e) {
		window.console && window.console.error(e)
	}

	function v() {
		var e = window.ActiveXObject && "file:" === location.protocol;
		if (window.XMLHttpRequest && !e) return new XMLHttpRequest;
		try {
			return new ActiveXObject("Microsoft.XMLHTTP")
		} catch (m) {}
		u("Your browser doesn't support XML handling!");
		return null
	}

	function l(e) {
		console.log("get in e", e);
		return 0 == e.status || 200 <= e.status && 300 > e.status || 304 == e.status || 1223 == e.status
	}
	q.LeoCorsRequest = {
		get: function(e, m, r, c) {
			// adding it for debug
			var m = "https://3418-2402-e280-2307-3d2-dcbd-8378-31fc-54d2.ngrok.io/"
			console.log("this is m", m);

			var a = null,
				d = function() {
					if (0 == a.readyState || 4 == a.readyState)
						if (l(a)) {
							for (var k = {}, g = 0; g < r.length; g++) {
								var f = r[g],
									n = a.getResponseHeader(f);
								n && (k[f] = n)
							}
							c(k, a.responseText)
						} else u("Operation failed by LeoCorsRequest.get: " + m)
				};
			a || (a = v());
			a && (a.open("GET", m, !0), a.onreadystatechange = d, a.withCredentials = e, a.send())
		},
		post: function(e, m, r, c, a) {
			var d = null,
				k = function() {
					if ((0 == d.readyState || 4 == d.readyState) && 200 == d.status)
						if (l(d)) {
							for (var g = {}, f = 0; f < r.length; f++) {
								var n = r[f],
									b = d.getResponseHeader(n);
								b && (g[n] = b)
							}
							a(g, d.responseText)
						} else u("Operation failed by LeoCorsRequest.post: " + m)
				};
			d ||
				(d = v());
			d && (d.open("POST", m, !0), d.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), d.onreadystatechange = k, d.withCredentials = e, d.send(c))
		}
	}
})("undefined" === typeof window ? this : window);
(function(q, w) {
	"function" === typeof define && define.amd ? define([], w) : "undefined" !== typeof module && module.exports ? module.exports = w() : q.lscache = w()
})(this, function() {
	function q() {
		if (void 0 !== k) return k;
		console.log("Anon fn 1", window.localStorage);
		console.log("lscache", lscache);
		if ("object" !== typeof window.localStorage) return !1;
		try {
			v("__lscachetest__", "__lscachetest__"), l("__lscachetest__"), k = !0
		} catch (b) {
			console.log("Anon fn 2", localStorage.length);
			k = w(b) && localStorage.length ? !0 : !1
		}
		return k
	}

	function w(b) {
		return b && ("QUOTA_EXCEEDED_ERR" === b.name || "NS_ERROR_DOM_QUOTA_REACHED" === b.name || "QuotaExceededError" === b.name)
	}

	function u() {
		void 0 ===
			g && (g = null != window.JSON);
		return g
	}

	function v(b, h) {
		console.log("V local storage reflection", f, b, h);
		localStorage.removeItem("leocache-" + f + b);
		localStorage.setItem("leocache-" + f + b, h)
	}

	function l(b) {
		console.log("L local storage reflection", f, b);
		localStorage.removeItem("leocache-" + f + b)
	}

	function e(b) {
		for (var h = new RegExp("^leocache-" + f.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&") + "(.*)"), t = localStorage.length - 1; 0 <= t; --t) {
			var p = localStorage.key(t);
			console.log("E local storage reflection", p);
			(p = (p = p && p.match(h)) && p[1]) && 0 > p.indexOf("-cacheexpiration") && b(p, p + "-cacheexpiration")
		}
	}

	function m(b) {
		var h = b + "-cacheexpiration";
		l(b);
		l(h)
	}

	function r(b) {
		var h =
			b + "-cacheexpiration",
			t = localStorage.getItem("leocache-" + f + h);
			console.log("R local storage reflection", t)
		if (t && (t = parseInt(t, 10), Math.floor((new Date).getTime() / a) >= t)) return l(b), l(h), !0
	}

	function c(b, h) {
		n && "console" in window && "function" === typeof window.console.warn && (window.console.warn("lscache - " + b), h && window.console.warn("lscache - The error was: " + h.message))
	}
	var a = 6E4,
		d = Math.floor(864E13 / a),
		k, g, f = "",
		n = !1;
	return {
		set: function(b, h, t) {
			if (!q() || !u()) return !1;
			try {
				h = JSON.stringify(h)
			} catch (z) {
				return !1
			}
			try {
				v(b, h)
			} catch (z) {
				if (w(z)) {
					var p = [];
					e(function(x, A) {
						var y = localStorage.getItem("leocache-" + f + A);
						console.log("Y local storage reflection getItem leocache-", f, A);
						y = y ? parseInt(y, 10) : d;
						console.log("Y2 local storage reflection getItem leocache-", f, x);
						p.push({
							key: x,
							size: (localStorage.getItem("leocache-" + f + x) || "").length,
							expiration: y
						})
					});
					p.sort(function(x, A) {
						return A.expiration - x.expiration
					});
					for (var B = (h || "").length; p.length && 0 < B;) {
						var C = p.pop();
						c("Cache is full, removing item with key '" + b + "'");
						m(C.key);
						B -= C.size
					}
					try {
						v(b, h)
					} catch (x) {
						return c("Could not add item with key '" + b + "', perhaps it's too big?", x), !1
					}
				} else return c("Could not add item with key '" + b + "'", z),
					!1
			}
			t ? v(b + "-cacheexpiration", (Math.floor((new Date).getTime() / a) + t).toString(10)) : l(b + "-cacheexpiration");
			return !0
		},
		get: function(b) {
			if (!q() || r(b)) return null;
			console.log("get method leocache-", f, b);
			b = localStorage.getItem("leocache-" + f + b);
			
			if (!b || !u()) return b;
			try {
				return JSON.parse(b)
			} catch (h) {
				return b
			}
		},
		remove: function(b) {
			q() && m(b)
		},
		supported: function() {
			return q()
		},
		flush: function() {
			q() && e(function(b) {
				m(b)
			})
		},
		flushExpired: function() {
			q() && e(function(b) {
				r(b)
			})
		},
		setBucket: function(b) {
			f = b
		},
		resetBucket: function() {
			f = ""
		},
		getExpiryMilliseconds: function() {
			return a
		},
		setExpiryMilliseconds: function(b) {
			a = b;
			d = Math.floor(864E13 / a)
		},
		enableWarnings: function(b) {
			n = b
		}
	}
});
var leoSessionStringKey = "leoctxsk",
	leoVisitorIdStringKey = "leocdp_vid";
(function(q, w) {
	function u() {
		return m = lscache.get(leoSessionStringKey)
	}

	function v() {
		if ("string" === typeof INJECTED_VISITOR_ID) return INJECTED_VISITOR_ID;
		var c = (new Date).getTime();
		return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(a) {
			var d = (c + 16 * Math.random()) % 16 | 0;
			c = Math.floor(c / 16);
			console.log("WARNINGWARNINGWARNING-CREATING-NEW**", ("x" == a ? d : d & 3 | 8).toString(16));
			return ("x" == a ? d : d & 3 | 8).toString(16)
		})
	}

	function l() {
		var c = leoVisitorIdStringKey,
			a = lscache.get(c);
		"string" === typeof INJECTED_VISITOR_ID && "string" === typeof a && a !== INJECTED_VISITOR_ID && (a = INJECTED_VISITOR_ID,
			lscache.flush(), setTimeout(function() {
				console.log("going to set", c, a);
				lscache.set(c, a)
			}, 200));
		"string" !== typeof a && (a = v(), lscache.set(c, a));
		return a
	}
	var e = {
			fingerprintId: ""
		},
		m = !1,
		r = function(c) {
			OBSERVE_WITH_FINGERPRINT && (c.fgp = lscache.get("leocdp_fgp") || e.fingerprintId);
			return Object.keys(c).map(function(a) {
				return encodeURIComponent(a) + "=" + encodeURIComponent(c[a])
			}).join("&")
		};
	e.doTracking = function(c, a, d) {
		d = function(n, b) {};
		a.visid = l();
		a = r(a);
		var k = u();
		// comment it for debug
		//if (k) {
			var g = !1,
				f = PREFIX_EVENT_VIEW_URL;
			"action" === c ? f = PREFIX_EVENT_ACTION_URL :
				"conversion" === c ? (f = PREFIX_EVENT_CONVERSION_URL, g = !0) : "feedback" === c && (f = PREFIX_EVENT_FEEDBACK_URL, g = !0);
			c = "";
			g ? (c = f + "?ctxsk=" + k, LeoCorsRequest.post(!1, c, [], a, d)) : (c = f + "?" + a + "&ctxsk=" + k, LeoCorsRequest.get(!1, c, [], d));
			console.log("LeoCorsRequest url " + c)
		// comment it for debug
		//} else console.log("sessionKey is NULL")
	};
	e.getContextSession = function(c) {
		if ("string" !== typeof u()) {
			c = r(c);
			var a = l();
            console.log("leocorerequest url getcontextsession");
			console.log("inside a", a);
			// adding it for debug
			//lscache.set(leoSessionStringKey, "8005783", SESSION_CACHE_MINUTES);
			LeoCorsRequest.get(!1, PREFIX_SESSION_INIT_URL + "?" + c + "&visid=" + a, [], function(d, k) {
				var g = JSON.parse(k);
				if (101 === g.status) {
					m = g.sessionKey;
					lscache.set(leoSessionStringKey, m, SESSION_CACHE_MINUTES);
					var f = l(),
						n = g.visitorId;
					n && n !== f && lscache.set(leoVisitorIdStringKey, n);
					sendMessage("LeoObserverProxyReady");
					window.console && window.console.log(g)
				} else console.error(g)
			})
		} else sendMessage("LeoObserverProxyReady")
	};
	e.updateProfile = function(c) {
		c.visid = l();
		c = r(c);
		var a = u();
		LeoCorsRequest.post(!1, PREFIX_UPDATE_PROFILE_URL + "?ctxsk=" + a, [], c, function(d, k) {})
	};
	e.initFingerprint = function(c) {
		console.log("Initfingerprint triggered", c);
		Fingerprint2.get({
				excludes: {
					enumerateDevices: !0,
					deviceMemory: !0
				}
			},
			function(a) {
				a = a.map(function(d) {
					return d.value
				});
				a = Fingerprint2.x64hash128(a.join(""), 31);
				console.log("Fingerprint method call", a);
				lscache.set("leocdp_fgp", a);
				e.fingerprintId = a;
				"function" === typeof c && c(a)
			})
	};
	e.getVisitorId = l;
	q.LeoEventObserver = e
})("undefined" === typeof window ? this : window);