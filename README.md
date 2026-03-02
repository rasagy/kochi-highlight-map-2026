# Kochi Biennale Story Map (2026)

Scroll-based storytelling map built with the Mapbox storytelling pattern.

## Local development

Serve this folder with any static server from the project root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

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
