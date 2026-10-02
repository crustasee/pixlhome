window.PixlApp = window.PixlApp || {};

window.PixlApp.Router = (() => {
  let mountContainer = null;
  let currentPage = null;
  let currentRoute = '';

  const routes = {
    '': window.PixlApp.HomePage,
    '#/': window.PixlApp.HomePage,
    '#/home': window.PixlApp.HomePage,
    '#/page-2': window.PixlApp.ExtraPage,
    '#/extra': window.PixlApp.ExtraPage
  };

  function resolveRoute(hash) {
    const cleanHash = (hash || '').trim();
    return routes[cleanHash] || window.PixlApp.HomePage;
  }

  function handleRouteChange() {
    const hash = window.location.hash || '#/';
    currentRoute = hash;

    currentPage = resolveRoute(hash);

    // Update active tab in StatusBar
    window.PixlApp.StatusBar.setActiveRoute(hash);

    // Apply existing filter text if any
    const currentSearchText = window.PixlApp.SearchBox.getValue();
    if (currentPage && mountContainer) {
      currentPage.render(mountContainer, currentSearchText);
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function init(container) {
    mountContainer = container;
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
  }

  function navigate(hash) {
    window.location.hash = hash;
  }

  function getCurrentPage() {
    return currentPage;
  }

  function getCurrentRoute() {
    return currentRoute;
  }

  return {
    init,
    navigate,
    getCurrentPage,
    getCurrentRoute
  };
})();
