window.PixlApp = window.PixlApp || {};

window.PixlApp.App = (() => {
  let activeElement = null;

  function getAllNavigableItems() {
    const selector = '.icon-item, .icon-bottom, .page-btn';
    return Array.from(document.querySelectorAll(selector)).filter(el => {
      return el.offsetWidth > 0 && el.offsetHeight > 0 && window.getComputedStyle(el).visibility !== 'hidden';
    });
  }

  function setActiveItem(el) {
    if (activeElement) {
      activeElement.classList.remove('active');
    }
    activeElement = el;
    if (activeElement) {
      activeElement.classList.add('active');
      activeElement.focus({ preventScroll: true });
      activeElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  function findSpatialCandidate(currentEl, direction) {
    const candidates = getAllNavigableItems().filter(el => el !== currentEl);
    if (!candidates.length) return null;

    const currentRect = currentEl.getBoundingClientRect();
    const tolerance = 2;

    const directionalCandidates = candidates.filter(cand => {
      const candRect = cand.getBoundingClientRect();
      switch (direction) {
        case 'ArrowRight':
          return candRect.left >= currentRect.right - tolerance;
        case 'ArrowLeft':
          return candRect.right <= currentRect.left + tolerance;
        case 'ArrowDown':
          return candRect.top >= currentRect.bottom - tolerance;
        case 'ArrowUp':
          return candRect.bottom <= currentRect.top + tolerance;
        default:
          return false;
      }
    });

    if (!directionalCandidates.length) return null;

    // Separate overlapping candidates on perpendicular axis from non-overlapping
    const isHorizontal = direction === 'ArrowLeft' || direction === 'ArrowRight';

    function getOverlap(candRect) {
      if (isHorizontal) {
        return Math.max(0, Math.min(currentRect.bottom, candRect.bottom) - Math.max(currentRect.top, candRect.top));
      } else {
        return Math.max(0, Math.min(currentRect.right, candRect.right) - Math.max(currentRect.left, candRect.left));
      }
    }

    function getDistance(candRect) {
      if (isHorizontal) {
        const gap = direction === 'ArrowRight' ? (candRect.left - currentRect.right) : (currentRect.left - candRect.right);
        const perpCenterOffset = Math.abs((currentRect.top + currentRect.height / 2) - (candRect.top + candRect.height / 2));
        return Math.max(0, gap) + (perpCenterOffset * 2);
      } else {
        const gap = direction === 'ArrowDown' ? (candRect.top - currentRect.bottom) : (currentRect.top - candRect.bottom);
        const perpCenterOffset = Math.abs((currentRect.left + currentRect.width / 2) - (candRect.left + candRect.width / 2));
        return Math.max(0, gap) + (perpCenterOffset * 2);
      }
    }

    // Sort: overlapping candidates prioritized, then lowest score
    directionalCandidates.sort((a, b) => {
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();
      const overlapA = getOverlap(rectA);
      const overlapB = getOverlap(rectB);

      if (overlapA > 0 && overlapB === 0) return -1;
      if (overlapB > 0 && overlapA === 0) return 1;

      return getDistance(rectA) - getDistance(rectB);
    });

    return directionalCandidates[0];
  }

  function setupGlobalKeyboard() {
    document.addEventListener('keydown', (e) => {
      const searchInput = window.PixlApp.SearchBox.getInput();
      const isSearchFocused = document.activeElement === searchInput;

      // 1. Slash / focuses search
      if (e.key === '/' && !isSearchFocused) {
        e.preventDefault();
        window.PixlApp.SearchBox.focus();
        if (activeElement) {
          activeElement.classList.remove('active');
          activeElement = null;
        }
        return;
      }

      // 2. Escape clears or blurs
      if (e.key === 'Escape') {
        if (isSearchFocused) {
          if (searchInput.value) {
            window.PixlApp.SearchBox.clear();
          } else {
            searchInput.blur();
          }
        } else if (activeElement) {
          activeElement.classList.remove('active');
          activeElement.blur();
          activeElement = null;
        }
        return;
      }

      // 3. Alt+1 / Alt+2 page switcher
      if (e.altKey && (e.key === '1' || e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        window.PixlApp.Router.navigate('#/');
        return;
      }
      if (e.altKey && (e.key === '2' || e.key.toLowerCase() === 'e')) {
        e.preventDefault();
        window.PixlApp.Router.navigate('#/page-2');
        return;
      }

      // 4. Number keys 1-8 for favorites (when not typing in search input)
      if (!isSearchFocused && !e.ctrlKey && !e.altKey && !e.metaKey && /^[1-8]$/.test(e.key)) {
        const num = parseInt(e.key, 10) - 1;
        const favItem = document.querySelector(`.icon-bottom[data-fav-index="${num}"]`);
        if (favItem) {
          e.preventDefault();
          favItem.click();
        }
        return;
      }

      // 5. Arrow key navigation
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (isSearchFocused) {
          // If in search input and press ArrowDown, jump into the first grid item
          if (e.key === 'ArrowDown') {
            const items = getAllNavigableItems();
            if (items.length > 0) {
              e.preventDefault();
              searchInput.blur();
              setActiveItem(items[0]);
            }
          }
          return;
        }

        const current = activeElement || document.activeElement;
        const isCandidate = current && (current.classList.contains('icon-item') || current.classList.contains('icon-bottom') || current.classList.contains('page-btn'));

        if (!isCandidate) {
          const items = getAllNavigableItems();
          if (items.length > 0) {
            e.preventDefault();
            setActiveItem(items[0]);
          }
          return;
        }

        const candidate = findSpatialCandidate(current, e.key);
        if (candidate) {
          e.preventDefault();
          setActiveItem(candidate);
        }
        // If no candidate, do not call preventDefault so native scrolling continues!
        return;
      }

      // 6. Enter key navigation
      if (e.key === 'Enter') {
        if (!isSearchFocused && activeElement) {
          e.preventDefault();
          activeElement.click();
        }
      }
    });

    // Reset active on mouse hover
    document.addEventListener('mouseover', (e) => {
      const card = e.target.closest('.icon-item, .icon-bottom, .page-btn');
      if (card && card !== activeElement) {
        if (activeElement) activeElement.classList.remove('active');
        activeElement = card;
        activeElement.classList.add('active');
      }
    });
  }

  function init() {
    const statusBarMount = document.getElementById('statusBarMount');
    const searchMount = document.getElementById('searchMount');
    const pageView = document.getElementById('pageView');
    const helpMount = document.getElementById('helpMount');

    // 1. Render Status Bar
    window.PixlApp.StatusBar.render(statusBarMount);

    // 2. Render Search Box
    window.PixlApp.SearchBox.render(searchMount, (query) => {
      const currentPage = window.PixlApp.Router.getCurrentPage();
      if (currentPage) {
        currentPage.filter(query);
      }
    });

    // 3. Render Help Bar
    window.PixlApp.HelpBar.render(helpMount);

    // 4. Initialize Hash Router
    window.PixlApp.Router.init(pageView);

    // 5. Setup keyboard navigation
    setupGlobalKeyboard();
  }

  return {
    init
  };
})();

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.PixlApp.App.init();
});
