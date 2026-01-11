/**
 * Theme initialization and toggle functionality
 */

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored) {
    return stored;
  }
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function setTheme(theme: Theme): void {
  if (document.body) {
    document.body.setAttribute("data-theme", theme);
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme(): void {
  const current = document.body.getAttribute("data-theme") as Theme;
  const next: Theme = current === "dark" ? "light" : "dark";
  setTheme(next);
}

function initTheme(): void {
  if (document.body) {
    setTheme(getPreferredTheme());
  }
}

/**
 * Carousel auto-slide functionality
 */

function initCarousel(): void {
  const carousel = document.getElementById("hero-carousel");
  if (!carousel) return;

  const slides = carousel.querySelectorAll<HTMLElement>(".carousel-slide");
  const dots = carousel.querySelectorAll<HTMLElement>(".carousel-dot");
  if (slides.length === 0) return;

  let currentIndex = 0;
  const intervalMs = 5000; // 5 seconds per slide

  function showSlide(index: number): void {
    // Wrap around
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentIndex = index;
  }

  function nextSlide(): void {
    showSlide(currentIndex + 1);
  }

  // Auto-slide
  let timer = setInterval(nextSlide, intervalMs);

  // Click handlers for dots
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.dataset.index ?? "0", 10);
      showSlide(index);
      // Reset timer on manual navigation
      clearInterval(timer);
      timer = setInterval(nextSlide, intervalMs);
    });
  });

  // Pause on hover
  carousel.addEventListener("mouseenter", () => {
    clearInterval(timer);
  });

  carousel.addEventListener("mouseleave", () => {
    timer = setInterval(nextSlide, intervalMs);
  });
}

function attachHandler(): void {
  initTheme();
  initCarousel();

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", toggleTheme);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attachHandler);
} else {
  attachHandler();
}
