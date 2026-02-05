// Font Loading Detection Script //
document.addEventListener("DOMContentLoaded", () => {
    const markReady = () => {
        document.body.classList.add("fonts-loaded");
        requestAnimationFrame(() => {
            document.body.classList.add("page-ready");
        });
    };

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(markReady);
    } else {
        markReady();
    }
});

// Always start at the top on reload/refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
});


// Navigation Indicator Script //
(function () {
  const anchors = document.getElementById('anchors');
  const indicator = document.getElementById('indicator');
  const headerLinks = Array.from(anchors.querySelectorAll(':scope > .anchor, :scope > .dropdown > .anchor'));
  const gameToggle = document.getElementById('gameToggle');
  const gameMenu = document.getElementById('gameMenu');
  const dropdownItems = Array.from(gameMenu.querySelectorAll('a'));
  let activeLink = anchors.querySelector('.anchor.active') || headerLinks[0];

  function scrollToHash(hash) {
    if (!hash || hash === '#') return false;
    const target = document.querySelector(hash);
    if (!target) return false;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  // Move indicator to element
  function moveIndicatorTo(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const parentRect = anchors.getBoundingClientRect();
    const x = Math.round(rect.left - parentRect.left);
    const width = Math.round(rect.width);
    anchors.style.setProperty('--ind-x', x);
    anchors.style.setProperty('--ind-width', width);
  }

  function isDropdownOpen() {
    return gameMenu.classList.contains('show');
  }

  // Header link events
  headerLinks.forEach(link => {
    if (link.closest('.dropdown-menu')) return;

    link.addEventListener('mouseenter', () => {
      if (isDropdownOpen() && link !== gameToggle) return;
      moveIndicatorTo(link);
    });

    link.addEventListener('mouseleave', () => {
      if (activeLink) moveIndicatorTo(activeLink);
    });

    link.addEventListener('click', (e) => {
      if (link === gameToggle) {
        e.preventDefault();
        if (isDropdownOpen()) {
          closeDropdown();
        } else {
          openDropdown();
        }
        headerLinks.forEach(l => l.classList.remove('active'));
        gameToggle.classList.add('active');
        activeLink = gameToggle;
        moveIndicatorTo(gameToggle);
        return;
      }
      if (link.dataset && link.dataset.key === 'home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
        const ok = scrollToHash(link.getAttribute('href'));
        if (ok) e.preventDefault();
      }
      if (isDropdownOpen()) closeDropdown();
      headerLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      activeLink = link;
      moveIndicatorTo(link);
    });
  });

  function openDropdown() {
    gameMenu.classList.add('show');
    gameMenu.setAttribute('aria-hidden', 'false');
    gameToggle.setAttribute('aria-expanded', 'true');
    moveIndicatorTo(gameToggle);
  }
  function closeDropdown() {
    gameMenu.classList.remove('show');
    gameMenu.setAttribute('aria-hidden', 'true');
    gameToggle.setAttribute('aria-expanded', 'false');
    moveIndicatorTo(activeLink);
  }

  // Dropdown item click
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      const ok = scrollToHash(href);
      if (ok) e.preventDefault();
      closeDropdown();
      headerLinks.forEach(l => l.classList.remove('active'));
      gameToggle.classList.add('active');
      activeLink = gameToggle;
      moveIndicatorTo(gameToggle);
    });
  });

  // Init indicator
  if (activeLink) {
    requestAnimationFrame(() => moveIndicatorTo(activeLink));
  }

  window.addEventListener('resize', () => {
    if (activeLink) moveIndicatorTo(activeLink);
  });
})();
