window.PixlApp = window.PixlApp || {};

window.PixlApp.SearchBox = (() => {
  let formEl = null;
  let inputEl = null;
  let filterCallback = null;

  function render(container, onFilter) {
    filterCallback = onFilter;
    container.innerHTML = `
      <form class="search-box" action="https://www.google.com/search" method="GET" target="_blank" id="searchForm">
        <span class="search-prompt" aria-hidden="true">$</span>
        <input
          type="text"
          name="q"
          placeholder="Search Google or type to filter shortcuts..."
          autocomplete="off"
          autofocus
          id="searchInput"
          aria-label="Search or filter shortcuts"
        />
        <span class="search-hint">press / to focus</span>
      </form>
    `;

    formEl = container.querySelector('#searchForm');
    inputEl = container.querySelector('#searchInput');

    inputEl.addEventListener('input', (e) => {
      if (filterCallback) {
        filterCallback(e.target.value);
      }
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (inputEl.value) {
          inputEl.value = '';
          if (filterCallback) filterCallback('');
        } else {
          inputEl.blur();
        }
      }
    });
  }

  function getValue() {
    return inputEl ? inputEl.value : '';
  }

  function setValue(val) {
    if (inputEl) {
      inputEl.value = val;
      if (filterCallback) filterCallback(val);
    }
  }

  function focus() {
    if (inputEl) {
      inputEl.focus();
    }
  }

  function clear() {
    setValue('');
  }

  function getInput() {
    return inputEl;
  }

  return {
    render,
    getValue,
    setValue,
    focus,
    clear,
    getInput
  };
})();
