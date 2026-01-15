gsap.registerPlugin(ScrollTrigger);

// ========== УТИЛИТЫ ==========
const qs = (selector, context = document) => context.querySelector(selector);
const qsa = (selector, context = document) => Array.from(context.querySelectorAll(selector));

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ========== СНЕЖИНКИ ==========
function createSnowflakes() {
  const container = document.getElementById("snowflakes");
  if (!container) return;

  const snowflakes = ["❄", "⛄", "✦", "◆", "✧"];
  const fragmentCount = 50;

  for (let i = 0; i < fragmentCount; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
    snowflake.style.left = Math.random() * 100 + "%";
    snowflake.style.animation = `snowfall ${
      Math.random() * 15 + 15
    }s linear infinite`;
    snowflake.style.animationDelay = Math.random() * 5 + "s";
    snowflake.style.top = Math.random() * 100 - 100 + "px";
    container.appendChild(snowflake);
  }
}

// ========== НАВИГАЦИЯ ==========
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", hamburger.classList.contains("active"));
  });

  // Закрытие меню при клике на ссылку
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// ========== ПРОКРУТКА К ВЕРХУ ==========
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Добавить обработчик к логотипу
const logo = document.querySelector(".logo");
if (logo) {
  logo.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      scrollToTop();
    }
  });
}

// ========== BACK TO TOP BUTTON ==========
function initBackToTop() {
  const backToTop = document.getElementById("backToTop");
  if (!backToTop) return;

  const images = document.querySelectorAll(".animated-image");
  let animationId = null;
  let direction = 1;
  let currentOffset = 0;
  const maxOffset = 15;
  const animationSpeed = 0.4;

  function handleScroll() {
    if (window.pageYOffset > 500) {
      backToTop.style.display = "flex";
      if (!animationId) {
        startAnimation();
      }
    } else {
      backToTop.style.display = "none";
      stopAnimation();
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Поддержка клавиатуры
  backToTop.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      scrollToTop();
    }
  });

  function startAnimation() {
    if (prefersReducedMotion()) return;

    function animate() {
      currentOffset += direction * animationSpeed;

      if (Math.abs(currentOffset) >= maxOffset) {
        direction *= -1;
        currentOffset = Math.sign(currentOffset) * maxOffset;
      }

      images[0].style.transform = `translateY(${currentOffset}px)`;
      images[2].style.transform = `translateY(${currentOffset}px)`;
      images[1].style.transform = `translateY(${-currentOffset}px)`;
      images[3].style.transform = `translateY(${-currentOffset}px)`;

      animationId = requestAnimationFrame(animate);
    }

    animate();
  }

  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    images.forEach((img) => {
      img.style.transform = "translateY(0px)";
    });
    currentOffset = 0;
    direction = 1;
  }

  // Инициализация при загрузке
  if (window.pageYOffset > 500) {
    backToTop.style.display = "flex";
    startAnimation();
  }
}

// ========== АНИМАЦИИ ПРИ ЗАГРУЗКЕ ==========
window.addEventListener("load", function () {
  if (!prefersReducedMotion()) {
    createSnowflakes();

    // Анимация героя
    gsap.from(".hero-content h1", {
      duration: 1.2,
      opacity: 0,
      y: 50,
      ease: "power3.out",
    });

    gsap.from(".hero-content p", {
      duration: 1.2,
      opacity: 0,
      y: 30,
      delay: 0.2,
      ease: "power3.out",
    });

    gsap.from(".cta-button", {
      duration: 1.2,
      opacity: 0,
      scale: 0.8,
      delay: 0.4,
      ease: "power3.out",
    });

    gsap.from(".live-report", {
      duration: 0.8,
      opacity: 0,
      scale: 0.8,
      delay: 0.1,
      ease: "back.out",
    });

    // Анимация section titles
    gsap.utils.toArray(".section-title").forEach((title) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
      });
    });

    // Анимация фото-карточек
    gsap.utils.toArray(".photo-card").forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: index * 0.1,
      });
    });

    // Анимация текстовых секций
    gsap.utils.toArray(".content-text p").forEach((p, index) => {
      gsap.from(p, {
        scrollTrigger: {
          trigger: p,
          start: "top 85%",
        },
        opacity: 0,
        x: -30,
        duration: 0.8,
        delay: index * 0.05,
      });
    });
  }

  // Инициализация других компонентов
  initBackToTop();
  initProjectsCarousel();
});

// ========== ВИКТОРИНА ==========
let currentQuestion = 0;
let score = 0;
const totalQuestions = 5;

const totalQuestionsEl = document.getElementById("totalQuestions");
if (totalQuestionsEl) {
  totalQuestionsEl.textContent = totalQuestions;
}

