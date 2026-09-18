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
      var tiltTicking = false;
      deviceFrame.addEventListener('mousemove', function (e) {
        if (!tiltTicking) {
          window.requestAnimationFrame(function () {
            var rect = deviceFrame.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            var rotateX = (y / (rect.height / 2)) * -6;
            var rotateY = (x / (rect.width / 2)) * 6;
            deviceFrame.style.transform = 'perspective(800px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-8px)';
            tiltTicking = false;
          });
          tiltTicking = true;
        }
      });

      deviceFrame.addEventListener('mouseleave', function () {
        deviceFrame.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    }
  }

  // ==========================================================================
  // MASTERCLASS REELS HUB, CINEMA PLAYER & INFOGRAPHICS LIGHTBOX
  // ==========================================================================

  // ---------- 1. Reels Category Filter ----------
  var reelFilterBtns = document.querySelectorAll('.reel-filter-btn');
  var reelCards = document.querySelectorAll('.reel-card');

  reelFilterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter') || 'all';

      reelFilterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      reelCards.forEach(function (card) {
        var cardCat = (card.getAttribute('data-category') || '').toLowerCase();
        var match = false;

        if (filter === 'all') {
          match = true;
        } else if (filter === 'skin') {
          match = cardCat.indexOf('skin') !== -1;
        } else if (filter === 'pcos') {
          match = cardCat.indexOf('pcos') !== -1 || cardCat.indexOf('hormone') !== -1;
        } else if (filter === 'gut') {
          match = cardCat.indexOf('gut') !== -1;
        } else if (filter === 'supplements') {
          match = cardCat.indexOf('supplement') !== -1 || cardCat.indexOf('nutrient') !== -1 || cardCat.indexOf('biomarker') !== -1;
        } else if (filter === 'fertility') {
          match = cardCat.indexOf('fertility') !== -1 || cardCat.indexOf('ivf') !== -1;
        } else {
          match = cardCat.indexOf(filter.toLowerCase()) !== -1;
        }

        if (match) {
          card.classList.remove('is-filtered-out');
        } else {
          card.classList.add('is-filtered-out');
        }
      });
    });
  });

  // ---------- 2. Desktop Hover Video Preview (Smooth Debounced) ----------
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    reelCards.forEach(function (card) {
      var previewVid = card.querySelector('.reel-preview-video');
      if (!previewVid) return;

      var hoverTimer = null;

      card.addEventListener('mouseenter', function () {
        hoverTimer = setTimeout(function () {
          card.classList.add('is-hovering');
          previewVid.muted = true;
          var playPromise = previewVid.play();
          if (playPromise !== undefined) {
            playPromise.catch(function () {});
          }
        }, 110);
      });

      card.addEventListener('mouseleave', function () {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = null;
        }
        card.classList.remove('is-hovering');
        previewVid.pause();
        previewVid.currentTime = 0;
      });
    });
  }

  // ---------- 3. Cinema Reel Modal Player ----------
  var reelModal = document.getElementById('reelModal');
  var reelModalOverlay = document.getElementById('reelModalOverlay');
  var reelModalClose = document.getElementById('reelModalClose');
  var reelMainVideo = document.getElementById('reelMainVideo');
  var reelCenterPlayBtn = document.getElementById('reelCenterPlayBtn');
  var reelPlayPauseBtn = document.getElementById('reelPlayPauseBtn');
  var reelSoundBtn = document.getElementById('reelSoundBtn');
  var reelFullscreenBtn = document.getElementById('reelFullscreenBtn');
  var reelProgressSlider = document.getElementById('reelProgressSlider');
  var reelTimeBadge = document.getElementById('reelTimeBadge');
  var reelQuickPrev = document.getElementById('reelQuickPrev');
  var reelQuickNext = document.getElementById('reelQuickNext');
  var reelStepPrev = document.getElementById('reelStepPrev');
  var reelStepNext = document.getElementById('reelStepNext');
  var reelModalCategory = document.getElementById('reelModalCategory');
  var reelModalDuration = document.getElementById('reelModalDuration');
  var reelModalTitle = document.getElementById('reelModalTitle');
  var reelTakeawaysList = document.getElementById('reelTakeawaysList');
  var reelCounterIndex = document.getElementById('reelCounterIndex');
  var reelPlayerBox = document.getElementById('reelPlayerBox');

  var currentReelIndex = 0;
  var allReelCards = Array.prototype.slice.call(reelCards);

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function updatePlayState(isPlaying) {
    if (!reelCenterPlayBtn || !reelPlayPauseBtn) return;
    var iconPlay = reelPlayPauseBtn.querySelector('.icon-play');
    var iconPause = reelPlayPauseBtn.querySelector('.icon-pause');

    if (isPlaying) {
      reelCenterPlayBtn.classList.add('is-playing');
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = 'block';
    } else {
      reelCenterPlayBtn.classList.remove('is-playing');
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
    }
  }

  function updateSoundState(isMuted) {
    if (!reelSoundBtn) return;
    var iconUnmuted = reelSoundBtn.querySelector('.icon-unmuted');
    var iconMuted = reelSoundBtn.querySelector('.icon-muted');

    if (isMuted) {
      if (iconUnmuted) iconUnmuted.style.display = 'none';
      if (iconMuted) iconMuted.style.display = 'block';
    } else {
      if (iconUnmuted) iconUnmuted.style.display = 'block';
      if (iconMuted) iconMuted.style.display = 'none';
    }
  }

  function openReel(index) {
    if (!reelModal || !reelMainVideo || allReelCards.length === 0) return;
    if (index < 0) index = allReelCards.length - 1;
    if (index >= allReelCards.length) index = 0;
    currentReelIndex = index;

    var card = allReelCards[currentReelIndex];
    var videoSrc = card.getAttribute('data-video');
    var title = card.getAttribute('data-title') || 'Masterclass Reel';
    var category = card.getAttribute('data-category') || 'Clinical Protocol';
    var duration = card.getAttribute('data-duration') || '1:00';
    var rawTakeaways = card.getAttribute('data-takeaways') || '';

    // Update modal elements
    if (reelModalTitle) reelModalTitle.textContent = title;
    if (reelModalCategory) reelModalCategory.textContent = category;
    if (reelModalDuration) reelModalDuration.textContent = '⏱ ' + duration;
    if (reelCounterIndex) {
      reelCounterIndex.textContent = (currentReelIndex + 1) + ' of ' + allReelCards.length;
    }

    // Populate takeaways
    if (reelTakeawaysList) {
      reelTakeawaysList.innerHTML = '';
      var takeaways = rawTakeaways.split('|');
      takeaways.forEach(function (item) {
        var clean = item.trim();
        if (clean) {
          var li = document.createElement('li');
          li.textContent = clean;
          reelTakeawaysList.appendChild(li);
        }
      });
    }

    // Set video source & play
    reelMainVideo.src = videoSrc;
    reelMainVideo.currentTime = 0;
    reelMainVideo.muted = false;
    updateSoundState(false);

    reelModal.style.display = 'flex';
    reelModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var playPromise = reelMainVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        updatePlayState(true);
      }).catch(function () {
        // Autoplay with sound restricted, fallback to muted play
        reelMainVideo.muted = true;
        updateSoundState(true);
        reelMainVideo.play().then(function () {
          updatePlayState(true);
        }).catch(function () {
          updatePlayState(false);
        });
      });
    }
  }

  function closeReelModal() {
    if (!reelModal || !reelMainVideo) return;
    reelMainVideo.pause();
    reelMainVideo.removeAttribute('src');
    reelMainVideo.load();
    updatePlayState(false);
    reelModal.style.display = 'none';
    reelModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function togglePlayPause() {
    if (!reelMainVideo) return;
    if (reelMainVideo.paused || reelMainVideo.ended) {
      reelMainVideo.play().then(function () {
        updatePlayState(true);
      }).catch(function () {});
    } else {
      reelMainVideo.pause();
      updatePlayState(false);
    }
  }

  // Bind clicks to reel cards
  reelCards.forEach(function (card, idx) {
    card.addEventListener('click', function () {
      openReel(idx);
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openReel(idx);
      }
    });
  });

  // Reel modal controls events
  if (reelModalClose) reelModalClose.addEventListener('click', closeReelModal);
  if (reelModalOverlay) reelModalOverlay.addEventListener('click', closeReelModal);

  if (reelCenterPlayBtn) reelCenterPlayBtn.addEventListener('click', togglePlayPause);
  if (reelPlayPauseBtn) reelPlayPauseBtn.addEventListener('click', togglePlayPause);
  if (reelMainVideo) {
    reelMainVideo.addEventListener('click', togglePlayPause);
    reelMainVideo.addEventListener('play', function () { updatePlayState(true); });
    reelMainVideo.addEventListener('pause', function () { updatePlayState(false); });
    reelMainVideo.addEventListener('ended', function () {
      updatePlayState(false);
      // Auto-advance to next reel smoothly after 1.2s
      setTimeout(function () {
        if (reelModal.style.display !== 'none') {
          openReel(currentReelIndex + 1);
        }
      }, 1200);
    });

    reelMainVideo.addEventListener('timeupdate', function () {
      if (!reelMainVideo.duration) return;
      var cur = reelMainVideo.currentTime;
      var dur = reelMainVideo.duration;
      if (reelProgressSlider) {
        reelProgressSlider.value = (cur / dur) * 100;
      }
      if (reelTimeBadge) {
        reelTimeBadge.textContent = formatTime(cur) + ' / ' + formatTime(dur);
      }
    });
  }

  if (reelProgressSlider) {
    reelProgressSlider.addEventListener('input', function () {
      if (!reelMainVideo || !reelMainVideo.duration) return;
      var targetTime = (reelProgressSlider.value / 100) * reelMainVideo.duration;
      reelMainVideo.currentTime = targetTime;
    });
  }

  if (reelSoundBtn) {
    reelSoundBtn.addEventListener('click', function () {
      if (!reelMainVideo) return;
      reelMainVideo.muted = !reelMainVideo.muted;
      updateSoundState(reelMainVideo.muted);
    });
  }

  if (reelFullscreenBtn) {
    reelFullscreenBtn.addEventListener('click', function () {
      var box = reelPlayerBox || reelMainVideo;
      if (!document.fullscreenElement) {
        if (box.requestFullscreen) {
          box.requestFullscreen();
        } else if (box.webkitRequestFullscreen) {
          box.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // Previous / Next Reel Buttons
  function prevReel() { openReel(currentReelIndex - 1); }
  function nextReel() { openReel(currentReelIndex + 1); }

  if (reelQuickPrev) reelQuickPrev.addEventListener('click', prevReel);
  if (reelQuickNext) reelQuickNext.addEventListener('click', nextReel);
  if (reelStepPrev) reelStepPrev.addEventListener('click', prevReel);
  if (reelStepNext) reelStepNext.addEventListener('click', nextReel);

  // ---------- 4. Clinical Infographics & Flyers Lightbox ----------
  var infographicLightbox = document.getElementById('infographicLightbox');
  var lightboxOverlay = document.getElementById('lightboxOverlay');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxTitle = document.getElementById('lightboxTitle');
  var lightboxDesc = document.getElementById('lightboxDesc');
  var lightboxOpenTriggers = document.querySelectorAll('.js-open-lightbox');

  function openLightbox(imgSrc, title, desc) {
    if (!infographicLightbox || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = title || 'Clinical Protocol';
    if (lightboxDesc) lightboxDesc.textContent = desc || '';

    infographicLightbox.style.display = 'flex';
    infographicLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!infographicLightbox) return;
    infographicLightbox.style.display = 'none';
    infographicLightbox.setAttribute('aria-hidden', 'true');
    if (lightboxImg) lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  lightboxOpenTriggers.forEach(function (trigger) {
    function handleTrigger(e) {
      e.stopPropagation();
      var imgSrc = trigger.getAttribute('data-img') || (trigger.querySelector('img') ? trigger.querySelector('img').src : '');
      var title = trigger.getAttribute('data-title') || '';
      var desc = trigger.getAttribute('data-desc') || '';
      openLightbox(imgSrc, title, desc);
    }

    trigger.addEventListener('click', handleTrigger);
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTrigger(e);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  // ---------- 5. Global Keyboard Navigation (Esc, Arrows, Space) ----------
  document.addEventListener('keydown', function (e) {
    var isReelOpen = reelModal && reelModal.style.display !== 'none';
    var isLightboxOpen = infographicLightbox && infographicLightbox.style.display !== 'none';

    if (e.key === 'Escape') {
      if (isReelOpen) closeReelModal();
      if (isLightboxOpen) closeLightbox();
    } else if (isReelOpen) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevReel();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextReel();
      } else if (e.key === ' ' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlayPause();
      }
    }
  });

})();


