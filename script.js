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

          let x = e.clientX + 15;
          let y = e.clientY + 15;

          // Prevent tooltip from overflowing the right of screen
          if (x + tooltipWidth > window.innerWidth - 10) {
            x = e.clientX - tooltipWidth - 15;
          }
          // Prevent tooltip from overflowing the left of screen
          if (x < 10) {
            x = 10;
          }
          // Prevent tooltip from overflowing the bottom of screen
          if (y + tooltipHeight > window.innerHeight - 10) {
            y = e.clientY - tooltipHeight - 15;
          }
          // Prevent tooltip from overflowing the top of screen
          if (y < 10) {
            y = 10;
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

  // Download Modal Logic for available devices
  const modalOverlay = document.getElementById('downloadModal');
  const modalCloseBtn = document.getElementById('modalClose');

  const downloadData = {
    ally2023: {
      deviceName: 'ROG Ally 2023',
      fileName: 'EverAlly_AllyOG_28072026_X64W11_24H2_CR-ISO_COMM_03.05.iso',
      huggingface: 'https://huggingface.co/buckets/Mainak0009/EverAlly/resolve/AllyOG/EverAlly_AllyOG_28072026_X64W11_24H2_CR-ISO_COMM_03.05.iso?download=true',
      archive: 'https://archive.org/download/everally-allyog-z1-z1e-rc71l-offline-cloud-recovery-iso/EverAlly_AllyOG_28072026_X64W11_24H2_CR-ISO_COMM_03.05.iso',
      sha256: '57A2153067C144C8201994978B9BF3DB95F58DF4B0827225F98BFE5ADC106AB0',
      sha1: '49BBF7EED48F73F4B63A195AE1EAA78138E35E6F',
      md5: 'C4C841E0AE424D4FEEE0A7BEF1F803E9',
      fileSize: '24.47 GB'
    },
    allyX2024: {
      deviceName: 'ROG Ally X 2024',
      fileName: 'EverAlly_AllyX_28072026_X64W11_25H2_CR-ISO_COMM_01.06.iso',
      huggingface: 'https://huggingface.co/buckets/Mainak0009/EverAlly/resolve/AllyX/EverAlly_AllyX_28072026_X64W11_25H2_CR-ISO_COMM_01.06.iso?download=true',
      archive: 'https://archive.org/download/everally-allyx-rc72la-offline-cloud-recovery-iso/EverAlly_AllyX_28072026_X64W11_25H2_CR-ISO_COMM_01.06.iso',
      sha256: 'F4F709B96D94C4DB0F605E9F6A89495336CA0380C6CCEE31BCD2D7176209DA20',
      sha1: '84AB56773B937399FDDEE08C28B7A64D87793143',
      md5: '4091E0A15C2DA00065BA2FB4E474D5B0',
      fileSize: '21.26 GB'
    }
  };

  function populateAndOpenModal(key) {
    const data = downloadData[key];
    if (!data || !modalOverlay) return;

    const deviceNameEl = document.getElementById('modalDeviceName');
    const mirrorHfEl = document.getElementById('mirrorHuggingface');
    const mirrorArcEl = document.getElementById('mirrorArchive');
    const sha256El = document.getElementById('checksumSha256');
    const sha1El = document.getElementById('checksumSha1');
    const md5El = document.getElementById('checksumMd5');
    const footerEl = document.getElementById('modalFooter');

    if (deviceNameEl) deviceNameEl.textContent = data.deviceName;
    if (mirrorHfEl) mirrorHfEl.href = data.huggingface;
    if (mirrorArcEl) mirrorArcEl.href = data.archive;

    if (sha256El) {
      sha256El.textContent = data.sha256;
      sha256El.onclick = () => navigator.clipboard.writeText(data.sha256).then(() => showToast('SHA-256 copied!'));
    }
    if (sha1El) {
      sha1El.textContent = data.sha1;
      sha1El.onclick = () => navigator.clipboard.writeText(data.sha1).then(() => showToast('SHA-1 copied!'));
    }
    if (md5El) {
      md5El.textContent = data.md5;
      md5El.onclick = () => navigator.clipboard.writeText(data.md5).then(() => showToast('MD5 copied!'));
    }
    if (footerEl) {
      footerEl.innerHTML = `<div style="margin-bottom: 6px; word-break: break-all;">File name: <strong>${data.fileName}</strong></div><div>File size: <strong>${data.fileSize}</strong> · Format: <strong>ISO Image</strong></div>`;
    }

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  const ally2023Btn = document.getElementById('ally2023Download');
  const allyX2024Btn = document.getElementById('allyX2024Download');

  if (ally2023Btn) {
    ally2023Btn.addEventListener('click', (e) => {
      e.preventDefault();
      populateAndOpenModal('ally2023');
    });
  }

  if (allyX2024Btn) {
    allyX2024Btn.addEventListener('click', (e) => {
      e.preventDefault();
      populateAndOpenModal('allyX2024');
    });
  }

  if (modalOverlay) {
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