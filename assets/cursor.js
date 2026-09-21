(function () {
  var PAINT_SVG =
    '<svg class="landing-cursor__paint" viewBox="0 0 32 32" width="26" height="26" fill="none" aria-hidden="true">' +
    '<path d="M16.1 5.2c2.6.1 4.6 1.7 5.4 3.8 1.7.4 3 1.8 3.1 3.6.9.5 1.5 1.5 1.4 2.7-.1 1.4-1.1 2.5-2.4 2.9.2 1.5-.6 3-2 3.6-1 .5-2.2.4-3.1-.1-.4 1.2-1.5 2.1-2.9 2.2-1.3.1-2.5-.6-3.1-1.7-1 .6-2.3.6-3.3 0-1.2-.7-1.8-2.1-1.6-3.4-1.2-.5-2-1.7-1.9-3 .1-1.4 1.1-2.5 2.4-2.9.1-1.7 1.2-3.1 2.8-3.6.7-1.9 2.5-3.2 4.7-3.3.1 0 .3 0 .5.02z" fill="currentColor"/>' +
    '<path d="M12.8 11.2c1.5-1 3.4-.8 4.6.5 1-.7 2.5-.6 3.4.5.6.7.7 1.7.3 2.5.9.6 1.2 1.7.8 2.7-.3.8-1.1 1.4-1.9 1.5-.1.9-.8 1.7-1.7 1.9-.7.1-1.3-.1-1.8-.5-.5.4-1.3.5-1.9.2-.9-.4-1.3-1.4-1.1-2.3-.8-.4-1.3-1.3-1.1-2.2.2-.9.8-1.5 1.6-1.7 0-.7.3-1.4.8-1.9.1-.1.2-.2.3-.2z" fill="currentColor" opacity=".72"/>' +
    '<path d="M15.4 9.6c1.1-.4 2.4-.1 3.1.9.8-.2 1.7.2 2.1 1 .3.6.2 1.3-.2 1.8.6.5.8 1.3.5 2-.2.6-.8 1-1.4 1 .1.7-.3 1.4-1 1.6-.5.1-1 0-1.3-.3-.4.3-1 .3-1.4 0-.6-.3-.8-1-.6-1.6-.6-.2-.9-.8-.8-1.5.1-.6.5-1.1 1.1-1.3.1-.6.4-1.1.9-1.4z" fill="currentColor" opacity=".55"/>' +
    '<path d="M14.2 13.8c.8-.5 1.8-.4 2.5.3.6-.3 1.4-.2 1.9.5.3.4.3 1 0 1.4.5.3.7.9.4 1.4-.2.4-.6.7-1.1.7 0 .5-.3.9-.8 1-.3.1-.7 0-.9-.2-.3.2-.7.2-1 0-.4-.2-.6-.7-.5-1.1-.4-.2-.7-.6-.6-1.1.1-.4.4-.7.8-.8.1-.4.3-.8.7-1 .1 0 .2-.1.2-.1z" fill="currentColor" opacity=".4"/>' +
    '<circle cx="7.2" cy="9.4" r="1.35" fill="currentColor" opacity=".85"/>' +
    '<circle cx="25.4" cy="12.2" r="1.05" fill="currentColor" opacity=".7"/>' +
    '<circle cx="22.8" cy="24.6" r="1.2" fill="currentColor" opacity=".8"/>' +
    '<circle cx="9.6" cy="23.8" r="0.9" fill="currentColor" opacity=".75"/>' +
    '<circle cx="19.2" cy="6.4" r="0.75" fill="currentColor" opacity=".65"/>' +
    '<ellipse cx="13.6" cy="10.2" rx="2.2" ry="1.2" fill="#fff" opacity=".4" transform="rotate(-28 13.6 10.2)"/>' +
    "</svg>";

  function ensurePaintCursor() {
    var el = document.getElementById("landing-cursor");
    if (!el) {
      el = document.createElement("div");
      el.id = "landing-cursor";
      el.className = "landing-cursor landing-cursor--paint";
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = PAINT_SVG;
      document.body.appendChild(el);
      return el;
    }
    el.classList.add("landing-cursor--paint");
    if (!el.querySelector(".landing-cursor__paint")) {
      el.insertAdjacentHTML("beforeend", PAINT_SVG);
    }
    var dot = el.querySelector(".landing-cursor__dot");
    if (dot) dot.remove();
    return el;
  }

  var el = ensurePaintCursor();

  var mqReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mqReduceMotion.matches) {
    el.style.display = "none";
    return;
  }

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    el.style.display = "none";
    return;
  }

  var tipX = 13;
  var tipY = 13;
  var scheduled = false;
  var last = { x: 0, y: 0 };

  function stopCursorTracking() {
    el.style.display = "none";
    scheduled = false;
    document.removeEventListener("mousemove", move, { passive: true });
    document.removeEventListener("mouseenter", move, { passive: true });
  }

  function tick() {
    scheduled = false;
    if (mqReduceMotion.matches) {
      stopCursorTracking();
      return;
    }
    el.style.left = last.x - tipX + "px";
    el.style.top = last.y - tipY + "px";
    updateActive(last.x, last.y);
  }

  // Interactive targets turn the cursor green. The landing headline is
  // excluded — it keeps its own (black) treatment.
  var INTERACTIVE = "a[href], button, [role='button'], input, textarea, select, summary, [data-cursor-hover], .work-close, .theme-toggle, .work-phone-mockup, .work-project-hero__phone-screen--coupang, [tabindex]:not([tabindex='-1'])";
  var headlineMag = document.getElementById("landing-headline-mag");

  function updateActive(x, y) {
    var hit = document.elementFromPoint(x, y);
    if (!hit) {
      el.classList.remove("landing-cursor--active");
      return;
    }
    var interactive = hit.closest(INTERACTIVE) != null;
    var inHeadline = headlineMag && (hit === headlineMag || headlineMag.contains(hit));
    if (interactive && !inHeadline) {
      el.classList.add("landing-cursor--active");
    } else {
      el.classList.remove("landing-cursor--active");
    }
  }

  function move(e) {
    if (mqReduceMotion.matches) {
      stopCursorTracking();
      return;
    }
    last.x = e.clientX;
    last.y = e.clientY;
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(tick);
    }
  }

  document.addEventListener("mousemove", move, { passive: true });
  document.addEventListener("mouseenter", move, { passive: true });

  function onReduceMotionChange() {
    if (mqReduceMotion.matches) stopCursorTracking();
  }
  if (mqReduceMotion.addEventListener) {
    mqReduceMotion.addEventListener("change", onReduceMotionChange);
  } else if (mqReduceMotion.addListener) {
    mqReduceMotion.addListener(onReduceMotionChange);
  }
})();
