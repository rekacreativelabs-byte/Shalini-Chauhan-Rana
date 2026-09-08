(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  var progressBar = document.getElementById('scrollProgressBar');
  var backToTopBtn = document.getElementById('backToTop');

  // ---------- Header and Scroll Progress ----------
  function onScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Header shadow & background toggle
    if (scrollY > 16) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Top scroll progress bar
    if (progressBar && docHeight > 0) {
      var progress = (scrollY / docHeight) * 100;
      progressBar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 380) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Back to Top Click Handler ----------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---------- Mobile Nav Toggle ----------
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Number Counter Animation ----------
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    var duration = 1800; // ms
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic curve
      var easeProgress = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(easeProgress * target);
      el.textContent = current;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    window.requestAnimationFrame(step);
  }

  // Trigger counters when visible
  var counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window && counters.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(animateCounter);
  }

  // ---------- Scroll Reveal Engine (IntersectionObserver) ----------
  var revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.08
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if browser does not support IntersectionObserver
    revealElements.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  }

  // ---------- FAQ Accordion ----------
  var faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Close all other items
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          var otherTrigger = openItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------- Consultation Service Chips ----------
  var serviceChips = document.querySelectorAll('.service-chip');
  var serviceInput = document.getElementById('serviceInterest');

  serviceChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      serviceChips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      if (serviceInput) {
        serviceInput.value = chip.getAttribute('data-value');
      }
    });
  });

  // ---------- App Showcase Screen Slider & Tabs ----------
  var tabButtons = document.querySelectorAll('.app-tab-btn');
  var screenSlides = document.querySelectorAll('.app-screen-slide');
  var appSection = document.getElementById('app');
  var currentSlideIdx = 0;
  var slideInterval = null;
  var isUserInteracting = false;

  function setSlide(targetId) {
    tabButtons.forEach(function (btn) {
      var isTarget = btn.getAttribute('data-target') === targetId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    screenSlides.forEach(function (slide, idx) {
      var isTarget = slide.id === targetId;
      slide.classList.toggle('active', isTarget);
      if (isTarget) currentSlideIdx = idx;
    });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      isUserInteracting = true;
      var target = btn.getAttribute('data-target');
      setSlide(target);
    });
  });

  function nextSlide() {
    if (isUserInteracting || screenSlides.length === 0) return;
    currentSlideIdx = (currentSlideIdx + 1) % screenSlides.length;
    var nextTarget = screenSlides[currentSlideIdx].id;
    setSlide(nextTarget);
  }

  if (appSection && 'IntersectionObserver' in window) {
    var sliderObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!slideInterval) {
            slideInterval = setInterval(nextSlide, 4200);
          }
        } else {
          if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
          }
        }
      });
    }, { threshold: 0.2 });

    sliderObserver.observe(appSection);
  }

  var deviceFrame = document.querySelector('.app-device-frame');
  if (deviceFrame) {
    deviceFrame.addEventListener('mouseenter', function () {
      isUserInteracting = true;
    });
    deviceFrame.addEventListener('mouseleave', function () {
      isUserInteracting = false;
    });

    if (window.matchMedia('(pointer: fine)').matches) {
      deviceFrame.addEventListener('mousemove', function (e) {
        var rect = deviceFrame.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var rotateX = (y / (rect.height / 2)) * -6;
        var rotateY = (x / (rect.width / 2)) * 6;
        deviceFrame.style.transform = 'perspective(800px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-8px)';
      });

      deviceFrame.addEventListener('mouseleave', function () {
        deviceFrame.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    }
  }

})();


