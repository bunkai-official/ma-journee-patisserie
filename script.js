document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (header && navToggle) {
    const closeMenu = () => {
      document.body.classList.remove("is-menu-open");
      header.classList.remove("is-nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = !document.body.classList.contains("is-menu-open");
      document.body.classList.toggle("is-menu-open", isOpen);
      header.classList.toggle("is-nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".site-nav a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  if (header) {
    const updateHeaderState = () => {
      header.classList.toggle("scrolled", window.scrollY > 60);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  if (!reduceMotion && "Lenis" in window) {
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }

  if (reduceMotion) {
    document.querySelectorAll("video[autoplay]").forEach((video) => {
      video.pause();
      video.removeAttribute("autoplay");
    });
  }

  const heroSlides = [...document.querySelectorAll("[data-hero-slide]")];
  const heroDots = [...document.querySelectorAll("[data-hero-dot]")];

  if (heroSlides.length > 1) {
    let activeSlide = 0;
    let slideTimer;

    const showSlide = (index) => {
      activeSlide = index;
      heroSlides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeSlide;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });
      heroDots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeSlide;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
      });
    };

    const startSlider = () => {
      if (reduceMotion) return;
      window.clearInterval(slideTimer);
      slideTimer = window.setInterval(() => {
        showSlide((activeSlide + 1) % heroSlides.length);
      }, 5200);
    };

    heroDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        showSlide(Number(dot.dataset.heroDot));
        startSlider();
      });
    });

    showSlide(0);
    startSlider();
  }

  const filters = document.querySelectorAll("[data-news-filter]");
  const newsItems = document.querySelectorAll("[data-news-category]");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.newsFilter;
      filters.forEach((button) => button.setAttribute("aria-pressed", "false"));
      filter.setAttribute("aria-pressed", "true");

      newsItems.forEach((item) => {
        const shouldShow = category === "all" || item.dataset.newsCategory === category;
        item.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  const reservationDate = document.querySelector("[data-reservation-date]");
  if (reservationDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const localTomorrow = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    reservationDate.min = localTomorrow;
  }

  const targets = document.querySelectorAll(".fade-in, .js-fade-up");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((target) => observer.observe(target));
});
