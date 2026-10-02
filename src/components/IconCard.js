window.PixlApp = window.PixlApp || {};

window.PixlApp.IconCard = (() => {
  const GRADIENTS = [
    'linear-gradient(135deg, #2a2a2a 0%, #111111 100%)',
    'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
    'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
    'linear-gradient(135deg, #7c2d12 0%, #431407 100%)',
    'linear-gradient(135deg, #831843 0%, #500724 100%)',
    'linear-gradient(135deg, #134e4a 0%, #042f2e 100%)'
  ];

  function getFallbackGradient(name) {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return GRADIENTS[sum % GRADIENTS.length];
  }

  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function create(item, index, keyHintText) {
    const card = document.createElement('a');
    card.className = 'icon-item';
    card.href = item.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.title = `${item.name} — Enter to open`;
    card.dataset.index = index;
    card.dataset.name = slugify(item.name);
    card.dataset.url = item.url;
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');

    const iconBox = document.createElement('div');
    iconBox.className = 'icon-box';
    iconBox.style.background = getFallbackGradient(item.name);

    if (item.icon) {
      const img = document.createElement('img');
      img.src = item.icon;
      img.alt = `${item.name} icon`;
      img.loading = 'lazy';
      img.onerror = function () {
        this.style.display = 'none';
        iconBox.innerHTML = `<span class="fallback-text">${item.name.charAt(0).toUpperCase()}</span>`;
      };
      iconBox.appendChild(img);
    } else {
      iconBox.innerHTML = `<span class="fallback-text">${item.name.charAt(0).toUpperCase()}</span>`;
    }

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = item.name;

    card.appendChild(iconBox);
    card.appendChild(label);

    if (keyHintText) {
      const keyHint = document.createElement('span');
      keyHint.className = 'key-hint';
      keyHint.textContent = keyHintText;
      card.appendChild(keyHint);
    }

    return card;
  }

  return {
    create,
    getFallbackGradient,
    slugify
  };
})();