function checkAnswer(element, isCorrect) {
  const options = element.parentElement.querySelectorAll(".quiz-option");
  options.forEach((opt) => (opt.style.pointerEvents = "none"));

  if (isCorrect) {
    element.classList.add("correct");
    score++;
    element.textContent += " ✓";
  } else {
    element.classList.add("incorrect");
    element.textContent += " ✗";
    
    // Показываем правильный ответ
    options.forEach((opt) => {
      if (opt.classList.contains("correct")) {
        opt.style.opacity = "1";
      } else if (opt !== element) {
        opt.style.opacity = "0.3";
      }
    });
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < totalQuestions) {
      document.getElementById("currentQuestion").textContent = currentQuestion + 1;
      
      const questions = qsa(".quiz-question");
      questions[currentQuestion].classList.add("active");
      questions[currentQuestion - 1].classList.remove("active");
    } else {
      showResults();
    }
  }, 1500);
}

function showResults() {
  const percentage = Math.round((score / totalQuestions) * 100);
  const finalScoreEl = document.getElementById("finalScore");
  const resultTextEl = document.getElementById("resultText");

  if (finalScoreEl) finalScoreEl.textContent = percentage + "%";

  let resultText = "";
  if (percentage === 100) {
    resultText = "🎉 Отлично! Вы истинный знаток колядных традиций!";
  } else if (percentage >= 80) {
    resultText = "👏 Хорошо! Вы хорошо знаете традиции Коляды!";
  } else if (percentage >= 60) {
    resultText = "😊 Неплохо! Вы знакомы с колядными обычаями.";
  } else if (percentage >= 40) {
    resultText = "📖 Стоит узнать больше о Коляде!";
  } else {
    resultText = "🎄 Рекомендуем прочитать текст еще раз!";
  }

  if (resultTextEl) resultTextEl.textContent = resultText;

  qsa(".quiz-question").forEach((q) => q.classList.remove("active"));
  const resultEl = qs(".quiz-result");
  if (resultEl) resultEl.classList.add("active");
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  
  const currentQEl = document.getElementById("currentQuestion");
  if (currentQEl) currentQEl.textContent = "1";

  qsa(".quiz-question").forEach((q, i) => {
    if (i === 0) {
      q.classList.add("active");
    } else {
      q.classList.remove("active");
    }

    q.querySelectorAll(".quiz-option").forEach((opt) => {
      opt.classList.remove("correct", "incorrect");
      opt.style.pointerEvents = "auto";
      opt.style.opacity = "1";
      const originalText = opt.textContent.replace(" ✓", "").replace(" ✗", "");
      opt.textContent = originalText;
    });
  });

  const resultEl = qs(".quiz-result");
  if (resultEl) resultEl.classList.remove("active");
}

// ========== PROJECTS CAROUSEL ==========
function initProjectsCarousel() {
  const viewport = qs(".projects-viewport");
  if (!viewport) return;

  const stage = qs(".projects-stage", viewport);
  if (!stage) return;

  const cards = qsa(".project-card", stage);
  if (!cards.length) return;

  let i = 0;
  let timer = null;

  const interval = +(viewport.dataset.interval || 5000);
  const autoplay = viewport.dataset.autoplay !== "false";
  const reduce = prefersReducedMotion();

  const show = (idx) => {
    i = (idx + cards.length) % cards.length;
    cards.forEach((c, k) => c.classList.toggle("is-active", k === i));
  };

  const next = () => show(i + 1);
  const prev = () => show(i - 1);

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const play = () => {
    if (reduce || !autoplay) return;
    stop();
    timer = setInterval(next, interval);
  };

  show(0);
  play();

  // Наведение мышью останавливает автоматический поворот
  viewport.addEventListener("mouseenter", stop);
  viewport.addEventListener("mouseleave", play);
}

// ========== АНАЛИТИКА ==========
window.addEventListener("load", () => {
  setTimeout(loadYandexMetrika, 3000);
  setTimeout(loadGTM, 4000);
});

