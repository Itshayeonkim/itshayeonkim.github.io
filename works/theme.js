(function () {
  var STORAGE_KEY = "kr-apps-benchmark-theme";
  var root = document.documentElement;
  try {
    var v = localStorage.getItem(STORAGE_KEY);
    root.setAttribute("data-theme", v === "light" || v === "dark" ? v : "dark");
  } catch (e) {
    root.setAttribute("data-theme", "dark");
  }
  function bindToggle() {
    var btn = document.getElementById("theme-toggle");
    function syncToggle() {
      if (!btn) return;
      var isLight = (root.getAttribute("data-theme") || "dark") === "light";
      btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      btn.setAttribute("aria-pressed", isLight ? "true" : "false");
    }
    if (btn) {
      btn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        root.setAttribute("data-theme", next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {}
        syncToggle();
      });
    }
    syncToggle();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindToggle);
  } else {
    bindToggle();
  }
})();
