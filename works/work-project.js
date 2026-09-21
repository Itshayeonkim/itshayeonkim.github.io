(function () {
  var identity = document.getElementById("work-project-identity");
  var hero = document.querySelector(".work-project-hero");
  if (!identity || !hero) return;
  function sync() {
    var past = window.scrollY > hero.offsetHeight * 0.65;
    identity.classList.toggle("is-scrolled", past);
  }
  window.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  sync();
})();
