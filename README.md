# jack-monaghan.com

Static portfolio site (GitHub Pages). No build step: Tailwind and marked come from CDNs.

```
index.html          home: profile, resources, dashboard tiles, project cards
project.html        one project write-up: ?id=idoc or ?id=aoic
site.js             renders every page from files/site_data.js
site.css            theme (dark slate, glow gradient, cards, buttons)
files/site_data.js  ALL content: projects and their dashboards / repos
markdown/*.md       the project write-ups; bundle_markdown.py packs them into files/content.js
                    (the deploy workflow does this; run it locally after editing a write-up)
files/              CV.pdf, picture.jpg
```

## Edit

- Add or change a dashboard or repo: `files/site_data.js`. The dashboard tiles on
  the home page are derived from each project's `products`.
- Change a write-up: `markdown/<id>.md`.

## Preview

`python -m http.server` in this folder, then <http://localhost:8000>. Opening
`index.html` straight from disk works too once `python bundle_markdown.py` has been run.

## Deploy

`.github/workflows/static.yml` publishes the folder to GitHub Pages on every push to `main`.
