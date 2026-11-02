# Amar & Ananya — Wedding Website

Static site in plain HTML, CSS, and vanilla JS. No build step and no
dependencies. Pushing to `main` deploys it through GitHub Pages (repo root) to
https://amarandananya.com. DNS is managed in Wix (A records → GitHub Pages IPs,
`www` CNAME → `apunchhi.github.io`); `CNAME` holds the custom domain.

## Preview

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/. Use a server instead of opening the file directly,
because `quiz.js` is an ES module and browsers block modules on `file://`.
On Windows, `serve.ps1` does the same job.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | All markup and guest-facing copy |
| `styles.css` | Palette, layout, responsive rules, motion |
| `script.js` | Nav, hero sizing/parallax, garlands, reveals, live forecast |
| `quiz.js` / `quiz-data.js` | Couple quiz logic / questions, scores, results |
| `content.md` | Copy source of truth and open questions; mirror edits into `index.html` |
| `assets/` | Hero image, bloom SVGs, downloadable card, `photos/web/` library |
| `_herocrop.ps1` | Regenerates `assets/hero-scene-web.jpg` from the card |
| `planner-content.md` | Two by Two's copy for schedule, travel, FAQ (11/1); gitignored |
| `photos-src/`, `ananya-website-notes.md` | Originals and early notes; gitignored |

## Before launch

Do not go live until these are filled in. `grep -n "TODO(launch)" index.html`
finds the spots that still need them.

- [ ] Planners' call / WhatsApp number: the contact FAQ and the travel-agent
      FAQ in `index.html`, plus `PLANNER_WHATSAPP` in `script.js`. That
      constant is currently **Amar's number as a placeholder**; swap it for
      the planners'. Also run `grep -n "TODO(launch)" script.js`.

## Common edits

- **Planner WhatsApp:** set `PLANNER_WHATSAPP` at the top of `script.js` to
  digits only, country code included, no `+`.
- **Quiz:** edit `quiz-data.js`. Scores of `>= 2` give Ananya and `<= -2` give
  Amar; anything else is the blend result. If you change questions, bump
  `QUIZ_VERSION` in `quiz.js` so submissions to the Apps Script stay separable.
- **Photos:** put an optimized copy in `assets/photos/web/` and keep the
  original in `photos-src/`. The web folder is a library, and not every photo
  in it appears on the page. To swap a photo into a section:

  ```html
  <figure class="editorial-media" data-reveal="media">
    <img src="assets/photos/web/example.jpg" alt="..." width="..." height="..." loading="lazy" />
  </figure>
  ```

## Layout

Sections alternate `--paper` / `--paper-lift` backgrounds. On desktop, each
editorial row puts media on one side and copy on the other. At 900px and below,
rows stack into a single column.

1. Story: copy left, photos right
2. Celebrations: full-width, two date cards
3. Travel & Stay: copy left, weather and live forecast right
4. FAQ: back-to-back photo left
5. Couple Quiz: centered

**Lookbook: on hold.** It was removed on 1 Nov 2026 until we have the
lookbook. To bring it back, add a `<section id="lookbook">` between Travel and
FAQ, add the nav link, and re-alternate the `section-alt` backgrounds. The old
"A & A" placeholder styles (`.photo-placeholder`) were removed; recover them
with `git show 2121975:styles.css` if needed.

The page reads fine without JS. The forecast hides itself if Open-Meteo fails.
`prefers-reduced-motion` turns off entrances, sway, and parallax.

## Garlands and hero

- Each side has six garland strings, outermost first. The first string on each
  side is the longest marigold (`--g-max: 58vh`).
- `setupHero()` sizes the hero image so its bottom edge lines up with that
  marigold's tip at scroll 0. It recalculates after the image and fonts load
  and on every resize.
- `setupGarlands()` splits each string into one `.garland-bloom` per bloom,
  each carrying `--i` and `--n`. `styles.css` uses those values to make the
  sway grow with depth, so strings bend instead of swinging stiffly.
  Reduced-motion users get the single-background version.
- `_herocrop.ps1` cuts `x 80–1620, y 1620–2555` out of
  `assets/save-the-date.png` and saves the result at 1400px wide.
