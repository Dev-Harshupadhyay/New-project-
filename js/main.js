/* ============================================================
   Harsh Upadhyay — portfolio behaviour
   No dependencies, no framework. Everything here is progressive:
   with JS disabled the page still renders and every link works.

   1  Scroll reveal        IntersectionObserver, staggered, once per element
   2  Header + progress    hide on scroll-down, shadow on scroll, reading rule
   3  Local time           real IST clock, no decorative filler
   4  Copy email           clipboard with a mailto: fallback
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1  Scroll reveal
     Elements start at opacity 0 via .reveal in the CSS. If the
     visitor prefers reduced motion — or the browser is too old for
     IntersectionObserver — everything is revealed immediately
     instead of being left invisible.
     ---------------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduce) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target); // one-way: never re-hide on scroll-up
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealables.forEach(function (el, i) {
      // stagger the first few so a group enters like a sequence, not a block
      el.style.setProperty('--delay', Math.min(i, 6) * 60 + 'ms');
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     2  Header behaviour + reading progress
     The bar is one element scaled on the X axis (cheap to animate).
     The header gets out of the way when reading down and comes back
     the moment the visitor scrolls up.
     ---------------------------------------------------------- */
  var head = document.getElementById('siteHead');
  var bar = document.getElementById('progress');
  var lastY = window.scrollY;
  var queued = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    head.dataset.scrolled = y > 20 ? 'true' : 'false';

    if (y > 160 && y > lastY + 4) {
      head.dataset.hidden = 'true';       // scrolling down, past the hero
    } else if (y < lastY - 4 || y < 160) {
      head.dataset.hidden = 'false';      // scrolling up, or back at the top
    }

    lastY = y;
    queued = false;
  }

  window.addEventListener('scroll', function () {
    if (!queued) {
      queued = true;
      window.requestAnimationFrame(onScroll); // coalesce to one paint per frame
    }
  }, { passive: true });

  onScroll();

  /* ----------------------------------------------------------
     3  Local time (Asia/Kolkata)
     Intl handles the timezone, so this stays correct for a visitor
     in any country and through daylight-saving changes elsewhere.
     ---------------------------------------------------------- */
  var clock = document.getElementById('clock');
  try {
    var formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    var paintClock = function () { clock.textContent = formatter.format(new Date()) + ' IST'; };
    paintClock();
    setInterval(paintClock, 15000); // every 15s is plenty for a minute clock
  } catch (err) {
    clock.textContent = 'IST, UTC+5:30'; // ancient browser: state the offset instead
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     4  Copy email
     The button is an anchor to mailto: so it still works without JS
     or without clipboard permission. With JS it copies instead and
     reports back through the aria-live note underneath.
     ---------------------------------------------------------- */
  var copyBtn = document.getElementById('copyBtn');
  var copyNote = document.getElementById('copyNote');
  var email = 'harsh48227@gmail.com';

  copyBtn.addEventListener('click', function (ev) {
    // clipboard API needs a secure context; mailto: is the honest fallback
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;

    ev.preventDefault();
    navigator.clipboard.writeText(email).then(function () {
      copyNote.textContent = 'Copied to clipboard';
      setTimeout(function () { copyNote.textContent = 'Click to copy'; }, 2200);
    }, function () {
      window.location.href = 'mailto:' + email; // permission denied: just open mail
    });
  });
})();