function loadYandexMetrika() {
  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    (k = e.createElement(t)),
      (a = e.getElementsByTagName(t)[0]),
      (k.async = 1),
      (k.src = r),
      a.parentNode.insertBefore(k, a);
  })(
    window,
    document,
    "script",
    "https://mc.yandex.ru/metrika/tag.js",
    "ym"
  );

  ym(16707172, "init", {
    webvisor: true,
    clickmap: true,
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

function loadGTM() {
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", "GTM-KRVNNK");
}

// Инициализация при готовности DOM
document.addEventListener('DOMContentLoaded', function() {
  // Основная инициализация произойдет в load event listener выше
});

/* ========== ГАЛЕРЕЯ С МОДАЛЬНЫМ ОКНОМ ========== */

class GalleryModal {
  constructor() {
    this.currentIndex = 0;
    this.galleryData = this.loadGalleryData();
    this.totalImages = this.galleryData.length;
    
    this.modal = document.getElementById('modalGallery');
    this.modalImage = document.getElementById('modalImage');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalAuthor = document.getElementById('modalAuthor');
    this.modalComment = document.getElementById('modalComment');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.closeBtn = document.getElementById('closeBtn');
    this.progressBar = document.getElementById('progressBar');
    this.currentIndexEl = document.getElementById('currentIndex');
    this.totalIndexEl = document.getElementById('totalIndex');
    this.loadingSpinner = document.querySelector('.loading-spinner');
    
    this.init();
  }

  // Загрузить данные галереи из JSON
  loadGalleryData() {
    const dataElement = document.getElementById('galleryData');
    if (!dataElement) {
      console.warn('Gallery data not found');
      return [];
    }
    try {
      return JSON.parse(dataElement.textContent);
    } catch (e) {
      console.error('Error parsing gallery data:', e);
      return [];
    }
  }

  // Инициализация
  init() {
    if (this.totalImages === 0) return;

    // Установить количество фотографий
    this.totalIndexEl.textContent = this.totalImages;

    // События клика на фотографии
    this.initGalleryItems();

    // События кнопок навигации
    this.prevBtn.addEventListener('click', () => this.prevImage());
    this.nextBtn.addEventListener('click', () => this.nextImage());
    this.closeBtn.addEventListener('click', () => this.closeModal());

    // Клавиатурная навигация
    this.setupKeyboardNav();

    // Закрытие при клике на фон
    document.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal());

    // Touch/Swipe навигация
    this.setupSwipeNav();
  }

  // Инициализировать клики на фотографии
  initGalleryItems() {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        this.currentIndex = index;
        this.openModal();
      });

      // Поддержка клавиатуры (Enter/Space)
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.currentIndex = index;
          this.openModal();
        }
      });
    });
  }

  // Открыть модальное окно
  openModal() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.updateModal();
    this.focusModal();
  }

  // Закрыть модальное окно
  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Обновить содержимое модального окна
  updateModal() {
    const image = this.galleryData[this.currentIndex];
    
    if (!image) return;

    // Показать спиннер
    this.loadingSpinner.classList.add('active');

    // Загрузить изображение
    const img = new Image();
    img.onload = () => {
      this.modalImage.src = image.image;
      this.modalImage.alt = image.title;
      this.loadingSpinner.classList.remove('active');
    };
    img.onerror = () => {
      this.loadingSpinner.classList.remove('active');
      this.modalImage.src = './assets/img/placeholder.jpg';
    };
    img.src = image.image;

    // Обновить информацию
    this.modalTitle.textContent = image.title;
    this.modalAuthor.textContent = image.author;
    this.modalComment.textContent = `"${image.comment}"`;

    // Обновить счетчик и прогресс бар
    this.currentIndexEl.textContent = this.currentIndex + 1;
    const progressWidth = ((this.currentIndex + 1) / this.totalImages) * 100;
    this.progressBar.style.width = progressWidth + '%';

    // Обновить атрибуты доступности
    this.modal.setAttribute('aria-label', 
      `Фотография ${this.currentIndex + 1} из ${this.totalImages}: ${image.title}`);
  }

  // Следующее изображение
  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.totalImages;
    this.updateModal();
  }

  // Предыдущее изображение
  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages;
    this.updateModal();
  }

  // Клавиатурная навигация
  setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;

      switch (e.key) {
        case 'ArrowRight':
          this.nextImage();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'Escape':
          this.closeModal();
          break;
        case ' ':
          e.preventDefault();
          // Space переключает в fullscreen режим
          this.modal.classList.toggle('fullscreen');
          break;
      }
    });
  }

  // Touch/Swipe навигация для мобильных
  setupSwipeNav() {
    let touchStartX = 0;
    let touchEndX = 0;

    this.modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    this.modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, false);

    const handleSwipe = () => {
      const swipeDistance = 50; // минимальное расстояние для свайпа
      
      if (touchStartX - touchEndX > swipeDistance) {
        // Свайп влево → следующее изображение
        this.nextImage();
      }
      
      if (touchEndX - touchStartX > swipeDistance) {
        // Свайп вправо → предыдущее изображение
        this.prevImage();
      }
    };

    this.handleSwipe = handleSwipe;
  }

  // Установить фокус на модальное окно
  focusModal() {
    this.closeBtn.focus();
  }
}

// Инициализировать галерею при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const gallery = new GalleryModal();
  
  // Сделать доступным глобально для отладки
  window.gallery = gallery;
});

