window.PixlApp = window.PixlApp || {};

window.PixlApp.HelpBar = (() => {
  function render(container) {
    container.innerHTML = `
      <div class="help-bar" aria-label="Keyboard shortcuts guide">
        <span><kbd>/</kbd> focus search</span>
        <span><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> spatial navigate</span>
        <span><kbd>enter</kbd> open link</span>
        <span><kbd>esc</kbd> clear / blur</span>
        <span><kbd>1</kbd>–<kbd>8</kbd> favorites</span>
        <span><kbd>alt</kbd>+<kbd>1</kbd>/<kbd>2</kbd> switch page</span>
      </div>
    `;
  }

  return {
    render
  };
})();
