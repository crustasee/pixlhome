window.PixlApp = window.PixlApp || {};

window.PixlApp.FavoritesBar = (() => {
  function render(container, favorites, actionButtonsHtml = '') {
    container.innerHTML = `
      <section class="panel" aria-label="Favorites">
        <div class="panel-header">
          <span class="panel-title">⭐ favorites</span>
          <span class="panel-badge">quick access [1-8]</span>
        </div>
        <div class="panel-body">
          <div class="bottom-bar" id="bottomBar" role="region" aria-label="Favorite shortcuts"></div>
          ${actionButtonsHtml ? `<div class="action-footer">${actionButtonsHtml}</div>` : ''}
        </div>
      </section>
    `;

    const bottomBarEl = container.querySelector('#bottomBar');
    favorites.forEach((item, idx) => {
      const a = document.createElement('a');
      a.className = 'icon-bottom';
      a.href = item.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.title = `${item.name} — Press ${idx + 1} to open`;
      a.dataset.favIndex = idx;
      a.dataset.url = item.url;
      a.setAttribute('role', 'link');
      a.setAttribute('tabindex', '0');

      if (item.icon) {
        const img = document.createElement('img');
        img.src = item.icon;
        img.alt = item.name;
        img.loading = 'lazy';
        img.onerror = function () {
          this.style.display = 'none';
          a.style.background = 'linear-gradient(135deg, #2a2a2a 0%, #111111 100%)';
          a.innerHTML = `<span class="fallback-text-large">${item.name.charAt(0).toUpperCase()}</span><span class="key-hint">${idx + 1}</span>`;
        };
        a.appendChild(img);
      } else {
        a.style.background = 'linear-gradient(135deg, #2a2a2a 0%, #111111 100%)';
        a.innerHTML = `<span class="fallback-text-large">${item.name.charAt(0).toUpperCase()}</span>`;
      }

      const keyHint = document.createElement('span');
      keyHint.className = 'key-hint';
      keyHint.textContent = idx + 1;
      a.appendChild(keyHint);

      bottomBarEl.appendChild(a);
    });
  }

  return {
    render
  };
})();
