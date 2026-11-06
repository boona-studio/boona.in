/* ==========================================================================
   Boona — site script. Plain JavaScript, no libraries, no build step.
   1 grid toggle · 2 live clock · 3 load choreography · 4 reveal on scroll
   5 count-ups · 6 timeline draw · 7 copy email · 8 quarters · 9 brief form
   10 product screens (land → snap → play, and Replay) · 11 readout + G key
   12 smooth scrolling (the wheel glides, section links glide) · 13 the field behind the landing
   ========================================================================== */
(function () {
  'use strict';

  var html = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  /* wait(): run fn after ms. With reduced motion, run it right away so the page lands in its end state.
     While a screen is being set up, every timer is kept on that screen so Replay can clear them. */
  var timers = null;
  var wait = function (ms, fn) {
    if (reduce) { fn(); return 0; }
    var id = setTimeout(fn, ms);
    if (timers) timers.push(id);
    return id;
  };

  /* 1 ▸ grid toggle ------------------------------------------------------ */
  var saved = null;
  try { saved = localStorage.getItem('boona-grid'); } catch (e) { /* private mode etc. */ }
  if (saved === 'off') html.setAttribute('data-grid', 'off');
  var toggle = $('.toggle');
  function syncToggle() {
    var on = html.getAttribute('data-grid') !== 'off';
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  if (toggle) {
    syncToggle();
    toggle.addEventListener('click', function () {
      var on = html.getAttribute('data-grid') !== 'off';
      html.setAttribute('data-grid', on ? 'off' : 'on');
      try { localStorage.setItem('boona-grid', on ? 'off' : 'on'); } catch (e) { /* ignore */ }
      syncToggle();
    });
  }

  /* 2 ▸ live clock, Indian Standard Time --------------------------------- */
  var clocks = $$('.clock');
  if (clocks.length) {
    var fmt = null;
    try {
      fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    } catch (e) { fmt = null; }
    var tick = function () {
      var d = new Date();
      var txt = fmt ? fmt.format(d) : d.toTimeString().slice(0, 8);
      clocks.forEach(function (c) { c.textContent = txt; c.setAttribute('datetime', d.toISOString()); });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* 3 ▸ load choreography: columns draw, pieces land off-grid, then snap -- */
  var dim = $('.hero .dim'), nameEl = $('.hero .sel'), wrapEl = $('.hero .wrap');
  if (dim && nameEl) {
    /* The label on the name reads like a design tool: its x / y position and the grid column it starts in. */
    var measure = function () {
      var nr = nameEl.getBoundingClientRect();
      if (!nr.width) return;
      var cols = parseInt(getComputedStyle(html).getPropertyValue('--cols'), 10) || 12;
      var w = wrapEl ? wrapEl.getBoundingClientRect() : nr;
      var col = Math.max(1, Math.min(cols, Math.floor((nr.left - w.left) / (w.width / cols)) + 1));
      dim.textContent = 'x ' + Math.round(nr.left) + ' · y ' + Math.round(nr.top + window.scrollY) + ' · col ' + (col < 10 ? '0' : '') + col;
    };
    measure();
    requestAnimationFrame(measure);
    window.addEventListener('load', measure);
  }
  if (html.classList.contains('is-loading')) {
    setTimeout(function () { html.classList.add('is-snapped'); }, 1100);
    setTimeout(function () {
      html.classList.remove('is-loading');
      html.classList.remove('is-snapped');
      html.classList.add('is-done');
    }, 2300);
  }

  /* 4 ▸ reveal on scroll ------------------------------------------------- */
  var hasIO = 'IntersectionObserver' in window;
  function observe(els, cb, opts) {
    if (!els.length) return;
    if (!hasIO || reduce) { els.forEach(cb); return; }
    var ob = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { ob.unobserve(en.target); cb(en.target); }
      });
    }, opts || { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { ob.observe(el); });
  }
  observe($$('.reveal'), function (el) { el.classList.add('is-in'); });
  observe($$('.plan'), function (el) { el.classList.add('is-in'); }, { threshold: .3 });

  /* 5 ▸ count-ups: <b class="num" data-count="7" data-suffix=" h">0</b> --- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var render = function (v) {
      el.textContent = prefix + v.toFixed(decimals);
      if (suffix) { var s = document.createElement('small'); s.textContent = suffix; el.appendChild(s); }
    };
    if (reduce || isNaN(target)) { render(isNaN(target) ? 0 : target); return; }
    var t0 = null, dur = 1100;
    var step = function (ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      render(target * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  observe($$('[data-count]'), countUp, { threshold: .6 });

  /* 6 ▸ experience timeline draws as you scroll; each chapter brightens as the line reaches it */
  var tl = $('.timeline');
  if (tl) {
    var line = $('.tl__line', tl), items = $$('li', tl), ticking = false;
    var draw = function () {
      ticking = false;
      var r = tl.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var p = reduce ? 1 : Math.max(0, Math.min(1, (vh * .78 - r.top) / r.height));
      if (line) line.style.setProperty('--p', p.toFixed(4));
      items.forEach(function (li) {
        var lr = li.getBoundingClientRect();
        li.classList.toggle('is-past', (lr.top + 8 - r.top) / r.height <= p);
      });
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(draw); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    draw();
  }

  /* 7 ▸ copy email ------------------------------------------------------- */
  var copy = $('.copy');
  if (copy) {
    copy.addEventListener('click', function () {
      var email = copy.getAttribute('data-email');
      var done = function () {
        copy.classList.add('is-done'); copy.textContent = 'Copied';
        setTimeout(function () { copy.classList.remove('is-done'); copy.textContent = 'Copy'; }, 1600);
      };
      var fallback = function () {
        var ta = document.createElement('textarea');
        ta.value = email; ta.setAttribute('readonly', '');
        ta.style.position = 'absolute'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* nothing more we can do */ }
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done, fallback);
      else fallback();
    });
  }

  /* 8 ▸ quarter labels from today's date --------------------------------- */
  var now = new Date(), q0 = Math.floor(now.getMonth() / 3), y0 = now.getFullYear();
  $$('[data-quarter]').forEach(function (el) {
    var i = parseInt(el.getAttribute('data-quarter'), 10);
    var q = (q0 + i) % 4 + 1, y = y0 + Math.floor((q0 + i) / 4);
    el.textContent = 'Q' + q + ' ' + y;
  });

  /* 9 ▸ brief form: opens the visitor's email app with the brief filled in */
  var form = $('#brief');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = function (n) { var el = form.elements[n]; return el ? String(el.value).trim() : ''; };
      var subject = 'Project brief from ' + (f('name') || 'the website');
      var body = [
        'Name: ' + f('name'),
        'Company: ' + f('company'),
        'When: ' + f('when'),
        'Budget: ' + (f('budget') || 'not given'),
        '',
        'What AI should do:',
        f('what')
      ].join('\n');
      window.location.href = 'mailto:' + form.getAttribute('data-to') +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var note = $('.note', form);
      if (note) note.textContent = 'Your email app should have opened with the brief filled in. If not, write to the address above.';
    });
  }

  /* 10 ▸ product screens -------------------------------------------------- */
  function cursorOf(scr) { return $('.cursor', scr); }
  function cursorTo(scr, el, dur) {
    var c = cursorOf(scr); if (!c || !el) return;
    var r = el.getBoundingClientRect(), s = scr.getBoundingClientRect();
    c.style.transitionDuration = dur ? dur + 'ms, ' + dur + 'ms, .3s' : '';
    c.style.left = ((r.left + r.width / 2 - s.left) / s.width * 100).toFixed(2) + '%';
    c.style.top = ((r.top + r.height / 2 - s.top) / s.height * 100).toFixed(2) + '%';
    c.style.opacity = '1';
  }
  function cursorDragX(scr, railEl, fraction, dur) {
    var c = cursorOf(scr); if (!c || !railEl) return;
    var t = railEl.getBoundingClientRect(), s = scr.getBoundingClientRect();
    c.style.transitionDuration = dur + 'ms, ' + dur + 'ms, .3s';
    c.style.left = ((t.left + t.width * fraction - s.left) / s.width * 100).toFixed(2) + '%';
  }
  function cursorClick(scr, el) {
    var c = cursorOf(scr);
    if (c) { c.classList.remove('is-click'); void c.offsetWidth; c.classList.add('is-click'); }
    if (el) { el.classList.add('is-pressed'); setTimeout(function () { el.classList.remove('is-pressed'); }, 200); }
  }
  function cursorHide(scr) { var c = cursorOf(scr); if (c) { c.style.opacity = '0'; c.style.transitionDuration = ''; } }
  function pulse(el, cls, ms) {
    if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    if (!reduce) setTimeout(function () { el.classList.remove(cls); }, ms);
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function runTimer(el, max, startAt) {
    if (!el) return;
    var s = startAt || 0;
    var show = function () { el.textContent = pad(Math.floor(s / 60)) + ':' + pad(s % 60); };
    show();
    if (reduce) return;
    var iv = setInterval(function () { s++; show(); if (s >= max) clearInterval(iv); }, 1000);
    if (timers) timers.push(iv);
  }

  var plays = {
    /* Azhagi: the operator unmutes, Azhagi answers and describes what she sees, then is asked to wave. */
    azhagi: function (scr) {
      var face = $('.azface', scr), mic = $('[data-act="mic"]', scr), waveBtn = $('[data-act="wave"]', scr);
      runTimer($('.az__timer', scr), 45, reduce ? 12 : 0);
      wait(300, function () { cursorTo(scr, mic); });
      wait(900, function () { cursorClick(scr, mic); if (mic) mic.classList.add('is-on'); });
      wait(1500, function () { cursorHide(scr); });
      wait(2400, function () { if (face) { face.classList.add('is-talking'); pulse(face, 'is-nod', 600); } });
      wait(4000, function () { if (face) face.classList.remove('is-talking'); cursorTo(scr, waveBtn); });
      wait(4600, function () { cursorClick(scr, waveBtn); pulse(face, 'is-wave', 1300); });
      wait(5200, function () { if (face) face.classList.add('is-talking'); cursorHide(scr); });
      wait(6000, function () { if (face) face.classList.remove('is-talking'); });
    },

    /* Boona Cue: the prompt is typed, parsed into cues, then played back; the counters land on 2/2 and 3/3. */
    cue: function (scr) {
      var face = $('.cueface', scr), prompt = $('.prompt', scr), play = $('[data-act="play"]', scr);
      var blinks = $('[data-c="blinks"]', scr), nods = $('[data-c="nods"]', scr);
      wait(200, function () { cursorTo(scr, prompt); });
      wait(700, function () { cursorClick(scr, prompt); scr.classList.add('is-typing'); });
      wait(1200, function () { cursorHide(scr); });
      wait(2500, function () { scr.classList.add('is-parsed'); });
      wait(3100, function () { cursorTo(scr, play); });
      wait(3700, function () { cursorClick(scr, play); scr.classList.add('is-scrubbing'); if (play) play.classList.add('is-on'); });
      wait(4300, function () { cursorHide(scr); });
      var t0 = 3700, span = 3200;
      [[.10, 'b', 1], [.22, 'b', 2], [.40, 'n', 1], [.58, 'n', 2], [.76, 'n', 3]].forEach(function (k) {
        wait(t0 + k[0] * span, function () {
          if (k[1] === 'b') { if (blinks) blinks.textContent = k[2] + '/2'; pulse(face, 'is-blink', 300); }
          else { if (nods) nods.textContent = k[2] + '/3'; pulse(face, 'is-nod', 550); }
        });
      });
    },

    /* Thali: the plan appears, then the cursor drags "People" from 1 to 2 and every portion doubles. */
    thali: function (scr) {
      var slider = $('.slider', scr), knob = slider ? $('.knob', slider) : null, rail = slider ? $('.rail', slider) : null;
      var people = $('[data-c="people"]', scr), serves = $('[data-c="serves"]', scr);
      var qs = $$('.q[data-base]', scr);
      var setPeople = function (n) {
        if (people) people.textContent = n;
        if (serves) serves.textContent = n;
        qs.forEach(function (q) {
          var base = parseFloat(q.getAttribute('data-base'));
          var unit = q.getAttribute('data-unit') || '';
          var plural = q.getAttribute('data-plural') || unit;
          var v = base * n;
          q.textContent = (v % 1 ? v.toFixed(1) : v) + ' ' + (v === 1 ? unit : plural);
          pulse(q, 'is-bump', 400);
        });
      };
      wait(2000, function () { cursorTo(scr, knob); });
      wait(2700, function () {
        if (slider) slider.style.setProperty('--pf', '0.3333');
        cursorDragX(scr, rail, 1 / 3, 900);
        cursorClick(scr);
      });
      wait(3300, function () { setPeople(2); });
      wait(4300, function () { cursorHide(scr); });
    },

    /* Boona Fit: rings and bars fill, the cursor starts a session and raises the intensity. */
    fit: function (scr) {
      var start = $('[data-act="start"]', scr), timer = $('.fit__timer', scr);
      var slider = $('.slider', scr), knob = slider ? $('.knob', slider) : null, rail = slider ? $('.rail', slider) : null;
      var inten = $('[data-c="intensity"]', scr);
      wait(1400, function () { cursorTo(scr, start); });
      wait(2000, function () {
        cursorClick(scr, start);
        if (start) { start.classList.add('is-on'); start.textContent = 'Session on'; }
        runTimer(timer, 40, reduce ? 7 : 0);
      });
      wait(3000, function () { cursorTo(scr, knob); });
      wait(3600, function () {
        if (slider) slider.style.setProperty('--pf', '0.7');
        cursorDragX(scr, rail, .7, 900);
        cursorClick(scr);
      });
      wait(4200, function () { if (inten) inten.textContent = '70'; });
      wait(5200, function () { cursorHide(scr); });
    }
  };

  function playScreen(bd) {
    var scr = $('.screen, .phone', bd);
    var name = bd.getAttribute('data-screen');
    if (!scr) return;
    bd._timers = [];
    var go = function () {
      timers = bd._timers;
      scr.classList.add('is-playing');
      if (plays[name]) plays[name](scr);
      timers = null;
    };
    if (reduce) { bd.classList.add('is-landing'); bd.classList.add('is-snapped'); go(); return; }
    bd.classList.add('is-landing');
    bd._timers.push(setTimeout(function () { bd.classList.add('is-snapped'); }, 500));
    bd._timers.push(setTimeout(go, 1000));
  }
  var backdrops = $$('.backdrop[data-screen]');
  backdrops.forEach(function (bd) { bd._fresh = bd.innerHTML; });
  observe(backdrops, playScreen, { threshold: .35 });

  /* Replay: stop whatever is running, put the screen back to its first frame, run the sequence again. */
  function replay(bd) {
    (bd._timers || []).forEach(function (id) { clearTimeout(id); clearInterval(id); });
    bd.classList.remove('is-landing'); bd.classList.remove('is-snapped');
    bd.innerHTML = bd._fresh;
    void bd.offsetWidth;
    playScreen(bd);
  }
  $$('.replay').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var bd = $('.backdrop[data-screen="' + btn.getAttribute('data-replay') + '"]');
      if (bd) replay(bd);
    });
  });

  /* 11 ▸ side readout (which section, how far down) and the G key for the grid */
  var readout = $('.readout');
  if (readout) {
    var marks = [['top', 'Index'], ['work', 'Work'], ['approach', 'Approach'], ['experience', 'Experience'], ['writing', 'Writing'], ['contact', 'Contact']];
    var upd = function () {
      var y = window.scrollY || 0, idx = 0, line = y + (window.innerHeight || 800) * .4;
      marks.forEach(function (m, i) {
        var el = document.getElementById(m[0]);
        if (el && el.getBoundingClientRect().top + y <= line) idx = i;
      });
      var ys = String(Math.round(y)); while (ys.length < 5) ys = '0' + ys;
      readout.textContent = '§ ' + (idx < 10 ? '0' : '') + idx + ' ' + marks[idx][1] + ' · Y ' + ys;
    };
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }
  document.addEventListener('keydown', function (e) {
    if ((e.key !== 'g' && e.key !== 'G') || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName ? t.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || (t && t.isContentEditable)) return;
    if (toggle) toggle.click();
  });

  /* 12 ▸ smooth scrolling --------------------------------------------------
     With a mouse, each wheel notch moves a target and the page glides towards it, easing out over
     about half a second, the way the reference page scrolls. Touch screens, keyboards and the
     scrollbar keep the browser's own scrolling, and "reduce motion" switches all of this off. */
  var fine = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  var sm = { target: 0, current: 0, raf: 0, last: 0, anchor: false };
  var maxY = function () { return Math.max(0, html.scrollHeight - window.innerHeight); };
  var glide = function (ts) {
    var dt = sm.last ? Math.min(64, ts - sm.last) : 16.7;
    sm.last = ts;
    var k = 1 - Math.exp(-dt / 160);
    sm.current += (sm.target - sm.current) * k;
    if (Math.abs(sm.target - sm.current) < .4) sm.current = sm.target;
    window.scrollTo(0, sm.current);
    if (sm.current === sm.target) { sm.raf = 0; sm.last = 0; return; }
    sm.raf = requestAnimationFrame(glide);
  };
  var stopMotion = function () { if (sm.raf) { cancelAnimationFrame(sm.raf); sm.raf = 0; } sm.last = 0; sm.anchor = false; };
  if (!reduce && fine) {
    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.defaultPrevented) return;
      var t = e.target;
      if (t && t.closest && t.closest('textarea, select')) return;
      var dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 40; else if (e.deltaMode === 2) dy *= window.innerHeight;
      if (!dy) return;
      e.preventDefault();
      if (sm.anchor) stopMotion();
      if (!sm.raf) { sm.current = window.scrollY; sm.target = sm.current; }
      sm.target = Math.max(0, Math.min(maxY(), sm.target + dy));
      if (!sm.raf) sm.raf = requestAnimationFrame(glide);
    }, { passive: false });
    window.addEventListener('scroll', function () {
      /* if the page moved and it was not us (keyboard, scrollbar, a jump), forget our target */
      if (sm.raf && Math.abs(window.scrollY - sm.current) > 1.5) { stopMotion(); sm.current = sm.target = window.scrollY; }
    }, { passive: true });
  }

  /* Section links glide too: an ease-in-out curve over about a second, then the address updates. */
  var scrollToY = function (y, ms) {
    y = Math.max(0, Math.min(maxY(), y));
    if (reduce) { window.scrollTo(0, y); return; }
    stopMotion();
    var y0 = window.scrollY, t0 = null;
    sm.anchor = true;
    var step = function (ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / ms);
      var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      sm.current = y0 + (y - y0) * e;
      window.scrollTo(0, sm.current);
      if (p < 1) { sm.raf = requestAnimationFrame(step); }
      else { sm.raf = 0; sm.anchor = false; sm.target = sm.current = y; }
    };
    sm.raf = requestAnimationFrame(step);
  };
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    var id = a.getAttribute('href').slice(1);
    var el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    var navH = parseFloat(getComputedStyle(html).getPropertyValue('--nav-h')) || 48;
    var y = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - navH - 24;
    scrollToY(y, 900);
    if (history.pushState) history.pushState(null, '', '#' + id);
  });

  /* 13 ▸ the field behind the landing section -----------------------------
     A slow constellation of points and links, a little like a neural net, with teal signals running
     along the links. It leans with the pointer (deeper points lean less), and points near the pointer
     gather towards it and light up. Plain canvas, no library. It pauses while the landing section is
     off screen or the tab is hidden, and it does not run at all under "reduce motion". */
  var heroEl = $('.hero'), fieldEl = $('.hero__field');
  if (heroEl && fieldEl && fieldEl.getContext && !reduce) {
    var fx = fieldEl.getContext('2d');
    var fw = 0, fh = 0, pts = [], lnk = [], sig = [];
    var mx = -1e4, my = -1e4, lean = { x: 0, y: 0, tx: 0, ty: 0 };
    var fRaf = 0, fLast = 0, fVisible = true, sigClock = 0;
    var TEAL = '63, 201, 176';
    var fieldBuild = function () {
      var r = heroEl.getBoundingClientRect();
      fw = Math.round(r.width); fh = Math.round(r.height);
      if (fw < 2 || fh < 2 || getComputedStyle(fieldEl).display === 'none') { fw = fh = 0; return; }
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      fieldEl.width = fw * dpr; fieldEl.height = fh * dpr;
      fx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = []; lnk = []; sig = [];
      var cell = fw < 1000 ? 88 : 108;
      var cols = Math.ceil(fw / cell) + 2, rows = Math.ceil(fh / cell) + 2;
      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          if (Math.random() < .3) continue;                     /* gaps keep it a constellation, not a lattice */
          var z = .45 + Math.random() * .55;                     /* depth: deeper points are smaller, fainter, lean less */
          pts.push({ ax: (i - .5) * cell + (Math.random() - .5) * cell * .8, ay: (j - .5) * cell + (Math.random() - .5) * cell * .8,
            x: 0, y: 0, z: z, r: (1.1 + Math.random() * 1.4) * z, ph: Math.random() * 6.283,
            sp: .12 + Math.random() * .22, amp: (5 + Math.random() * 9) * z, e: 0 });
        }
      }
      var seen = {}, maxD = cell * 1.6;
      pts.forEach(function (p, a) {
        var near = [];
        pts.forEach(function (q, b) {
          if (a === b) return;
          var dx = p.ax - q.ax, dy = p.ay - q.ay, d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxD) near.push([d, b]);
        });
        near.sort(function (u, v) { return u[0] - v[0]; });
        near.slice(0, 3).forEach(function (n) {
          var b = n[1], key = a < b ? a + '-' + b : b + '-' + a;
          if (!seen[key]) { seen[key] = 1; lnk.push({ a: a, b: b }); }
        });
      });
    };
    var fieldFrame = function (ts) {
      fRaf = 0;
      if (!fw) return;
      var dt = fLast ? Math.min(.05, (ts - fLast) / 1000) : .016; fLast = ts;
      var t = ts / 1000, R = 220;
      lean.x += (lean.tx - lean.x) * .04; lean.y += (lean.ty - lean.y) * .04;
      fx.clearRect(0, 0, fw, fh);
      pts.forEach(function (p) {
        p.x = p.ax + Math.sin(t * p.sp + p.ph) * p.amp + lean.x * 18 * p.z;
        p.y = p.ay + Math.cos(t * p.sp * .8 + p.ph) * p.amp * .7 + lean.y * 18 * p.z;
        var dx = mx - p.x, dy = my - p.y, d = Math.sqrt(dx * dx + dy * dy), pull = d < R ? 1 - d / R : 0;
        pull *= pull;
        p.x += dx * pull * .22; p.y += dy * pull * .22;
        p.e += (pull - p.e) * (pull > p.e ? .25 : .04);
      });
      fx.lineWidth = 1;
      lnk.forEach(function (k) {
        var p = pts[k.a], q = pts[k.b], e = Math.max(p.e, q.e), z = (p.z + q.z) / 2;
        fx.strokeStyle = e > .02 ? 'rgba(' + TEAL + ', ' + (.25 + e * .6).toFixed(3) + ')' : 'rgba(0, 0, 0, ' + (.07 + .09 * z).toFixed(3) + ')';
        fx.beginPath(); fx.moveTo(p.x, p.y); fx.lineTo(q.x, q.y); fx.stroke();
      });
      sigClock += dt;
      if (sigClock > .35 && lnk.length) {
        sigClock = 0;
        var hot = lnk.filter(function (k) { return pts[k.a].e > .15 || pts[k.b].e > .15; });
        var pick = (hot.length && Math.random() < .7) ? hot[Math.floor(Math.random() * hot.length)] : lnk[Math.floor(Math.random() * lnk.length)];
        sig.push({ k: pick, p: 0, v: .35 + Math.random() * .4, f: Math.random() < .5 ? 1 : -1 });
        if (sig.length > 28) sig.shift();
      }
      sig = sig.filter(function (s) {
        s.p += dt * s.v;
        if (s.p >= 1) return false;
        var p = pts[s.k.a], q = pts[s.k.b];
        if (s.f < 0) { var tmp = p; p = q; q = tmp; }
        var u = s.p, x = p.x + (q.x - p.x) * u, y = p.y + (q.y - p.y) * u;
        var u0 = Math.max(0, u - .18), tx = p.x + (q.x - p.x) * u0, ty = p.y + (q.y - p.y) * u0;
        var g = fx.createLinearGradient(tx, ty, x, y);
        g.addColorStop(0, 'rgba(' + TEAL + ', 0)'); g.addColorStop(1, 'rgba(' + TEAL + ', .9)');
        fx.strokeStyle = g; fx.lineWidth = 1.5;
        fx.beginPath(); fx.moveTo(tx, ty); fx.lineTo(x, y); fx.stroke();
        fx.fillStyle = 'rgba(' + TEAL + ', .95)';
        fx.beginPath(); fx.arc(x, y, 2, 0, 6.283); fx.fill();
        return true;
      });
      pts.forEach(function (p) {
        var a = .16 + .18 * p.z + p.e * .5, r = p.r * (1 + p.e * 1.2);
        fx.fillStyle = p.e > .05 ? 'rgba(' + TEAL + ', ' + Math.min(1, .4 + p.e).toFixed(3) + ')' : 'rgba(0, 0, 0, ' + a.toFixed(3) + ')';
        fx.beginPath(); fx.arc(p.x, p.y, r, 0, 6.283); fx.fill();
      });
      if (fVisible && !document.hidden) fRaf = requestAnimationFrame(fieldFrame); else fLast = 0;
    };
    var fieldStart = function () { if (!fRaf && fw && fVisible && !document.hidden) { fLast = 0; fRaf = requestAnimationFrame(fieldFrame); } };
    fieldBuild(); fieldStart();
    if (hasIO) new IntersectionObserver(function (en) { fVisible = en[0].isIntersecting; fieldStart(); }, { threshold: 0 }).observe(heroEl);
    document.addEventListener('visibilitychange', fieldStart);
    var fRsz = 0;
    window.addEventListener('resize', function () { clearTimeout(fRsz); fRsz = setTimeout(function () { fieldBuild(); fieldStart(); }, 150); });
    if (fine) {
      window.addEventListener('pointermove', function (e) {
        var r = fieldEl.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
        lean.tx = (e.clientX / window.innerWidth - .5) * 2; lean.ty = (e.clientY / window.innerHeight - .5) * 2;
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', function () { mx = my = -1e4; lean.tx = lean.ty = 0; });
    }
  }
})();
