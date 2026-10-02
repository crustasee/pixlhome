window.PixlApp = window.PixlApp || {};

window.PixlApp.HomePage = (() => {
  let mountContainer = null;
  let currentFilter = '';

  function render(container, filterQuery = '') {
    mountContainer = container;
    currentFilter = (filterQuery || '').trim().toLowerCase();

    const { home } = window.PixlApp.data;
    const allLinks = home.grid;

    const filteredLinks = currentFilter
      ? allLinks.filter(item =>
          item.name.toLowerCase().includes(currentFilter) ||
          window.PixlApp.IconCard.slugify(item.name).includes(currentFilter)
        )
      : allLinks;

    const filterText = currentFilter
      ? `filter: "${currentFilter}" (${filteredLinks.length})`
      : `all (${filteredLinks.length})`;

    container.innerHTML = `
      <!-- Main Links Panel -->
      <section class="panel" aria-label="Main Shortcuts">
        <div class="panel-header">
          <span class="panel-title">🔗 ${home.title}</span>
          <span class="panel-badge" id="gridFilterBadge">${filterText}</span>
        </div>
        <div class="panel-body">
          <div class="icon-grid" id="mainIconGrid" role="region" aria-label="Shortcuts Grid"></div>
        </div>
      </section>

      <!-- Favorites Section Mount -->
      <div id="favoritesMount"></div>
    `;

    const gridEl = container.querySelector('#mainIconGrid');
    if (filteredLinks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = `No shortcuts match "${currentFilter}". Press Enter to search on Google.`;
      gridEl.appendChild(empty);
    } else {
      filteredLinks.forEach((item, idx) => {
        const hintText = idx < 9 ? `ctrl+${idx + 1}` : '';
        const card = window.PixlApp.IconCard.create(item, idx, hintText);
        gridEl.appendChild(card);
      });
    }

    // Render Favorites section
    const favMount = container.querySelector('#favoritesMount');
    const actionButtons = `
      <a class="page-btn dashboard-btn" href="https://pixlape.vercel.app" target="_blank" rel="noopener noreferrer">PIXLAPE ↗</a>
      <a class="page-btn" href="#/page-2">PAGE 2 →</a>
    `;
    window.PixlApp.FavoritesBar.render(favMount, home.favorites, actionButtons);

    // Update status bar count
    window.PixlApp.StatusBar.updateCount(allLinks.length + home.favorites.length);
  }

  function filter(query) {
    if (mountContainer) {
      render(mountContainer, query);
    }
  }

  return {
    render,
    filter
  };
})();
