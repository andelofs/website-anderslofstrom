// anderslofstrom.com - menu on small screens and a simple image viewer. No tracking.
(function () {
  var body = document.body;
  var burger = document.querySelector(".hamburger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Stäng menyn" : "Öppna menyn");
    });
  }

  var grid = document.querySelector("[data-gallery]");
  if (!grid) return;
  var links = Array.prototype.slice.call(grid.querySelectorAll("a.grid-item"));
  var index = 0;

  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML = '<img alt=""><button class="lb-close" type="button" aria-label="Stäng">&times;</button>' +
    '<button class="lb-prev" type="button" aria-label="Föregående bild">&#8249;</button>' +
    '<button class="lb-next" type="button" aria-label="Nästa bild">&#8250;</button><div class="lb-count"></div>';
  body.appendChild(box);
  var img = box.querySelector("img");
  var count = box.querySelector(".lb-count");

  function show(i) {
    index = (i + links.length) % links.length;
    var a = links[index];
    img.src = a.getAttribute("href");
    img.alt = a.querySelector("img").alt;
    count.textContent = (index + 1) + " / " + links.length;
  }
  function open(i) { show(i); box.classList.add("open"); body.style.overflow = "hidden"; }
  function close() { box.classList.remove("open"); body.style.overflow = ""; }

  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) { e.preventDefault(); open(i); });
  });
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  box.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // swipe on phones
  var startX = null;
  box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
