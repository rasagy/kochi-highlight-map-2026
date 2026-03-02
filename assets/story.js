/* global config, mapboxgl, scrollama */

function alignClass(alignment) {
  if (alignment === "left") return "lefty";
  if (alignment === "right") return "righty";
  return "centered";
}

function setLayerOpacity(opacityConfig) {
  const paintProps = {
    fill: "fill-opacity",
    "fill-extrusion": "fill-extrusion-opacity",
    line: "line-opacity",
    circle: "circle-opacity",
    symbol: "icon-opacity",
    raster: "raster-opacity"
  };

  const layer = map.getLayer(opacityConfig.layer);
  if (!layer || !paintProps[layer.type]) return;
  map.setPaintProperty(opacityConfig.layer, paintProps[layer.type], opacityConfig.opacity);
}

mapboxgl.accessToken = config.accessToken;

const map = new mapboxgl.Map({
  container: "map",
  style: config.style,
  center: config.chapters[0].location.center,
  zoom: config.chapters[0].location.zoom,
  bearing: config.chapters[0].location.bearing,
  pitch: config.chapters[0].location.pitch,
  interactive: false
});

if (config.showMarkers) {
  new mapboxgl.Marker({ color: config.markerColor })
    .setLngLat(config.chapters[0].location.center)
    .addTo(map);
}

const story = document.getElementById("story");
const features = document.getElementById("features");
const header = document.getElementById("header");
const footer = document.getElementById("footer");

if (config.title) {
  const titleEl = document.createElement("h1");
  titleEl.textContent = config.title;
  header.appendChild(titleEl);
}
if (config.subtitle) {
  const subtitleEl = document.createElement("h2");
  subtitleEl.textContent = config.subtitle;
  header.appendChild(subtitleEl);
}
if (config.byline) {
  const bylineEl = document.createElement("p");
  bylineEl.textContent = config.byline;
  header.appendChild(bylineEl);
}

if (!header.innerText.trim()) {
  header.style.display = "none";
}

config.chapters.forEach((record, idx) => {
  const container = document.createElement("section");
  container.setAttribute("id", record.id);
  container.className = `step ${alignClass(record.alignment)}`;
  if (idx === 0) container.classList.add("active");

  if (record.title) {
    const chapterTitle = document.createElement("h3");
    chapterTitle.textContent = record.title;
    container.appendChild(chapterTitle);
  }

  if (record.image) {
    const image = document.createElement("img");
    image.src = record.image;
    image.alt = record.title || record.id;
    container.appendChild(image);
  }

  if (record.description) {
    const chapterDescription = document.createElement("p");
    chapterDescription.textContent = record.description;
    container.appendChild(chapterDescription);
  }

  if (record.hidden) container.style.visibility = "hidden";
  features.appendChild(container);
});

if (config.footer) {
  const footerText = document.createElement("p");
  footerText.innerHTML = config.footer;
  footer.appendChild(footerText);
}

if (!footer.innerText.trim()) {
  footer.style.display = "none";
}

const scroller = scrollama();

map.on("load", () => {
  if (config.use3dTerrain) {
    map.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14
    });
    map.setTerrain({ source: "mapbox-dem", exaggeration: 1.1 });
  }

  scroller
    .setup({
      step: ".step",
      offset: 0.55,
      progress: true
    })
    .onStepEnter((response) => {
      const chapter = config.chapters.find((chap) => chap.id === response.element.id);
      response.element.classList.add("active");

      if (chapter.mapAnimation === "flyTo") {
        map.flyTo(chapter.location);
      } else {
        map[chapter.mapAnimation](chapter.location);
      }

      if (config.showMarkers) {
        new mapboxgl.Marker({ color: config.markerColor })
          .setLngLat(chapter.location.center)
          .addTo(map);
      }

      if (chapter.onChapterEnter?.length) {
        chapter.onChapterEnter.forEach(setLayerOpacity);
      }

      if (chapter.rotateAnimation) {
        map.once("moveend", () => {
          const currentBearing = map.getBearing();
          map.rotateTo(currentBearing + 180, { duration: 12000, easing: (t) => t });
        });
      }

      if (chapter.callback) window[chapter.callback]();
    })
    .onStepExit((response) => {
      const chapter = config.chapters.find((chap) => chap.id === response.element.id);
      response.element.classList.remove("active");
      if (chapter.onChapterExit?.length) {
        chapter.onChapterExit.forEach(setLayerOpacity);
      }
    });
});

window.addEventListener("resize", scroller.resize);
