(function () {
  function decodePrivate(el) {
    var raw = el.getAttribute("data-private");
    if (!raw) return;
    el.textContent = raw.split(",").map(function (code) {
      return String.fromCharCode(Number(code));
    }).join("");
  }

  document.querySelectorAll("[data-private]").forEach(decodePrivate);
})();
