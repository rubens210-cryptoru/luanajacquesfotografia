/* ============================================
   LUANA JACQUES — PORTFOLIO
   app.js — All Interactions & Animations
   ============================================ */

(() => {
  'use strict';

  /* ------------------------------------------
     PRELOADER
  ------------------------------------------ */
  const preloader = document.getElementById('preloader');

  const dismissPreloader = () => {
    preloader.classList.add('done');
    document.body.style.overflow = '';
    // Trigger hero image ken burns
    const heroImg = document.getElementById('hero-bg-img');
    if (heroImg) heroImg.classList.add('loaded');
    // Initial reveals
    setTimeout(triggerInitialReveals, 300);
  };

  document.body.style.overflow = 'hidden';
  window.addEventListener('load', () => {
    setTimeout(dismissPreloader, 2200);
  });

  // Safety fallback
  setTimeout(dismissPreloader, 4000);


  /* ------------------------------------------
     CUSTOM CURSOR
  ------------------------------------------ */
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  // Check for touch device
  const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (!isTouchDevice() && dot && ring) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Smooth follow for ring
    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover states
    const interactiveEls = 'a, button, .masonry-card, [data-magnetic], input, textarea';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveEls)) {
        document.body.classList.add('cursor-hover');
      }
      if (e.target.closest('.masonry-card')) {
        document.body.classList.add('cursor-gallery');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveEls)) {
        document.body.classList.remove('cursor-hover');
      }
      if (e.target.closest('.masonry-card')) {
        document.body.classList.remove('cursor-gallery');
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }


  /* ------------------------------------------
     MAGNETIC BUTTONS
  ------------------------------------------ */
  const magneticElements = document.querySelectorAll('[data-magnetic]');

  if (!isTouchDevice()) {
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }


  /* ------------------------------------------
     SCROLL REVEAL (IntersectionObserver)
  ------------------------------------------ */
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay) || 0;
        setTimeout(() => el.classList.add('revealed'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  const triggerInitialReveals = () => {
    revealElements.forEach(el => revealObserver.observe(el));
  };


  /* ------------------------------------------
     NAVBAR
  ------------------------------------------ */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  /* ------------------------------------------
     MOBILE MENU
  ------------------------------------------ */
  const menuBtn = document.getElementById('nav-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isActive = mobileMenu.classList.contains('active');
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = isActive ? '' : 'hidden';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }


  /* ------------------------------------------
     PARALLAX HERO
  ------------------------------------------ */
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight && heroContent) {
      const progress = scrollY / window.innerHeight;
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity = 1 - progress * 0.7;
    }
  }, { passive: true });


  /* ------------------------------------------
     GALLERY FILTER
  ------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Phase 1: Fade out non-matching items
      galleryItems.forEach(item => {
        const matches = filter === 'all' || item.dataset.category === filter;
        if (!matches) {
          item.classList.add('fade-out');
        }
      });

      // Phase 2: After fade, hide them and show matching ones
      setTimeout(() => {
        galleryItems.forEach(item => {
          const matches = filter === 'all' || item.dataset.category === filter;
          if (!matches) {
            item.classList.add('hidden');
            item.classList.remove('fade-out');
          } else {
            item.classList.remove('hidden');
            item.classList.remove('fade-out');
          }
        });

        // Phase 3: Staggered fade-in for visible items
        const visibleItems = document.querySelectorAll('.masonry-item:not(.hidden)');
        visibleItems.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, i * 60);
        });
      }, 350);
    });
  });


  /* ------------------------------------------
     LIGHTBOX
  ------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  let currentLightboxIndex = 0;

  const getVisibleImages = () => {
    return Array.from(document.querySelectorAll('.masonry-item:not(.hidden) .masonry-card img'));
  };

  const openLightbox = (index) => {
    const images = getVisibleImages();
    if (!images[index]) return;

    currentLightboxIndex = index;
    const src = images[index].src.replace('w=600', 'w=1400');
    lightboxImg.src = src;
    lightboxImg.alt = images[index].alt;
    lightboxCounter.textContent = `${index + 1} / ${images.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 500);
  };

  const navigateLightbox = (direction) => {
    const images = getVisibleImages();
    currentLightboxIndex = (currentLightboxIndex + direction + images.length) % images.length;
    const src = images[currentLightboxIndex].src.replace('w=600', 'w=1400');

    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = `scale(0.95) translateX(${direction * 30}px)`;

    setTimeout(() => {
      lightboxImg.src = src;
      lightboxImg.alt = images[currentLightboxIndex].alt;
      lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${images.length}`;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1) translateX(0)';
    }, 200);
  };

  // Attach click to gallery cards
  document.querySelectorAll('.masonry-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      // Find index among currently visible items
      const visibleCards = Array.from(document.querySelectorAll('.masonry-item:not(.hidden) .masonry-card'));
      const visibleIndex = visibleCards.indexOf(card);
      if (visibleIndex !== -1) {
        openLightbox(visibleIndex);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });


  /* ------------------------------------------
     WHATSAPP FAB VISIBILITY
  ------------------------------------------ */
  const whatsappFab = document.getElementById('whatsapp-fab');
  const hero = document.getElementById('hero');

  if (whatsappFab && hero) {
    const fabObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          whatsappFab.classList.remove('visible');
        } else {
          whatsappFab.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    fabObserver.observe(hero);
  }


  /* ------------------------------------------
     SMOOTH SCROLL (Anchor Links)
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
