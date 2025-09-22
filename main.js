// ===== GLOBAL VARIABLES =====
let currentSlide = 0;
let totalSlides = 0;
let autoSlideInterval;
let isScrolling = false;

// ===== DOM ELEMENTS =====
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const sections = document.querySelectorAll(".section");
const carouselTrack = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const carouselIndicators = document.getElementById("carouselIndicators");

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupCarousel();
  setupCountdown();
  setupScrollEffects();
  setupTypingAnimation();
  setupParticles();
  setupKeyboardNavigation();

  // Show home section initially
  showSection("home");
}

// ===== NAVIGATION =====
function setupNavigation() {
  // Mobile menu toggle
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute("data-section");
      showSection(targetSection);

      // Close mobile menu
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Scroll effects for navbar
  window.addEventListener("scroll", handleNavbarScroll);
}

function handleNavbarScroll() {
  const scrollY = window.scrollY;

  if (scrollY > 50) {
    navbar.classList.add("scrolled");

    // Search mode effect when scrolling
    if (scrollY > 200) {
      navbar.classList.add("search-mode");
      // Change logo text to "Turminha do Cricas" when in search mode
      const logoText = document.querySelector(".logo-text");
      if (logoText && logoText.textContent !== "Turminha do Cricas") {
        logoText.textContent = "Turminha do Cricas";
      }
    } else {
      navbar.classList.remove("search-mode");
      // Restore original logo text
      const logoText = document.querySelector(".logo-text");
      if (logoText && logoText.textContent !== "Turma do Cricas") {
        logoText.textContent = "Turma do Cricas";
      }
    }
  } else {
    navbar.classList.remove("scrolled", "search-mode");
    // Restore original logo text
    const logoText = document.querySelector(".logo-text");
    if (logoText && logoText.textContent !== "Turma do Cricas") {
      logoText.textContent = "Turma do Cricas";
    }
  }
}

function showSection(sectionId) {
  // Hide all sections
  sections.forEach((section) => {
    section.classList.remove("active");
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Update active nav link
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === sectionId) {
      link.classList.add("active");
    }
  });

  // Scroll to top of section
  targetSection.scrollIntoView({ behavior: "smooth" });
}

// ===== CAROUSEL =====
function setupCarousel() {
  if (!carouselTrack) return;

  const memberCards = carouselTrack.querySelectorAll(".member-card");
  totalSlides = memberCards.length;

  if (totalSlides === 0) return;

  // Create indicators
  createCarouselIndicators();

  // Set initial position
  updateCarouselPosition();

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      previousSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
    });
  }

  // Auto-slide functionality
  startAutoSlide();

  // Pause auto-slide on hover
  const carouselContainer = document.querySelector(".carousel-container");
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stopAutoSlide);
    carouselContainer.addEventListener("mouseleave", startAutoSlide);
  }
}

function createCarouselIndicators() {
  if (!carouselIndicators) return;

  carouselIndicators.innerHTML = "";

  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement("div");
    indicator.classList.add("indicator");
    if (i === 0) indicator.classList.add("active");

    indicator.addEventListener("click", () => {
      currentSlide = i;
      updateCarouselPosition();
      updateIndicators();
    });

    carouselIndicators.appendChild(indicator);
  }
}

function updateCarouselPosition() {
  if (!carouselTrack) return;

  const slideWidth = 320; // 300px card width + 20px gap
  const offset = -currentSlide * slideWidth;
  carouselTrack.style.transform = `translateX(${offset}px)`;
}

function updateIndicators() {
  const indicators = carouselIndicators.querySelectorAll(".indicator");
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarouselPosition();
  updateIndicators();
}

function previousSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarouselPosition();
  updateIndicators();
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideInterval = setInterval(nextSlide, 4000); // 4 seconds
}

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

