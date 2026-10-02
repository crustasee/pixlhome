# Project Structure

This repository contains a modular shortcuts homepage application with client-side
routing, component architecture, and responsive neo-brutalist styling. The homepage
can be opened directly in a browser or served with the included Node.js server.

## Application files

```text
/
├── index.html                 # Main application entry point & component mount points
├── Page_2.html                # Compatibility route (redirects to index.html#/page-2)
├── server.js                  # Dependency-free static file server
├── resources/                 # Site icons (.png, .jpg)
└── src/
    ├── css/
    │   ├── variables.css      # Design tokens (colors, neo-brutalist theme, shadows)
    │   ├── base.css           # Global resets, container layout, scrollbars
    │   ├── components.css     # Component styles (status-bar, search, grid, dock, help)
    │   └── main.css           # Unified entry CSS
    ├── data/
    │   └── shortcuts.js       # Central data store (Home shortcuts, Favorites, Extra links)
    ├── components/
    │   ├── StatusBar.js       # Status bar component (online indicator, live clock, count, tabs)
    │   ├── SearchBox.js       # Search component (Google search + live filtering)
    │   ├── IconCard.js        # Reusable card component (avatar generator & image error fallback)
    │   ├── FavoritesBar.js    # Dock quick-access bar with numeric hotkeys (1-8)
    │   └── HelpBar.js         # Keyboard navigation legend footer
    ├── pages/
    │   ├── HomePage.js        # Home page component (Main grid & favorites dock)
    │   └── ExtraPage.js       # Page 2 component (Extra shortcuts grid)
    ├── router.js              # Client-side hash router (#/ and #/page-2)
    └── app.js                 # App initialization, global spatial keyboard navigation
```

## Editing conventions

- Place components in `src/components/`, pages in `src/pages/`, styles in `src/css/`, and link data in `src/data/`.
- Scripts use classic browser scripts attaching to `window.PixlApp` so the app works reliably both via HTTP servers and when opened directly from disk (`file:///`).
- Shortcut icon paths can be relative (for example, `resources/google.png`) or external URLs.
- New links should include `name`, `url`, and `icon` fields and use an absolute URL for their destination.

## Running locally

Use Node.js to serve the site and its local assets:

```sh
node server.js
```

Then open `http://localhost:8080/`. Set `PORT` or `HOST` to change the server
port or bind address. No package installation or build step is required.
