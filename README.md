# Amar & Ananya — Wedding Website

Zero-build informational site: semantic HTML, CSS, and vanilla JavaScript. No
React, Node, package manager, backend, or RSVP system.

## Preview

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Open http://localhost:8000/. Pass another port with `-Port 8080`.

The server is only for local preview. Deployment is the root `index.html`,
`styles.css`, `script.js`, and `assets/` directory on any static host.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Complete page markup and guest-facing copy |
| `styles.css` | Layout, palette, responsive behavior, and motion |
| `script.js` | Nav, hero sizing/parallax, reveals, forecast, and gallery |
| `assets/` | Web images, bloom SVGs, and downloadable card |
| `photos-src/` | Full-resolution originals; do not deploy |
| `content.md` | Copy source of truth; sync edits into `index.html` |
| `_herocrop.ps1` | Regenerates `assets/hero-scene-web.jpg` |
| `serve.ps1` | Dependency-free local HTTP preview |

Set `PLANNER_WHATSAPP` near the top of `script.js` to digits only, including
country code and no `+`.

## Cinematic behavior

JavaScript progressively adds:

- a staged hero entrance
- slow, desynchronized garland sway that curves down each string
- restrained desktop hero parallax
- directional section reveals matching each editorial row
- sticky editorial media on desktop
- an active navigation marker
- a live 16-day Open-Meteo forecast

The page is complete and readable if JavaScript or the forecast fails.
`prefers-reduced-motion: reduce` disables entrances, sway, parallax, and smooth
scrolling while preserving every control.

## Garlands and hero

The fixed garland layer uses six strings per side, ordered outermost first.
Both sides share the same breakpoints, so their visible counts remain equal.
The inner 66px slot is deliberately clear of the 1120px content column.

The first string on each side is the longest marigold (58vh).
`setupHero()` in `script.js` measures its tip after image/font load and on
resize, then sizes the hero image so both bottom edges meet at scroll position
zero. Sway never changes string length.

A string is one element painting a repeating bloom background, so on its own it
can only rotate rigidly. `setupGarlands()` re-tiles each string as one
`.garland-bloom` node per bloom, carrying `--i` and `--n`; `styles.css` derives
each node's throw from the square of its depth and lags it behind the node
above, so the string bends rather than leaning. The outermost string on each
side hangs flush with the viewport edge, so it swings inward only. The
background version stays as the baseline for no-JS and reduced motion.

`assets/hero-scene-web.jpg` is cut from `assets/save-the-date.png` by
`_herocrop.ps1`: `x 80–1620`, `y 1620–2555`, output 1400px wide.

## Editorial sections

Desktop sections alternate image and copy columns:

1. Story — image right
2. Celebrations — full-width copy and two date tiles
3. Travel & Stay — full-width copy with weather below
4. The Lookbook — placeholder left
5. FAQ
6. Our Couple Quiz — full-width centered introduction

Backgrounds alternate between `--paper` and `--paper-lift`. At 900px and below,
editorial rows stack into one column and horizontal reveals become vertical.

Replace a placeholder with:

```html
<figure class="editorial-media" data-reveal="media">
  <img src="assets/photos/web/example.jpg" alt="..." width="..." height="..." />
</figure>
```

## Photo storage

`photos-src/` contains originals and stays outside deployment. Only optimized
copies in `assets/photos/web/` are served. The alternate name-order card also
lives in `photos-src/`; the downloadable Amar-first version is
`assets/save-the-date.png`.
