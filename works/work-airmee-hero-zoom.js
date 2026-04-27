(function () {
  var root = document.querySelector("[data-work-zoom]");
  if (!root || !window.PointerEvent) return;

  var inner = root.querySelector("[data-work-zoom-inner]");
  if (!inner) return;

  var btnIn = document.querySelector("[data-airmee-zoom-in]");
  var btnOut = document.querySelector("[data-airmee-zoom-out]");
  var btnReset = document.querySelector("[data-airmee-zoom-reset]");

  var scale = 1;
  var panX = 0;
  var panY = 0;
  var dragging = false;
  var lastX = 0;
  var lastY = 0;
  var pointerId = null;

  var minScale = 1;
  var maxScale = 4;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(n, lo, hi) {
    return Math.min(hi, Math.max(lo, n));
  }

  function getBounds() {
    var w = root.clientWidth;
    var h = root.clientHeight;
    return {
      w: w,
      h: h,
      minPanX: w * (1 - scale),
      minPanY: h * (1 - scale),
    };
  }

  function clampPan() {
    var b = getBounds();
    if (scale <= 1) {
      panX = 0;
      panY = 0;
      return;
    }
    panX = clamp(panX, b.minPanX, 0);
    panY = clamp(panY, b.minPanY, 0);
  }

  function apply() {
    clampPan();
    inner.style.transform = "translate(" + panX + "px," + panY + "px) scale(" + scale + ")";
    inner.style.transformOrigin = "0 0";
    root.classList.toggle("is-zoomed", scale > 1.001);
  }

  function zoomAtPoint(clientX, clientY, nextScale) {
    var rect = root.getBoundingClientRect();
    var mx = clientX - rect.left;
    var my = clientY - rect.top;
    var ns = clamp(nextScale, minScale, maxScale);
    if (ns === scale) return;

    var wx = (mx - panX) / scale;
    var wy = (my - panY) / scale;
    scale = ns;
    panX = mx - wx * scale;
    panY = my - wy * scale;
    if (scale <= 1) {
      panX = 0;
      panY = 0;
    }
    apply();
  }

  function onWheel(e) {
    if (reduceMotion) return;
    var rect = root.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return;
    }
    e.preventDefault();
    var factor = Math.exp(-e.deltaY * 0.0018);
    zoomAtPoint(e.clientX, e.clientY, scale * factor);
  }

  function onPointerDown(e) {
    if (e.button !== 0) return;
    if (e.target.closest(".work-visual__zoom-toolbar")) return;
    dragging = true;
    pointerId = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
    root.classList.add("is-dragging");
    try {
      root.focus({ preventScroll: true });
    } catch (err2) {}
    try {
      root.setPointerCapture(e.pointerId);
    } catch (err) {}
  }

  function onPointerMove(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    panX += dx;
    panY += dy;
    apply();
  }

  function onPointerUp(e) {
    if (e.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
    root.classList.remove("is-dragging");
    try {
      root.releasePointerCapture(e.pointerId);
    } catch (err) {}
  }

  function zoomStep(dir) {
    var rect = root.getBoundingClientRect();
    zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, scale * (dir > 0 ? 1.18 : 1 / 1.18));
  }

  function resetZoom() {
    scale = 1;
    panX = 0;
    panY = 0;
    apply();
  }

  root.addEventListener("wheel", onWheel, { passive: false });
  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("pointermove", onPointerMove);
  root.addEventListener("pointerup", onPointerUp);
  root.addEventListener("pointercancel", onPointerUp);

  if (btnIn) btnIn.addEventListener("click", function () { zoomStep(1); });
  if (btnOut) btnOut.addEventListener("click", function () { zoomStep(-1); });
  if (btnReset) btnReset.addEventListener("click", resetZoom);

  root.addEventListener("dblclick", function (e) {
    if (e.target.closest(".work-visual__zoom-toolbar")) return;
    resetZoom();
  });

  var fig = root.closest("figure");
  if (fig) {
    fig.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (!fig.contains(document.activeElement)) return;
      e.preventDefault();
      resetZoom();
    });
  }

  root.addEventListener("keydown", function (e) {
    if (e.target !== root) return;
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      zoomStep(1);
      return;
    }
    if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      zoomStep(-1);
      return;
    }
    if (e.key === "0") {
      e.preventDefault();
      resetZoom();
    }
  });

  window.addEventListener(
    "resize",
    function () {
      clampPan();
      apply();
    },
    { passive: true }
  );

  apply();
})();
