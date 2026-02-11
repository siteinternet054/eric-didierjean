document.documentElement.classList.add("js");
(() => {
  // Header scroll (fond plus opaque au scroll)
  const header = document.getElementById("header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const navMenu = document.getElementById("nav-menu");
  const hamburger = document.getElementById("hamburger");
  const backdrop = document.getElementById("nav-backdrop");

  let navOpen = false;

  const setNavOpen = (open) => {
    navOpen = open;

    if (navMenu) navMenu.classList.toggle("is-open", open);
    if (backdrop) backdrop.classList.toggle("is-open", open);

    if (hamburger) hamburger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => setNavOpen(!navOpen));

    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setNavOpen(!navOpen);
      }
    });

    if (backdrop) backdrop.addEventListener("click", () => setNavOpen(false));

    navMenu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link) setNavOpen(false);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) setNavOpen(false);
    });
  }

  // Reveal animations
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // Portfolio filters
  const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));

  const applyFilter = (filter) => {
    galleryItems.forEach((item) => {
      const match = item.classList.contains(filter);
      item.classList.toggle("is-hidden", !match);
    });
  };

  if (filterBtns.length && galleryItems.length) {
    const setActiveBtn = (btn) => {
      filterBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-pressed", String(isActive));
      });
    };

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        if (!filter) return;
        setActiveBtn(btn);
        applyFilter(filter);
      });
    });

    // Appliquer le filtre au chargement selon le bouton actif (important)
    const initial = filterBtns.find((b) => b.classList.contains("active")) || filterBtns[0];
    if (initial) {
      setActiveBtn(initial);
      applyFilter(initial.dataset.filter);
    }
  }

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector(".lightbox-img");
    const lbClose = lightbox.querySelector(".lightbox-close");
    const lbCaption = lightbox.querySelector(".lightbox-caption");
    const btnPrev = lightbox.querySelector('[data-lb="prev"]');
    const btnNext = lightbox.querySelector('[data-lb="next"]');

    const labels = {
      mariage: "Mariage",
      portrait: "Portrait",
      event: "Événementiel",
      animaux: "Animaux",
      paysage: "Paysage",
    };

    let visibleImages = [];
    let currentIndex = 0;

    const getVisibleImages = () =>
      Array.from(document.querySelectorAll(".gallery-item:not(.is-hidden) img"));

    const getCategoryLabel = (imgEl) => {
      const item = imgEl.closest(".gallery-item");
      if (!item) return "";
      const key = Object.keys(labels).find((k) => item.classList.contains(k));
      return key ? labels[key] : "";
    };

    const setImage = (imgEl) => {
      if (!lbImg) return;
      lbImg.src = imgEl.src;
      lbImg.alt = imgEl.alt || "";
      if (lbCaption) lbCaption.textContent = getCategoryLabel(imgEl);
    };

    const openLightboxAt = (imgEl) => {
      visibleImages = getVisibleImages();
      currentIndex = Math.max(0, visibleImages.indexOf(imgEl));
      setImage(visibleImages[currentIndex]);

      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      if (lbImg) lbImg.src = "";
    };

    const go = (dir) => {
      if (!visibleImages.length) return;
      currentIndex = (currentIndex + dir + visibleImages.length) % visibleImages.length;
      setImage(visibleImages[currentIndex]);
    };

    // Click sur image
    const allGalleryImgs = Array.from(document.querySelectorAll(".gallery-item img"));
    allGalleryImgs.forEach((img) => {
      img.addEventListener("click", () => openLightboxAt(img));
    });

    // Close
    if (lbClose) lbClose.addEventListener("click", closeLightbox);

    // Click hors contenu = fermer
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Prev/Next
    if (btnPrev) btnPrev.addEventListener("click", () => go(-1));
    if (btnNext) btnNext.addEventListener("click", () => go(+1));

    // Clavier
    window.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(+1);
    });
  }
})();
