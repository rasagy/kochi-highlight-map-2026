# Kochi Biennale Story Map (2026)

Scroll-based storytelling map built with the Mapbox storytelling pattern.

## Local development

Serve this folder with any static server from the project root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Do not open `index.html` directly with `file://...`; Mapbox GL JS may fail to load map resources in that mode.

## GitHub Pages deployment

1. Push this repo to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Under **Build and deployment**, choose:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Save and wait for Pages to publish.
5. Open the generated Pages URL to verify:
   - the custom style loads,
   - chapter 1 opens at Kochi,
   - chapter 2 zooms to Fort Kochi Aspinwall while scrolling.

## Troubleshooting blank map

- If you only see text cards and no map, check the top error banner in the page.
- Common causes:
  - opening with `file://` instead of a local web server,
  - Mapbox token restrictions that do not allow `localhost`/your Pages domain,
  - invalid or private style URL access for the current token.
