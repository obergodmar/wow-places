# World of Warcraft — Best Places

Explore iconic World of Warcraft locations with immersive scenery, original music, and a game-inspired interface. Available in English and Russian.

[Visit the website](https://wow-places.obergodmar.tech)

## Agent workflows

The Agent Workflows Codex plugin is declared in `.agents/plugins/marketplace.json`, pinned to a reviewed Git commit, and enabled in `.codex/config.toml`. Project instructions remain in `AGENTS.md`.

From this trusted project, use Codex's plugin manager:

```sh
codex plugin marketplace add .
codex plugin add agent-workflows@agent-workflows
```

The desktop app can also install it from the Agent Workflows source in the Plugins Directory. Start a new Codex session after installation. Application dependencies, CI, and deployment do not require Codex or the plugin. To update, review a new source commit, change the catalog's `source.sha`, reinstall/refresh through Codex, and commit the catalog change. Keep personal agent state ignored.

## Controls

- **Esc** — close an open scenery panel or toggle settings.
- **Space** — pause or resume music when the scene is focused.
- **Mouse/touch drag** — pan scenery and scroll panels.

## Screenshots

![Views](screenshots/screenshot-1.png)
![Places](screenshots/screenshot-2.png)
![Settings](screenshots/screenshot-3.png)

## Asset caching

Next.js computes a content hash of `public/media` and `public/fonts` at build time.
Versioned URLs receive a one-year immutable cache policy; original URLs retain their
default cache policy. Rebuild (or restart the dev server) after changing these files.
External media URLs retain the cache policy of their own host.

The initial HTML preloads core UI textures, the main font, and the requested scene.
Other scenes and audio are loaded on demand.
