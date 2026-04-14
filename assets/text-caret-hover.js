(function () {
  'use strict';

  var main = document.querySelector('main.work-page');
  if (!main) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof document.caretRangeFromPoint !== 'function' && typeof document.caretPositionFromPoint !== 'function') {
    return;
  }

  /** @returns {Range|null} */
  function getCaretRangeFromPoint(x, y) {
    if (typeof document.caretRangeFromPoint === 'function') {
      try {
        return document.caretRangeFromPoint(x, y);
      } catch (e) {
        return null;
      }
    }
    var pos = document.caretPositionFromPoint(x, y);
    if (!pos || !pos.offsetNode) return null;
    var range = document.createRange();
    try {
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
      return range;
    } catch (err) {
      return null;
    }
  }

  /** @param {Range} range @returns {{ left: number, top: number, height: number }|null} */
  function getCaretBarMetrics(range) {
    if (!range) return null;
    if (!range.collapsed) {
      try {
        range = range.cloneRange();
        range.collapse(true);
      } catch (e) {
        return null;
      }
    }

    var rects = range.getClientRects();
    if (rects.length > 0) {
      var r = rects[rects.length - 1];
      if (r.height > 0) {
        return { left: r.left, top: r.top, height: r.height };
      }
    }

    var br = range.getBoundingClientRect();
    if (br.height > 0 && (br.width >= 0)) {
      return { left: br.left, top: br.top, height: br.height };
    }

    var sc = range.startContainer;
    var so = range.startOffset;
    if (sc.nodeType !== Node.TEXT_NODE) return null;

    var text = /** @type {Text} */ (sc);
    var clone = range.cloneRange();
    try {
      if (so < text.length) {
        clone.setEnd(text, so + 1);
      } else if (so > 0) {
        clone.setStart(text, so - 1);
        clone.setEnd(text, so);
      } else {
        return null;
      }
      var b = clone.getBoundingClientRect();
      if (b.height <= 0) return null;
      var left = so < text.length ? b.left : b.right;
      return { left: left, top: b.top, height: b.height };
    } catch (e2) {
      return null;
    }
  }

  function shouldHideForTarget(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return true;
    var el = /** @type {Element} */ (node);
    if (!main.contains(el)) return true;
    if (
      el.closest(
        'button, input, textarea, select, img, a.work-back, p.work-brand, .work-meta-pills, .work-meta-pill, [data-no-text-caret-hover]'
      )
    )
      return true;
    if (el.closest('svg')) return true;
    return false;
  }

  var el = document.createElement('div');
  el.className = 'text-caret-hover-indicator';
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);

  var scheduled = false;
  var last = { x: 0, y: 0 };

  function applyPosition(x, y) {
    var hit = document.elementFromPoint(x, y);
    if (!hit || !main.contains(hit)) {
      el.classList.remove('is-visible');
      return;
    }

    if (shouldHideForTarget(hit)) {
      el.classList.remove('is-visible');
      return;
    }

    var range = getCaretRangeFromPoint(x, y);
    if (!range) {
      el.classList.remove('is-visible');
      return;
    }

    var node = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      if (!main.contains(node.parentElement)) {
        el.classList.remove('is-visible');
        return;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (!main.contains(/** @type {Element} */ (node))) {
        el.classList.remove('is-visible');
        return;
      }
    }

    var metrics = getCaretBarMetrics(range);
    if (!metrics || metrics.height <= 0) {
      el.classList.remove('is-visible');
      return;
    }

    el.style.transform = 'translate3d(' + Math.round(metrics.left) + 'px,' + Math.round(metrics.top) + 'px,0)';
    el.style.height = Math.max(12, Math.round(metrics.height)) + 'px';
    el.classList.add('is-visible');
  }

  document.addEventListener(
    'mousemove',
    function (e) {
      last.x = e.clientX;
      last.y = e.clientY;
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(function () {
          scheduled = false;
          applyPosition(last.x, last.y);
        });
      }
    },
    { passive: true }
  );

  document.addEventListener(
    'mouseleave',
    function (e) {
      if (e.target === document.documentElement) {
        el.classList.remove('is-visible');
      }
    },
    true
  );

  main.addEventListener('mouseleave', function () {
    el.classList.remove('is-visible');
  });
})();
