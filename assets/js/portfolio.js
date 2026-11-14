/*
	Dev Nidhi — portfolio behaviour (vanilla JS, no extra dependencies).
	Phantom's main.js still runs the slide-in menu and removes body.is-preload (load-in animation).
*/
(function () {
	'use strict';

	var doc = document, root = doc.documentElement;
	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
	var $ = function (s, c) { return (c || doc).querySelector(s); };
	var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
	var hasIO = 'IntersectionObserver' in window;
	var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

	/* One rAF-throttled scroll/resize loop drives every scroll-linked effect */
	var tasks = [];
	var queued = false;
	function run() { queued = false; tasks.forEach(function (t) { t(); }); }
	function schedule() { if (!queued) { queued = true; requestAnimationFrame(run); } }
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule);

	/* Footer year */
	var yr = $('#year');
	if (yr) yr.textContent = new Date().getFullYear();

	/* Header: glass background once scrolled */
	var header = $('.pf-header');
	tasks.push(function () { if (header) header.classList.toggle('is-scrolled', window.scrollY > 24); });

	/* Smooth scrolling for in-page links (also updates the URL hash) */
	$$('a[href^="#"]').forEach(function (a) {
		var id = a.getAttribute('href');
		if (id === '#menu' || id.length < 2) return;
		a.addEventListener('click', function (e) {
			var t = $(id);
			if (!t) return;
			e.preventDefault();
			t.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
			if (history.replaceState) history.replaceState(null, '', id);
			if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
			t.focus({ preventScroll: true });
		});
	});

	/* Current section highlighted in the nav */
	var navLinks = $$('.pf-nav a');
	if (hasIO && navLinks.length) {
		var map = {};
		navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
		var secObs = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (!en.isIntersecting) return;
				navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
				var a = map[en.target.id];
				if (a) a.setAttribute('aria-current', 'true');
			});
		}, { rootMargin: '-45% 0px -50% 0px' });
		Object.keys(map).forEach(function (id) { var s = doc.getElementById(id); if (s) secObs.observe(s); });
	}

	/* Blur-in reveal for headings and cards */
	var reveals = $$('[data-reveal]');
	if (!hasIO) {
		reveals.forEach(function (el) { el.classList.add('is-in'); });
	} else {
		var revObs = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (en.isIntersecting) { en.target.classList.add('is-in'); revObs.unobserve(en.target); }
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
		reveals.forEach(function (el, i) {
			// small stagger between siblings revealed together
			if (el.classList.contains('pf-tl')) el.style.setProperty('--d', (i % 3) * 0.08 + 's');
			revObs.observe(el);
		});
	}

	/* HERO: pinned, scroll-scrubbed. Scroll swaps the intro text in three stages, then the hero blurs away. */
	var hero = $('.pf-hero'), pin = $('.pf-hero__pin');
	if (hero && pin && !reduce.matches) {
		var stages = $$('.pf-stage', hero), dashes = $$('.pf-dashes i', hero), current = 0;
		var setStage = function (n) {
			if (n === current) return;
			current = n;
			stages.forEach(function (s, i) {
				s.classList.toggle('is-active', i === n);
				s.setAttribute('aria-hidden', i === n ? 'false' : 'true');
			});
		};
		tasks.push(function () {
			var r = hero.getBoundingClientRect();
			var total = hero.offsetHeight - window.innerHeight;
			var p = clamp(-r.top / total, 0, 1);
			setStage(p < 0.3 ? 0 : p < 0.58 ? 1 : 2);
			var t = clamp(p / 0.8, 0, 1) * 3;
			dashes.forEach(function (d, i) { d.style.setProperty('--f', clamp(t - i, 0, 1).toFixed(3)); });
			pin.style.setProperty('--x', clamp((p - 0.82) / 0.18, 0, 1).toFixed(3));
			pin.style.setProperty('--hp', p.toFixed(3));
		});
	}

	/* Education timeline: accent line fills as you scroll through it */
	var timeline = $('.pf-timeline');
	if (timeline && !reduce.matches) {
		tasks.push(function () {
			var r = timeline.getBoundingClientRect(), vh = window.innerHeight;
			timeline.style.setProperty('--p', clamp((vh * 0.62 - r.top) / r.height, 0.04, 1).toFixed(3));
		});
	}

	/* About portrait: gentle 3D tilt on hover (mouse only) */
	var tilt = $('.pf-tilt');
	if (tilt && !reduce.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
		tilt.addEventListener('pointermove', function (e) {
			var r = tilt.getBoundingClientRect();
			var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
			tilt.style.transform = 'perspective(900px) rotateX(' + (-y * 12).toFixed(2) + 'deg) rotateY(' + (x * 14).toFixed(2) + 'deg)';
		});
		tilt.addEventListener('pointerleave', function () { tilt.style.transform = ''; });
	}

	/* FEATURED PROJECTS: stacked cards. Each card slides over the previous one, which scales back and dims. */
	var projects = $$('.pf-project');
	var railLinks = $$('#project-rail a');
	var stage = $('.pf-projects__stage');
	if (projects.length) {
		if (!hasIO) {
			projects.forEach(function (p) { p.classList.add('is-seen'); });
		} else {
			var projObs = new IntersectionObserver(function (entries) {
				entries.forEach(function (en) {
					if (!en.isIntersecting) return;
					en.target.classList.add('is-seen');
					var idx = projects.indexOf(en.target);
					railLinks.forEach(function (a, i) {
						if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
					});
				});
			}, { threshold: 0.45 });
			projects.forEach(function (p) { projObs.observe(p); });

			if (stage) {
				new IntersectionObserver(function (entries) {
					doc.body.classList.toggle('in-projects', entries[0].isIntersecting);
				}, { rootMargin: '-45% 0px -45% 0px' }).observe(stage);
			}
		}

		// A card taller than the screen (small phones) sticks so its bottom stays reachable
		var fitTops = function () {
			var vh = window.innerHeight;
			projects.forEach(function (p, i) { p.style.top = (Math.min(0, vh - p.offsetHeight) + i * 14) + 'px'; });
		};
		fitTops();
		window.addEventListener('resize', fitTops);
		window.addEventListener('load', fitTops);

		if (!reduce.matches) {
			tasks.push(function () {
				var vh = window.innerHeight;
				projects.forEach(function (p, i) {
					var next = projects[i + 1];
					var c = next ? clamp(1 - next.getBoundingClientRect().top / vh, 0, 1) : 0;
					p.style.setProperty('--c', c.toFixed(3));
				});
			});
		}
	}

	/* Footer: giant name rises as the end of the page comes into view */
	var footer = $('#site-footer'), fstage = $('.pf-footer__stage');
	if (footer && fstage && !reduce.matches) {
		tasks.push(function () {
			var r = footer.getBoundingClientRect();
			fstage.style.setProperty('--f', clamp((window.innerHeight - r.top) / r.height, 0, 1).toFixed(3));
		});
	}

	/* Cursor: trailing ring (grows over links, shrinks on press) + click ripple */
	var ring = $('.pf-cursor-ring');
	var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	if (ring && !reduce.matches && finePointer) {
		var tx = 0, ty = 0, rx = 0, ry = 0, running = false;
		var follow = function () {
			rx += (tx - rx) * 0.22; ry += (ty - ry) * 0.22;
			ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
			if (Math.abs(tx - rx) > 0.5 || Math.abs(ty - ry) > 0.5) requestAnimationFrame(follow); else running = false;
		};
		var interactive = 'a, button, input, textarea, label, .pf-track li, .pf-rail a';
		doc.addEventListener('pointermove', function (e) {
			if (e.pointerType && e.pointerType !== 'mouse') return;
			tx = e.clientX; ty = e.clientY;
			ring.classList.add('is-on');
			ring.classList.toggle('is-link', !!(e.target.closest && e.target.closest(interactive)));
			if (!running) { running = true; requestAnimationFrame(follow); }
		}, { passive: true });
		doc.addEventListener('pointerleave', function () { ring.classList.remove('is-on'); });
		doc.addEventListener('pointerdown', function () { ring.classList.add('is-down'); });
		doc.addEventListener('pointerup', function () { ring.classList.remove('is-down'); });
	}
	if (!reduce.matches) {
		doc.addEventListener('pointerdown', function (e) {
			var rp = doc.createElement('span');
			rp.className = 'pf-ripple';
			rp.style.left = e.clientX + 'px';
			rp.style.top = e.clientY + 'px';
			doc.body.appendChild(rp);
			rp.addEventListener('animationend', function () { rp.remove(); });
		});
	}

	/* Email buttons copy the address to the clipboard (mailto stays as the no-JS fallback) */
	var toast = $('#pf-toast'), toastTimer;
	var showToast = function (msg) {
		if (!toast) return;
		toast.textContent = msg;
		toast.classList.add('is-on');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
	};
	var copyText = function (text) {
		if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
		return new Promise(function (resolve, reject) {
			var ta = doc.createElement('textarea');
			ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
			doc.body.appendChild(ta); ta.select();
			var ok = false;
			try { ok = doc.execCommand('copy'); } catch (err) { ok = false; }
			ta.remove();
			ok ? resolve() : reject();
		});
	};
	$$('[data-copy-email]').forEach(function (a) {
		a.addEventListener('click', function (e) {
			e.preventDefault();
			var email = (window.PORTFOLIO_CONFIG || {}).contactEmail || a.getAttribute('href').replace('mailto:', '');
			copyText(email).then(function () { showToast('Email copied to clipboard'); })
				.catch(function () { window.location.href = 'mailto:' + email; });
		});
	});

	/* Loading screen: counts up, then lifts away and lets the hero animate in */
	var loader = $('.pf-loader');
	var finishLoading = function () {
		root.classList.remove('pf-loading');
		if (loader) {
			loader.classList.add('is-done');
			setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 1200);
		}
	};
	if (loader && !reduce.matches) {
		var count = $('.pf-loader__count', loader), t0 = performance.now(), MIN = 1700;
		var pageLoaded = doc.readyState === 'complete';
		if (!pageLoaded) window.addEventListener('load', function () { pageLoaded = true; });
		var tick = function (now) {
			var p = Math.min((now - t0) / MIN, 1);
			if (!pageLoaded) p = Math.min(p, 0.92);
			loader.style.setProperty('--lp', p.toFixed(3));
			if (count) count.textContent = Math.round(p * 100);
			if (p >= 1) { setTimeout(finishLoading, 250); return; }
			requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	} else {
		finishLoading();
	}

	schedule();

	/* Contact form */
	var form = $('#contact-form');
	if (form) {
		var cfg = window.PORTFOLIO_CONFIG || {};
		var status = $('#cf-status');
		var fields = { name: $('#cf-name'), email: $('#cf-email'), message: $('#cf-message') };
		var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

		var setErr = function (key, msg) {
			var el = fields[key], out = $('#cf-' + key + '-err');
			out.textContent = msg || '';
			if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
		};
		var validate = function () {
			var ok = true, first = null;
			var name = fields.name.value.trim(), email = fields.email.value.trim(), msg = fields.message.value.trim();
			setErr('name', name.length < 2 ? 'Enter your name.' : '');
			setErr('email', !emailRe.test(email) ? 'Enter a valid email address, like name@example.com.' : '');
			setErr('message', msg.length < 10 ? 'Write a message of at least 10 characters.' : '');
			['name', 'email', 'message'].forEach(function (k) {
				if (fields[k].getAttribute('aria-invalid') === 'true') { ok = false; if (!first) first = fields[k]; }
			});
			if (first) first.focus();
			return ok;
		};
		var say = function (text, cls) { status.className = 'pf-form__status' + (cls ? ' ' + cls : ''); status.textContent = text; };

		['name', 'email', 'message'].forEach(function (k) {
			fields[k].addEventListener('input', function () { if (fields[k].getAttribute('aria-invalid')) setErr(k, ''); });
		});

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			say('');
			if (form.elements.company && form.elements.company.value) return; // honeypot: bots only
			if (!validate()) return;

			var data = { name: fields.name.value.trim(), email: fields.email.value.trim(), message: fields.message.value.trim() };
			var btn = form.querySelector('button[type="submit"]');

			if (cfg.contactEndpoint) {
				btn.disabled = true;
				say('Sending…');
				fetch(cfg.contactEndpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
					body: JSON.stringify(data)
				}).then(function (res) {
					if (!res.ok) throw new Error('HTTP ' + res.status);
					form.reset();
					say('Message sent. Thank you, I’ll get back to you soon.', 'is-ok');
				}).catch(function () {
					status.className = 'pf-form__status is-error';
					status.innerHTML = 'The message could not be sent. Please email <a href="mailto:' + cfg.contactEmail + '">' + cfg.contactEmail + '</a> instead.';
				}).then(function () { btn.disabled = false; });
				return;
			}

			// No form service connected yet: be honest and fall back to the visitor's email app.
			var subject = 'Portfolio message from ' + data.name;
			var body = data.message + '\n\n— ' + data.name + ' (' + data.email + ')';
			window.location.href = 'mailto:' + cfg.contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
			status.className = 'pf-form__status';
			status.textContent = 'Opening your email app with the message ready. If nothing opens, use the Email button above.';
		});
	}
})();
