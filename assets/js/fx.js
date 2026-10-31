(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var bar = document.getElementById("progBar"), car = document.getElementById("progCar"), hd = document.querySelector("header");
  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight, p = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = p + "%"; if (car) car.style.left = p + "%";
    if (hd) hd.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (reduce || !("IntersectionObserver" in window)) return;
  var els = document.querySelectorAll(".head,.svc,.stat,.step,.why li,.carwrap,.dots,.info,.est-right,.custom,.item");
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (el, i) {
    el.classList.add("rv");
    var sibs = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
    el.style.transitionDelay = Math.min(sibs, 8) * 60 + "ms"; io.observe(el);
  });
})();
