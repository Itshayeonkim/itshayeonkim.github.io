(function () {
  var el = document.getElementById("landing-cursor");
  if (!el) return;

  var mqReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mqReduceMotion.matches) {
    el.style.display = "none";
    return;
  }

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    el.style.display = "none";
    return;
  }

  function caretRangeFromPoint(x, y) {
    if (typeof document.caretRangeFromPoint === "function") {
      try {
        return document.caretRangeFromPoint(x, y);
      } catch (err) {
        return null;
      }
    }
    var pos = document.caretPositionFromPoint && document.caretPositionFromPoint(x, y);
    if (!pos || !pos.offsetNode) return null;
    var range = document.createRange();
    try {
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
      return range;
    } catch (e) {
      return null;
    }
  }

  /** True when pointer is over selectable body copy (same idea as text-caret-hover.js) */
  function isOverText(clientX, clientY) {
    var hit = document.elementFromPoint(clientX, clientY);
    if (!hit) return false;
    var workMain = document.querySelector("main.work-page");
    var minimalMain = document.querySelector("main.page--minimal");
    var container = null;
    if (workMain && workMain.contains(hit)) container = workMain;
    else if (minimalMain && minimalMain.contains(hit)) container = minimalMain;
    else return false;
    /* Home: no green caret script — hiding the dot on “text” made the cursor vanish here */
    if (
      minimalMain &&
      minimalMain.contains(hit) &&
      hit.closest(".landing-bio, .works-showcase, #works")
    ) {
      return false;
    }
    if (
      hit.closest(
        "button, input, textarea, select, img, a.work-back, p.work-brand, .work-meta-pills, .work-meta-pill, [data-no-text-caret-hover]"
      )
    ) {
      return false;
    }
    if (hit.closest("svg")) return false;
    var range = caretRangeFromPoint(clientX, clientY);
    if (!range) return false;
    var n = range.startContainer;
    if (n.nodeType === 3) {
      return !!(n.parentElement && container.contains(n.parentElement));
    }
    if (n.nodeType === 1 && container.contains(n)) return true;
    return false;
  }

  var half = 3;
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
    var x = last.x;
    var y = last.y;
    el.style.left = x - half + "px";
    el.style.top = y - half + "px";
    el.classList.toggle("landing-cursor--text-hover", isOverText(x, y));
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
