// Hero weather chip — Open-Meteo, bez klucza API.
// Strategia:
//   1) Świeży cache (<30 min) → render i nie pinguj.
//   2) Stary cache → render natychmiast (instant feedback) i odśwież w tle.
//   3) Brak cache → próbuj fetch; jak padnie, zostaje statyczny tekst w HTML.
(function () {
  const el = document.querySelector(".hero__weather");
  if (!el) return;

  const LAT = 51.98;
  const LON = 16.80;
  const CACHE_KEY = "cichoWeather";
  const TTL_MS = 30 * 60 * 1000;
  const URL =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + LAT + "&longitude=" + LON +
    "&current=temperature_2m,weather_code" +
    "&timezone=Europe%2FWarsaw";

  function iconFor(code) {
    if (code === 0) return "☀";
    if (code <= 3) return "⛅";
    if (code === 45 || code === 48) return "◐";
    if (code >= 51 && code <= 57) return "☂";
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "☂";
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "❄";
    if (code >= 95) return "⚡";
    return "●";
  }

  function render(data) {
    const t = Math.round(data.temp);
    const sign = t >= 0 ? "+" : "";
    el.textContent = iconFor(data.code) + " dziś " + sign + t + "°C w Cichowie";
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ temp: data.temp, code: data.code, ts: Date.now() })
      );
    } catch (_) {}
  }

  const cached = readCache();
  const fresh = cached && Date.now() - cached.ts < TTL_MS;

  if (fresh) {
    render(cached);
    return;
  }

  if (cached) render(cached);

  fetch(URL)
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (d) {
      const data = { temp: d.current.temperature_2m, code: d.current.weather_code };
      writeCache(data);
      render(data);
    })
    .catch(function () {
      // fetch padł — jeśli nie było cache, statyczny tekst w HTML zostaje
    });
})();
