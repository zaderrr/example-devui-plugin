# Example devUI Plugin — Countdown Timer

A simple countdown timer panel to demonstrate the devUI plugin system.

## Structure

```
example-devui-plugin/
  devui-plugin.json   # manifest (kind, label, entry point)
  dist/index.js       # pre-built ESM bundle, default-exports a React component
```

## Testing locally

Since the installer uses `git clone`, you can test by:

1. Init this as a git repo and push to GitHub
2. In devUI, open command palette → "Install App" → paste `youruser/example-devui-plugin`

Or for local testing without GitHub, manually copy this folder to `~/.devui/apps/local/countdown/`
and add an entry to `~/.devui/plugins.json`:

```json
[
  {
    "repoRef": "local/countdown",
    "manifest": {
      "kind": "countdown",
      "label": "Countdown",
      "shortLabel": "CD",
      "defaultSize": { "width": 400, "height": 300 },
      "entry": "dist/index.js"
    },
    "installedAt": "2026-03-14T00:00:00.000Z"
  }
]
```

Then reload devUI — the Countdown panel will appear in the spawn menu.
