window.PixlApp = window.PixlApp || {};

window.PixlApp.ExtraPage = (() => {
  let mountContainer = null;
  let currentFilter = '';

  function render(container, filterQuery = '') {
    mountContainer = container;
    currentFilter = (filterQuery || '').trim().toLowerCase();

    const { extra } = window.PixlApp.data;
    const allLinks = extra.grid;

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
      <!-- Extra Links Panel -->
      <section class="panel" aria-label="Extra Shortcuts">
        <div class="panel-header">
          <span class="panel-title">⚡ ${extra.title}</span>
          <span class="panel-badge" id="extraFilterBadge">${filterText}</span>
        </div>
        <div class="panel-body">
          <div class="icon-grid" id="extraIconGrid" role="region" aria-label="Extra Shortcuts Grid"></div>
          <div class="action-footer">
            <a class="page-btn dashboard-btn" href="https://pixlape.vercel.app" target="_blank" rel="noopener noreferrer">PIXLAPE ↗</a>
            <a class="page-btn" href="#/">← BACK TO HOME</a>
          </div>
        </div>
      </section>
    `;

    const gridEl = container.querySelector('#extraIconGrid');
    if (filteredLinks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = `No extra shortcuts match "${currentFilter}". Press Enter to search on Google.`;
      gridEl.appendChild(empty);
    } else {
      filteredLinks.forEach((item, idx) => {
        const hintText = idx < 9 ? `ctrl+${idx + 1}` : '';
        const card = window.PixlApp.IconCard.create(item, idx, hintText);
        gridEl.appendChild(card);
      });
    }

    // Update status bar count
    window.PixlApp.StatusBar.updateCount(allLinks.length);
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
