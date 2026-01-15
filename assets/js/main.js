gsap.registerPlugin(ScrollTrigger);

// Снежинки
function createSnowflakes() {
  const container = document.getElementById("snowflakes");
  const snowflakes = ["❄", "⛄", "✦", "◆", "✧"];

  for (let i = 0; i < 50; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.textContent =
      snowflakes[Math.floor(Math.random() * snowflakes.length)];
    snowflake.style.left = Math.random() * 100 + "%";
    snowflake.style.animation = `snowfall ${
      Math.random() * 15 + 15
    }s linear infinite`;
    snowflake.style.animationDelay = Math.random() * 5 + "s";
    snowflake.style.top = Math.random() * 100 - 100 + "px";
    container.appendChild(snowflake);
  }
}

// Меню
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// Прокрутка к верху
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Анимации при загрузке
window.addEventListener("load", function () {
  createSnowflakes();

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
});

// ВИКТОРИНА
let currentQuestion = 0;
let score = 0;
const totalQuestions = 5;

document.getElementById("totalQuestions").textContent = totalQuestions;

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
      if (opt.classList.contains("correct") === false && opt !== element) {
        const hasCheck = opt.textContent.includes("✓");
        if (
          !hasCheck &&
          Array.from(opt.parentElement.children).find((o) =>
            o.classList.contains("correct")
          )
        ) {
          opt.style.opacity = "0.5";
        }
      }
    });
    options.forEach((opt) => {
      if (
        !opt.classList.contains("incorrect") &&
        !opt.classList.contains("correct")
      ) {
        const hasCorrect = Array.from(opt.parentElement.children).find((o) =>
          o.classList.contains("correct")
        );
        if (hasCorrect && opt !== element) {
          opt.style.opacity = "0.3";
        }
      }
    });
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < totalQuestions) {
      document.getElementById("currentQuestion").textContent =
        currentQuestion + 1;
      document
        .querySelectorAll(".quiz-question")
        [currentQuestion].classList.add("active");
      document
        .querySelectorAll(".quiz-question")
        [currentQuestion - 1].classList.remove("active");
    } else {
      showResults();
    }
  }, 1500);
}

function showResults() {
  const percentage = Math.round((score / totalQuestions) * 100);
  document.getElementById("finalScore").textContent = percentage + "%";

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

  document.getElementById("resultText").textContent = resultText;
  document
    .querySelectorAll(".quiz-question")
    .forEach((q) => q.classList.remove("active"));
  document.querySelector(".quiz-result").classList.add("active");
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById("currentQuestion").textContent = "1";
  document.querySelectorAll(".quiz-question").forEach((q, i) => {
    if (i === 0) q.classList.add("active");
    else q.classList.remove("active");
    q.querySelectorAll(".quiz-option").forEach((opt) => {
      opt.classList.remove("correct", "incorrect");
      opt.style.pointerEvents = "auto";
      opt.style.opacity = "1";
      const originalText = opt.textContent.replace(" ✓", "").replace(" ✗", "");
      opt.textContent = originalText;
    });
  });
  document.querySelector(".quiz-result").classList.remove("active");
}


 // Анимация для кнопки Back to Top
        document.addEventListener('DOMContentLoaded', function() {
            const backToTop = document.getElementById('backToTop');
            const images = document.querySelectorAll('.animated-image');
            
            let animationId = null;
            let direction = 1; // 1 для движения вверх, -1 для движения вниз
            let currentOffset = 0;
            const maxOffset = 15;
            const animationSpeed = 0.4;
            
            // Показывать/скрывать кнопку при скролле
            function handleScroll() {
                if (window.pageYOffset > 500) {
                    backToTop.style.display = 'flex';
                    if (!animationId) {
                        startAnimation();
                    }
                } else {
                    backToTop.style.display = 'none';
                    stopAnimation();
                }
            }
            
            window.addEventListener('scroll', handleScroll);
            
            // Прокрутка наверх при клике
            backToTop.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            function startAnimation() {
                function animate() {
                    currentOffset += direction * animationSpeed;
                    
                    // Меняем направление при достижении границ
                    if (Math.abs(currentOffset) >= maxOffset) {
                        direction *= -1;
                        currentOffset = Math.sign(currentOffset) * maxOffset;
                    }
                    
                    // Применяем трансформацию к картинкам
                    // 1-я и 3-я движутся в одну сторону (вверх/вниз)
                    images[0].style.transform = `translateY(${currentOffset}px)`;
                    images[2].style.transform = `translateY(${currentOffset}px)`;
                    
                    // 2-я и 4-я движутся в противоположную сторону
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
                
                // Сбрасываем позиции
                images.forEach(img => {
                    img.style.transform = 'translateY(0px)';
                });
                currentOffset = 0;
                direction = 1;
            }
            
            // Создаем снежинки
            function createSnowflakes() {
                const snowflakesContainer = document.getElementById('snowflakes');
                const snowflakeCount = 50;
                
                for (let i = 0; i < snowflakeCount; i++) {
                    const snowflake = document.createElement('div');
                    snowflake.classList.add('snowflake');
                    
                    // Случайные параметры
                    const size = Math.random() * 8 + 2;
                    const startX = Math.random() * 100;
                    const duration = Math.random() * 10 + 10;
                    const delay = Math.random() * 5;
                    
                    snowflake.style.width = `${size}px`;
                    snowflake.style.height = `${size}px`;
                    snowflake.style.left = `${startX}vw`;
                    snowflake.style.animation = `snowfall ${duration}s linear ${delay}s infinite`;
                    snowflake.style.opacity = Math.random() * 0.6 + 0.3;
                    
                    snowflakesContainer.appendChild(snowflake);
                }
            }
            
            // Анимация снегопада
            function snowfall() {
                const snowflakes = document.querySelectorAll('.snowflake');
                snowflakes.forEach(flake => {
                    const currentTop = parseFloat(flake.style.top || 0);
                    const newTop = currentTop + 1;
                    
                    if (newTop > window.innerHeight) {
                        flake.style.top = '-10px';
                        flake.style.left = Math.random() * 100 + 'vw';
                    } else {
                        flake.style.top = newTop + 'px';
                        flake.style.transform = `translateX(${Math.sin(newTop / 50) * 2}px) rotate(${newTop}deg)`;
                    }
                });
            }
            
            // Начинаем анимацию если страница уже прокручена
            if (window.pageYOffset > 500) {
                backToTop.style.display = 'flex';
                startAnimation();
            }
            
            // Создаем снежинки и запускаем снегопад
            createSnowflakes();
            setInterval(snowfall, 50);
        });

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