const visual = document.getElementById('visual');
  const white = document.getElementById('consoleWhite');
  const black = document.getElementById('consoleBlack');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && visual && white && black) {
    let rafId = null;
    let bothReady = false;
    let readyCount = 0;

    // both animations must finish before hover tilt activates
    function onAnimEnd(){
      readyCount++;
      if (readyCount >= 2) {
        bothReady = true;
        white.classList.add('ready');
        black.classList.add('ready');
      }
    }

    white.addEventListener('animationend', onAnimEnd, { once: true });
    black.addEventListener('animationend', onAnimEnd, { once: true });

    function handleMove(e){
      if (!bothReady) return;

      const rect = visual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 22;
      const rotX = (0.5 - py) * 14;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        white.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        black.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    }

    function reset(){
      if (rafId) cancelAnimationFrame(rafId);
      white.style.transform = 'rotateX(0deg) rotateY(0deg)';
      black.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }

    visual.addEventListener('mousemove', handleMove);
    visual.addEventListener('mouseleave', reset);
  }

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('header nav');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Cursor-tracking tooltip for unavailable devices on Download page
  const downloadCards = document.querySelectorAll('.download-card');
  const hasContributeBtn = Array.from(downloadCards).some(card => card.querySelector('.btn-download.btn-contribute'));

  if (downloadCards.length > 0 && hasContributeBtn) {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'cursor-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-title">Contributors Needed</div>
      <p class="tooltip-text">We require ASUS cloud recovery backup files to make support for this device possible. If you own this handheld and would like to contribute, click contribute to know more</p>
    `;
    document.body.appendChild(tooltip);

    downloadCards.forEach(card => {
      const isContribute = card.querySelector('.btn-download.btn-contribute');
      if (isContribute) {
        card.addEventListener('mousemove', (e) => {
          const tooltipWidth = tooltip.offsetWidth || 320;
          const tooltipHeight = tooltip.offsetHeight || 100;

          let x = e.pageX + 15;
          let y = e.pageY + 15;

          // Prevent tooltip from overflowing the right of screen
          if (e.clientX + 15 + tooltipWidth > window.innerWidth) {
            x = e.pageX - tooltipWidth - 15;
          }
          // Prevent tooltip from overflowing the left of screen
          if (x - window.scrollX < 10) {
            x = window.scrollX + 10;
          }
          // Prevent tooltip from overflowing the bottom of screen
          if (e.clientY + 15 + tooltipHeight > window.innerHeight) {
            y = e.pageY - tooltipHeight - 15;
          }
          // Prevent tooltip from overflowing the top of screen
          if (y - window.scrollY < 10) {
            y = window.scrollY + 10;
          }

          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
        });

        card.addEventListener('mouseenter', () => {
          tooltip.classList.add('visible');
        });

        card.addEventListener('mouseleave', () => {
          tooltip.classList.remove('visible');
        });
      }
    });

    // Close tooltip when clicking or tapping elsewhere (useful on touchscreens)
    document.addEventListener('pointerdown', (e) => {
      let touchedCard = false;
      downloadCards.forEach(card => {
        if (card.contains(e.target) && card.querySelector('.btn-download.btn-contribute')) {
          touchedCard = true;
        }
      });
      if (!touchedCard) {
        tooltip.classList.remove('visible');
      }
    });
  }

  // Download Modal Logic for available device
  const downloadBtn = document.getElementById('ally2023Download');
  const modalOverlay = document.getElementById('downloadModal');
  const modalCloseBtn = document.getElementById('modalClose');

  if (downloadBtn && modalOverlay) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });

    const closeModal = () => {
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Unlock background scrolling
    };

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }
    
    // Close when clicking overlay backdrop
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Close on Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Toast Notification System
  window.showToast = function(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('show');
    
    if (window.toastTimeout) {
      clearTimeout(window.toastTimeout);
    }
    
    window.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  };

  // FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all other open FAQ items (optional, makes it behave like a true accordion)
        document.querySelectorAll('.faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item active state
        item.classList.toggle('active', !isActive);
      });
    });
  }