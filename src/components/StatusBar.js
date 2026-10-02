window.PixlApp = window.PixlApp || {};

window.PixlApp.StatusBar = (() => {
  let statusDotEl = null;
  let statusTextEl = null;
  let clockEl = null;
  let shortcutCountEl = null;
  let navTabsEl = null;
  let timerId = null;

  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function updateClock() {
    if (clockEl) {
      clockEl.textContent = formatTime();
    }
  }

  function handleOnline() {
    if (statusDotEl && statusTextEl) {
      statusDotEl.classList.remove('offline');
      statusTextEl.textContent = 'online';
    }
  }

  function handleOffline() {
    if (statusDotEl && statusTextEl) {
      statusDotEl.classList.add('offline');
      statusTextEl.textContent = 'offline';
    }
  }

  function render(container) {
    container.innerHTML = `
      <div class="left">
        <span class="status-dot" id="statusDot" aria-hidden="true"></span>
        <span id="statusText">${navigator.onLine ? 'online' : 'offline'}</span>
        <span id="clock">--:--:--</span>
      </div>
      <div class="right">
        <span class="badge-brand">pixlhome</span>
        <span id="shortcutCount">0 shortcuts</span>
        <nav class="nav-tabs" aria-label="Page navigation">
          <a href="#/" class="nav-tab active" data-route="#/">[ 1. HOME ]</a>
          <a href="#/page-2" class="nav-tab" data-route="#/page-2">[ 2. EXTRA ]</a>
        </nav>
      </div>
    `;

    statusDotEl = container.querySelector('#statusDot');
    statusTextEl = container.querySelector('#statusText');
    clockEl = container.querySelector('#clock');
    shortcutCountEl = container.querySelector('#shortcutCount');
    navTabsEl = container.querySelectorAll('.nav-tab');

    if (!navigator.onLine) {
      statusDotEl.classList.add('offline');
    }

    updateClock();
    if (timerId) clearInterval(timerId);
    timerId = setInterval(updateClock, 1000);

    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }

  function updateCount(countOrText) {
    if (!shortcutCountEl) return;
    if (typeof countOrText === 'number') {
      shortcutCountEl.textContent = `${countOrText} shortcuts`;
    } else {
      shortcutCountEl.textContent = countOrText;
    }
  }

  function setActiveRoute(currentHash) {
    const hash = currentHash || '#/';
    if (!navTabsEl) return;
    navTabsEl.forEach(tab => {
      const targetRoute = tab.getAttribute('data-route');
      const isMatch = targetRoute === hash || (hash === '' && targetRoute === '#/');
      tab.classList.toggle('active', isMatch);
    });
  }

  return {
    render,
    updateCount,
    setActiveRoute
  };
})();