function setupCountdown() {
  // Define a data alvo para 15 de novembro do ano atual.
  const today = new Date();
  const targetYear = today.getFullYear();
  // Os meses em JavaScript são baseados em zero (0 = Janeiro, 10 = Novembro).
  const targetDate = new Date(targetYear, 10, 15, 0, 0, 0).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Seleciona os elementos do DOM
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const countdownMessageEl = document.querySelector(".countdown-message p");

    if (distance < 0) {
      // Se a data já passou, exibe zeros e uma mensagem de evento encerrado.
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      if (countdownMessageEl) {
        countdownMessageEl.textContent =
          "A NP2 já aconteceu! Prepare-se para a próxima.";
      }
      clearInterval(countdownInterval); // Para a atualização do contador
      return;
    }

    // Calcula o tempo restante
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Atualiza o HTML com os valores formatados
    daysEl.textContent = days.toString().padStart(2, "0");
    hoursEl.textContent = hours.toString().padStart(2, "0");
    minutesEl.textContent = minutes.toString().padStart(2, "0");
    secondsEl.textContent = seconds.toString().padStart(2, "0");

    // Atualiza a mensagem da contagem
    if (countdownMessageEl) {
      countdownMessageEl.textContent = `A NP2 acontecerá no dia 15 de Novembro de ${targetYear}.`;
    }
  }

  // Atualiza a contagem imediatamente e depois a cada segundo
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
}

// ===== SCROLL EFFECTS =====
function setupScrollEffects() {
  // Smooth scroll reveal for sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Parallax effect for floating elements
  window.addEventListener("scroll", () => {
    if (isScrolling) return;

    isScrolling = true;
    requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".floating-icon");

      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.1;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${
          scrolled * 0.1
        }deg)`;
      });

      isScrolling = false;
    });
  });
}

// ===== TYPING ANIMATION =====
function setupTypingAnimation() {
  const typingElement = document.getElementById("typingText");
  if (!typingElement) return;

  const texts = [
    "Ranking NP1 2025",
    "Apostas & Diversão",
    "Bar do Cricas",
    "Quem vai pagar?",
    "Turma do Cricas",
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeText() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500; // Pause before next text
    }

    setTimeout(typeText, typeSpeed);
  }

  typeText();
}

// ===== PARTICLES =====
function setupParticles() {
  createFloatingParticles();
}

function createFloatingParticles() {
  const particleCount = 20;
  const body = document.body;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "floating-particle";
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: rgba(0, 255, 65, 0.3);
      border-radius: 50%;
      pointer-events: none;
      z-index: -1;
      left: ${Math.random() * 100}vw;
      top: ${Math.random() * 100}vh;
      animation: floatParticle ${10 + Math.random() * 20}s linear infinite;
      animation-delay: ${Math.random() * 10}s;
    `;

    body.appendChild(particle);
  }

  // Add CSS animation for particles
  if (!document.getElementById("particle-styles")) {
    const style = document.createElement("style");
    style.id = "particle-styles";
    style.textContent = `
      @keyframes floatParticle {
        0% {
          transform: translateY(100vh) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== KEYBOARD NAVIGATION =====
function setupKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "1":
        showSection("home");
        break;
      case "2":
        showSection("ranking");
        break;
      case "3":
        showSection("members");
        break;
      case "4":
        showSection("rules");
        break;
      case "5":
        showSection("countdown");
        break;
      case "ArrowLeft":
        if (document.getElementById("members").classList.contains("active")) {
          e.preventDefault();
          previousSlide();
        }
        break;
      case "ArrowRight":
        if (document.getElementById("members").classList.contains("active")) {
          e.preventDefault();
          nextSlide();
        }
        break;
      case "Escape":
        // Close mobile menu
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
        break;
    }
  });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounced scroll handler
const debouncedScrollHandler = debounce(handleNavbarScroll, 10);
window.addEventListener("scroll", debouncedScrollHandler);

// Preload images
function preloadImages() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    const imageUrl = img.src;
    const preloadImg = new Image();
    preloadImg.src = imageUrl;
  });
}

// Initialize preloading when DOM is ready
document.addEventListener("DOMContentLoaded", preloadImages);

// ===== ACCESSIBILITY =====
// Focus management for keyboard users
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation");
  }
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-navigation");
});

// ===== ERROR HANDLING =====
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error);
});

// ===== RESIZE HANDLER =====
window.addEventListener(
  "resize",
  debounce(() => {
    updateCarouselPosition();
  }, 250)
);

// ===== VISIBILITY CHANGE =====
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoSlide();
  } else {
    startAutoSlide();
  }
});
