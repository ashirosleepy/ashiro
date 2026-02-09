// Font Loading Detection Script //
document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    root.style.setProperty("--sbw", `${Math.max(0, scrollbarWidth)}px`);
    let lockedScrollY = window.scrollY || window.pageYOffset || 0;
    root.classList.add("no-scroll");
    body.classList.add("no-scroll");
    body.style.top = `-${lockedScrollY}px`;
    let scrollLocked = true;

    const lockHandler = (e) => {
        if (!scrollLocked) return;
        e.preventDefault();
    };

    const keyLockHandler = (e) => {
        if (!scrollLocked) return;
        const keys = [
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            "Home",
            "End",
            " ",
            "Spacebar"
        ];
        if (keys.includes(e.key)) {
            e.preventDefault();
        }
    };

    window.addEventListener("wheel", lockHandler, { passive: false });
    window.addEventListener("touchmove", lockHandler, { passive: false });
    window.addEventListener("keydown", keyLockHandler);

    const unlockScroll = () => {
        if (!scrollLocked) return;
        root.classList.remove("no-scroll");
        body.classList.remove("no-scroll");
        body.style.top = "";
        window.scrollTo(0, lockedScrollY);
        scrollLocked = false;
        window.removeEventListener("wheel", lockHandler);
        window.removeEventListener("touchmove", lockHandler);
        window.removeEventListener("keydown", keyLockHandler);
    };

    const markReady = () => {
        body.classList.add("fonts-loaded");
        requestAnimationFrame(() => {
            body.classList.add("page-ready");
            const page = document.getElementById("page");
            let unlocked = false;

            const onAnimEnd = () => {
                if (unlocked) return;
                unlocked = true;
                unlockScroll();
            };

            if (page) {
                page.addEventListener("animationend", onAnimEnd, { once: true });
                // Fallback nếu animation bị tắt hoặc không chạy
                setTimeout(onAnimEnd, 1200);
            } else {
                unlockScroll();
            }
        });
    };

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(markReady);
    } else {
        markReady();
    }
});

// Keep browser's scroll restoration behavior (default) to avoid jump to top on load


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

// Google Form Comments
document.addEventListener("DOMContentLoaded", () => {
  const FORM_ACTION_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSd7Ml-bsv2pRSmQbUG6xqPsLnP3wdGYj2cDPURphPpQlsHmng/formResponse";
  const ENTRY_NAME = "entry.1241711496";
  const ENTRY_MESSAGE = "entry.64730262";
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1gYRQb3PUPDFT2K2tO7ktJ-lWE5VaUZc3nxI_OI8cEXE/export?format=csv&gid=918474800";

  const form = document.getElementById("commentForm");
  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("message");
  const list = document.getElementById("commentList");
  const submitBtn = form ? form.querySelector("button[type='submit']") : null;

  if (!form || !list) return;

  const renderComment = (name, message, timeText, toTop = true) => {
    const wrapper = document.createElement("div");
    wrapper.className = "comment-item";

    const title = document.createElement("strong");
    title.textContent = name || "Ẩn danh";

    const time = document.createElement("span");
    time.style.marginLeft = "8px";
    time.style.color = "#666";
    time.style.fontSize = "0.85rem";
    time.textContent = timeText || "";

    const header = document.createElement("div");
    header.appendChild(title);
    header.appendChild(time);

    const msg = document.createElement("div");
    msg.textContent = message || "";
    msg.style.marginTop = "6px";

    wrapper.appendChild(header);
    wrapper.appendChild(msg);

    if (toTop && list.firstChild) {
      list.insertBefore(wrapper, list.firstChild);
    } else {
      list.appendChild(wrapper);
    }
  };

  const loadFromSheet = async () => {
    if (!SHEET_CSV_URL) return;
    try {
      const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
      const csv = await res.text();
      const lines = csv.split(/\r?\n/).filter(Boolean);
      if (lines.length <= 1) return;
      list.innerHTML = "";
      // Skip header row
      for (let i = lines.length - 1; i >= 1; i--) {
        const row = lines[i];
        const cols = row.split(",").map(c => c.replace(/^\"|\"$/g, "").replace(/\"\"/g, "\""));
        // Typical Google Forms order: Timestamp, Name, Comment
        const timeText = cols[0] || "";
        const name = cols[1] || "Ẩn danh";
        const message = cols[2] || "";
        if (message) renderComment(name, message, timeText, false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = (nameInput.value || "").trim() || "Ẩn danh";
    const message = (messageInput.value || "").trim();
    if (!message) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
    }

    const formData = new FormData();
    formData.append(ENTRY_NAME, name);
    formData.append(ENTRY_MESSAGE, message);

    try {
      await fetch(FORM_ACTION_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });
      renderComment(name, message, new Date().toLocaleString("vi-VN"), true);
      messageInput.value = "";
    } catch (err) {
      console.error(err);
      alert("Không thể gửi bình luận. Vui lòng thử lại.");
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    }
  });

  loadFromSheet();
});
