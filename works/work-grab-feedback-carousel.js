(function () {
  function initCarousel(root) {
    var track = root.querySelector("[data-grab-feedback-carousel-track]");
    var slides = root.querySelectorAll(".work-grab-feedback-carousel__slide");
    var prevButton = root.querySelector("[data-grab-feedback-carousel-prev]");
    var nextButton = root.querySelector("[data-grab-feedback-carousel-next]");
    var status = root.querySelector("[data-grab-feedback-carousel-status]");

    if (!track || !slides.length || !prevButton || !nextButton || !status) return;

    var index = 0;
    var total = slides.length;

    function render() {
      track.style.transform = "translateX(" + index * -100 + "%)";
      status.textContent = String(index + 1) + " / " + String(total);
      prevButton.disabled = index <= 0;
      nextButton.disabled = index >= total - 1;

      slides.forEach(function (slide, i) {
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
    }

    prevButton.addEventListener("click", function () {
      if (index <= 0) return;
      index -= 1;
      render();
    });

    nextButton.addEventListener("click", function () {
      if (index >= total - 1) return;
      index += 1;
      render();
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevButton.click();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nextButton.click();
      }
    });

    render();
  }

  function boot() {
    var carousels = document.querySelectorAll("[data-grab-feedback-carousel]");
    if (!carousels.length) return;
    carousels.forEach(initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
