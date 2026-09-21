(function () {
  'use strict';

  var main = document.querySelector('main.work-page');
  if (!main) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // CSS Custom Highlight API (Chrome 105+, Safari 17.2+, Firefox 140+).
  if (!('highlights' in CSS)) return;
  if (
    typeof document.caretRangeFromPoint !== 'function' &&
    typeof document.caretPositionFromPoint !== 'function'
  ) {
    return;
  }

  var HIGHLIGHT_NAME = 'text-hover';
  var LINGER_MS = 2000;

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

  /** Expand a caret position in a text node to the surrounding non-whitespace
      word (Latin) or a short CJK run. @returns {Range|null} */
  function wordRangeAt(caretRange) {
    var node = caretRange.startContainer;
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    var text = node.data;
    if (!text) return null;
    var so = caretRange.startOffset;

    var isWordChar = function (ch) {
      if (!ch) return false;
      // letters, digits, combining marks, and CJK ideographs/hangul/kana
      var code = ch.charCodeAt(0);
      return (
        /[A-Za-z0-9]/.test(ch) ||
        (code >= 0x300 && code <= 0x36f) ||
        (code >= 0xac00 && code <= 0xd7a3) || // Hangul syllables
        (code >= 0x1100 && code <= 0x11ff) || // Hangul jamo
        (code >= 0x3040 && code <= 0x30ff) || // Hiragana/Katakana
        (code >= 0x3400 && code <= 0x9fff) // CJK ideographs
      );
    };

    var s = so;
    while (s > 0 && isWordChar(text[s - 1])) s--;
    var e = so;
    while (e < text.length && isWordChar(text[e])) e++;
    if (e <= s) return null;

    var r = document.createRange();
    try {
      r.setStart(node, s);
      r.setEnd(node, e);
    } catch (err) {
      return null;
    }
    return r;
  }

  function shouldHideForTarget(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return true;
    var el = /** @type {Element} */ (node);
    if (!main.contains(el)) return true;
    if (
      el.closest(
        'button, input, textarea, select, img, summary, a.work-back, p.work-brand, .work-meta-pills, .work-meta-pill, [data-no-text-caret-hover]'
      )
    )
      return true;
    if (el.closest('svg')) return true;
    return false;
  }

  var highlight = new Highlight();
  CSS.highlights.set(HIGHLIGHT_NAME, highlight);

  var hideTimer = null;
  var scheduled = false;
  var last = { x: 0, y: 0 };

  function clearHighlight() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    highlight.clear();
  }

  function scheduleClear() {
    if (hideTimer) return; // already counting down
    hideTimer = setTimeout(function () {
      hideTimer = null;
      highlight.clear();
    }, LINGER_MS);
  }

  function applyAt(x, y) {
    var hit = document.elementFromPoint(x, y);
    if (!hit || !main.contains(hit) || shouldHideForTarget(hit)) {
      // Cursor left text: let the last highlight linger, then clear after 2s.
      scheduleClear();
      return;
    }

    var range = getCaretRangeFromPoint(x, y);
    if (!range) {
      scheduleClear();
      return;
    }

    var node = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      if (!main.contains(node.parentElement)) {
        scheduleClear();
        return;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (!main.contains(/** @type {Element} */ (node))) {
        scheduleClear();
        return;
      }
    }

    var wr = wordRangeAt(range);
    if (!wr) {
      scheduleClear();
      return;
    }

    // Over text: cancel any pending clear, paint the current word.
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    highlight.clear();
    highlight.add(wr);
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
          applyAt(last.x, last.y);
        });
      }
    },
    { passive: true }
  );

  main.addEventListener('mouseleave', function () {
    scheduleClear();
  });

  document.addEventListener(
    'mouseleave',
    function (e) {
      if (e.target === document.documentElement) {
        scheduleClear();
      }
    },
    true
  );

  // Clean up when the page is hidden.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearHighlight();
  });
})();
