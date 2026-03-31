(function () {
  var root = document.querySelector(".work-final");
  if (!root) return;

  var articles = function () {
    return root.querySelectorAll(".work-final-chapter");
  };

  var mq = window.matchMedia("(min-width: 768px)");
  var raf = 0;

  function equalize() {
    var list = articles();
    if (!list.length) return;

    list.forEach(function (el) {
      el.style.minHeight = "";
    });

    if (!mq.matches) return;

    var max = 0;
    list.forEach(function (el) {
      var h = el.getBoundingClientRect().height;
      if (h > max) max = h;
    });
    list.forEach(function (el) {
      el.style.minHeight = max + "px";
    });
  }

  function schedule() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(equalize);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule);
  } else {
    schedule();
  }

  window.addEventListener("load", schedule);
  window.addEventListener("resize", schedule);
  mq.addEventListener("change", schedule);

  root.querySelectorAll("img").forEach(function (img) {
    if (img.complete) return;
    img.addEventListener("load", schedule, { once: true });
    img.addEventListener("error", schedule, { once: true });
  });

  root.querySelectorAll("video").forEach(function (video) {
    if (video.readyState >= 1) return;
    video.addEventListener("loadeddata", schedule, { once: true });
    video.addEventListener("error", schedule, { once: true });
  });
})();
