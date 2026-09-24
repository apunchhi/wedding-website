(() => {
  "use strict";

  const WEDDING_DATES = ["2027-11-19", "2027-11-20"];
  const CHANDIGARH = { lat: 30.7333, lon: 76.7794 };
  const PLANNER_WHATSAPP = "";
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const WMO = {
    0: "Clear",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    80: "Showers",
    81: "Showers",
    82: "Heavy showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  };

  function setupNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function setupWhatsApp() {
    const link = document.querySelector("#planner-whatsapp");
    const digits = PLANNER_WHATSAPP.replace(/\D/g, "");
    if (!link || !digits) return;

    const text = encodeURIComponent(
      "Hi — I'm a guest at Amar and Ananya's wedding (19–20 Nov 2027). I'd like to share RSVP / flight details."
    );
    link.href = `https://wa.me/${digits}?text=${text}`;
    link.removeAttribute("aria-disabled");
    link.removeAttribute("title");
  }

  function setupHero() {
    const hero = document.querySelector(".hero");
    const figure = document.querySelector(".hero-scene");
    const image = figure?.querySelector("img");
    if (!hero || !figure || !image) return;

    const sizeScene = () => {
      const garlandLayer = document.querySelector(".garlands");
      if (!garlandLayer || getComputedStyle(garlandLayer).display === "none") {
        figure.style.removeProperty("--hero-scene-w");
        return;
      }
      const strings = [...document.querySelectorAll(".g-marigold")].filter(
        (element) => getComputedStyle(element).display !== "none"
      );
      if (!strings.length) {
        figure.style.removeProperty("--hero-scene-w");
        return;
      }

      const longestVh = Math.max(
        ...strings.map((element) =>
          Number.parseFloat(
            getComputedStyle(element).getPropertyValue("--g-max")
          )
        )
      );
      const aspect = image.naturalWidth / image.naturalHeight;
      if (!Number.isFinite(longestVh) || !aspect) return;

      const bloomW =
        Number.parseFloat(
          getComputedStyle(strings[0]).getPropertyValue("--bloom-w")
        ) || 32;
      const tip = (longestVh / 100) * window.innerHeight + bloomW * 0.6;
      let top = 0;
      for (let element = figure; element; element = element.offsetParent) {
        top += element.offsetTop;
      }
      const width = Math.max((tip - top) * aspect, 220);
      figure.style.setProperty("--hero-scene-w", `${Math.round(width)}px`);
    };

    const revealHero = () => {
      requestAnimationFrame(() => hero.classList.add("hero-ready"));
    };

    sizeScene();
    if (image.complete) {
      revealHero();
    } else {
      image.addEventListener(
        "load",
        () => {
          sizeScene();
          revealHero();
        },
        { once: true }
      );
    }
    document.fonts?.ready.then(() => {
      sizeScene();
      revealHero();
    });
    window.addEventListener("resize", sizeScene);
  }

  /* Each garland ships as a single element painting a repeating bloom
   * background, which can only rotate rigidly. Re-tiling the string as one
   * node per bloom lets styles.css ramp the throw with depth so it curves.
   * Reduced motion keeps the flat background version. */
  function setupGarlands() {
    if (reduceMotion) return;
    const strings = [...document.querySelectorAll(".garland")];
    if (!strings.length) return;

    const build = (string) => {
      const bloomHeight = Number.parseFloat(
        getComputedStyle(string).getPropertyValue("--bloom-h")
      );
      const { height } = string.getBoundingClientRect();
      if (!bloomHeight || !height) return;

      const count = Math.max(Math.floor(height / bloomHeight), 1);
      if (Number(string.dataset.blooms) === count) return;
      string.dataset.blooms = String(count);

      /* one extra node closes the string with the smaller hanging bloom */
      const blooms = Array.from({ length: count + 1 }, (ignored, index) => {
        const bloom = document.createElement("i");
        bloom.className =
          index === count ? "garland-bloom is-tip" : "garland-bloom";
        bloom.style.setProperty("--i", String(index));
        bloom.style.setProperty("--n", String(count));
        return bloom;
      });

      string.replaceChildren(...blooms);
      string.classList.add("is-fluid");
    };

    const buildAll = () => strings.forEach(build);
    buildAll();
    window.addEventListener("resize", buildAll);
  }

  /* The collage flexes to fill the space between the bookend photos, but only
   * if the media column is exactly as tall as the prose beside it. */
  function setupStoryMedia() {
    const row = document.querySelector(".story.editorial-row");
    const copy = row?.querySelector(".editorial-copy");
    const media = row?.querySelector(".story-media");
    if (!row || !copy || !media) return;

    const mobile = window.matchMedia("(max-width: 900px)");

    const sync = () => {
      if (mobile.matches) {
        media.style.removeProperty("height");
        return;
      }
      media.style.height = `${copy.offsetHeight}px`;
    };

    sync();
    window.addEventListener("resize", sync);
    mobile.addEventListener("change", sync);
    document.fonts?.ready.then(sync);
  }

  function setupReveals() {
    const elements = [...document.querySelectorAll("[data-reveal]")];
    if (!elements.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
    document.documentElement.classList.add("motion-ready");
  }

  function setupParallax() {
    const hero = document.querySelector(".hero");
    if (!hero || reduceMotion) return;

    const desktop = window.matchMedia("(min-width: 1331px)");
    let queued = false;

    const paint = () => {
      queued = false;
      const progress = desktop.matches
        ? Math.min(Math.max(window.scrollY / Math.max(hero.offsetHeight, 1), 0), 1)
        : 0;
      hero.style.setProperty("--hero-scroll", progress.toFixed(4));
      document.body.style.setProperty(
        "--paper-shift",
        `${Math.round(progress * 28)}px`
      );
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener("change", paint);
  }

  function setupActiveNav() {
    if (!("IntersectionObserver" in window)) return;
    const links = [...document.querySelectorAll(".site-nav a")];
    const lookup = new Map(
      links.map((link) => [link.getAttribute("href").slice(1), link])
    );
    const sections = [...lookup.keys()]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        links.forEach((link) => link.removeAttribute("aria-current"));
        lookup
          .get(visible.target.id)
          ?.setAttribute("aria-current", "location");
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function setupForecast() {
    const forecast = document.querySelector("#forecast");
    if (!forecast) return;

    const url =
      "https://api.open-meteo.com/v1/forecast?" +
      new URLSearchParams({
        latitude: String(CHANDIGARH.lat),
        longitude: String(CHANDIGARH.lon),
        current: "temperature_2m,weather_code",
        daily:
          "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        timezone: "Asia/Kolkata",
        forecast_days: "16",
      });

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then(({ current, daily }) => {
        const hasWedding = WEDDING_DATES.some((date) =>
          daily.time.includes(date)
        );

        const heading = document.createElement("h3");
        heading.textContent = "Live forecast";
        const now = document.createElement("p");
        now.className = "forecast-now";
        now.textContent = `Chandigarh right now: ${Math.round(
          current.temperature_2m
        )}°C / ${Math.round(
          (current.temperature_2m * 9) / 5 + 32
        )}°F, ${(WMO[current.weather_code] || "—").toLowerCase()}.`;
        const note = document.createElement("p");
        note.className = "forecast-note";
        note.textContent = hasWedding
          ? "19th and 20th November are in this window — those days are marked."
          : "A 16-day forecast can’t reach November 2027 yet. This is Chandigarh over the next two weeks; the wedding days will highlight themselves when we’re close.";
        const list = document.createElement("ol");
        list.className = "forecast-days";

        daily.time.forEach((iso, dayIndex) => {
          const item = document.createElement("li");
          if (WEDDING_DATES.includes(iso)) item.className = "is-wedding";
          const values = [
            [
              "forecast-date",
              new Date(`${iso}T12:00:00+05:30`).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                timeZone: "Asia/Kolkata",
              }),
            ],
            ["forecast-sky", WMO[daily.weather_code[dayIndex]] || "—"],
            [
              "forecast-temp",
              `${Math.round(
                daily.temperature_2m_max[dayIndex]
              )}° / ${Math.round(daily.temperature_2m_min[dayIndex])}°C`,
            ],
            [
              "forecast-pop",
              `${daily.precipitation_probability_max[dayIndex] ?? 0}% rain`,
            ],
          ];
          values.forEach(([className, text]) => {
            const span = document.createElement("span");
            span.className = className;
            span.textContent = text;
            item.append(span);
          });
          list.append(item);
        });

        const credit = document.createElement("p");
        credit.className = "sources forecast-credit";
        credit.append("Next 16 days from ");
        const link = document.createElement("a");
        link.href = "https://open-meteo.com/";
        link.rel = "noopener noreferrer";
        link.textContent = "Open-Meteo";
        credit.append(
          link,
          " (no API key; ECMWF / DWD). Wedding-weekend days light up once they’re inside that window."
        );

        forecast.replaceChildren(heading, now, note, list, credit);
        forecast.hidden = false;
        forecast.classList.add("is-visible");
      })
      .catch(() => {
        // The long-term climatology remains useful when live weather is absent.
      });
  }

  setupNav();
  setupWhatsApp();
  setupHero();
  setupGarlands();
  setupStoryMedia();
  setupReveals();
  setupParallax();
  setupActiveNav();
  setupForecast();
})();
