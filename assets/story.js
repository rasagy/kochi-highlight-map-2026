/* global config, mapboxgl, scrollama */

function showMapIssue(message) {
  var existing = document.getElementById("map-error");
  if (existing) {
    existing.textContent = message;
    return;
  }

  var banner = document.createElement("div");
  banner.id = "map-error";
  banner.textContent = message;
  document.body.appendChild(banner);
}

function alignClass(alignment) {
  if (alignment === "left") return "lefty";
  if (alignment === "right") return "righty";
  return "centered";
}

function enableGalleryDrag(gallery) {
  var isDown = false;
  var startX = 0;
  var scrollLeft = 0;

  gallery.addEventListener("mousedown", function (event) {
    isDown = true;
    gallery.classList.add("is-dragging");
    startX = event.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
  });

  gallery.addEventListener("mouseleave", function () {
    isDown = false;
    gallery.classList.remove("is-dragging");
  });

  gallery.addEventListener("mouseup", function () {
    isDown = false;
    gallery.classList.remove("is-dragging");
  });

  gallery.addEventListener("mousemove", function (event) {
    if (!isDown) return;
    event.preventDefault();
    var x = event.pageX - gallery.offsetLeft;
    var walk = (x - startX) * 1.2;
    gallery.scrollLeft = scrollLeft - walk;
  });
}

var story = document.getElementById("story");
var features = document.getElementById("features");
var header = document.getElementById("header");
var footer = document.getElementById("footer");

if (config.title) {
  var titleEl = document.createElement("h1");
  titleEl.textContent = config.title;
  header.appendChild(titleEl);
}
if (config.subtitle) {
  var subtitleEl = document.createElement("h2");
  subtitleEl.textContent = config.subtitle;
  header.appendChild(subtitleEl);
}
if (config.byline) {
  var bylineEl = document.createElement("p");
  bylineEl.textContent = config.byline;
  header.appendChild(bylineEl);
}

if (!header.textContent.trim()) {
  header.style.display = "none";
}

config.chapters.forEach(function (record, idx) {
  var container = document.createElement("section");
  container.setAttribute("id", record.id);
  container.className = "step " + alignClass(record.alignment);
  if (idx === 0) container.classList.add("active");

  if (record.title) {
    var chapterTitle = document.createElement("h3");
    chapterTitle.textContent = record.title;
    container.appendChild(chapterTitle);
  }

  if (Array.isArray(record.images) && record.images.length) {
    var gallery = document.createElement("div");
    gallery.className = "chapter-gallery";
    record.images.forEach(function (imageUrl, imageIndex) {
      var figure = document.createElement("figure");
      figure.className = "chapter-gallery-item";

      var galleryImage = document.createElement("img");
      galleryImage.src = imageUrl;
      galleryImage.alt = (record.title || record.id) + " photo " + (imageIndex + 1);
      galleryImage.loading = "lazy";
      figure.appendChild(galleryImage);

      gallery.appendChild(figure);
    });
    enableGalleryDrag(gallery);
    container.appendChild(gallery);
  } else if (record.image) {
    var image = document.createElement("img");
    image.src = record.image;
    image.alt = record.title || record.id;
    container.appendChild(image);
  }

  if (record.description) {
    var chapterDescription = document.createElement("p");
    chapterDescription.textContent = record.description;
    container.appendChild(chapterDescription);
  }

  if (record.hidden) container.style.visibility = "hidden";
  features.appendChild(container);
});

if (config.footer) {
  var footerText = document.createElement("p");
  footerText.innerHTML = config.footer;
  footer.appendChild(footerText);
}

if (!footer.textContent.trim()) {
  footer.style.display = "none";
}

if (window.location.protocol === "file:") {
  showMapIssue("Map disabled on file://. Run a local server (e.g., python3 -m http.server 8000) and open http://localhost:8000.");
}

if (typeof mapboxgl === "undefined") {
  showMapIssue("Mapbox GL JS failed to load. Check internet access and script URL.");
  throw new Error("mapboxgl is undefined");
}
if (typeof scrollama === "undefined") {
  showMapIssue("Scrollama failed to load. Check internet access and script URL.");
  throw new Error("scrollama is undefined");
}

mapboxgl.accessToken = config.accessToken;

var map = new mapboxgl.Map({
  container: "map",
  style: config.style,
  center: config.chapters[0].location.center,
  zoom: config.chapters[0].location.zoom,
  bearing: config.chapters[0].location.bearing,
  pitch: config.chapters[0].location.pitch,
  interactive: false
});

function setLayerOpacity(opacityConfig) {
  var paintProps = {
    fill: "fill-opacity",
    "fill-extrusion": "fill-extrusion-opacity",
    line: "line-opacity",
    circle: "circle-opacity",
    symbol: "icon-opacity",
    raster: "raster-opacity"
  };

  var layer = map.getLayer(opacityConfig.layer);
  if (!layer || !paintProps[layer.type]) return;
  map.setPaintProperty(opacityConfig.layer, paintProps[layer.type], opacityConfig.opacity);
}

if (config.showMarkers) {
  new mapboxgl.Marker({ color: config.markerColor })
    .setLngLat(config.chapters[0].location.center)
    .addTo(map);
}

map.on("error", function (event) {
  if (event && event.error && event.error.message) {
    showMapIssue("Map error: " + event.error.message);
  } else {
    showMapIssue("Map failed to load. Check access token, style URL, and network.");
  }
});

var scroller = scrollama();

map.on("load", function () {
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
    .onStepEnter(function (response) {
      var chapter = config.chapters.find(function (chap) {
        return chap.id === response.element.id;
      });
      response.element.classList.add("active");
      if (!chapter) return;

      if (chapter.mapAnimation === "flyTo") {
        map.flyTo(chapter.location);
      } else if (typeof map[chapter.mapAnimation] === "function") {
        map[chapter.mapAnimation](chapter.location);
      } else {
        map.flyTo(chapter.location);
      }

      if (config.showMarkers) {
        new mapboxgl.Marker({ color: config.markerColor })
          .setLngLat(chapter.location.center)
          .addTo(map);
      }

      if (Array.isArray(chapter.onChapterEnter) && chapter.onChapterEnter.length) {
        chapter.onChapterEnter.forEach(setLayerOpacity);
      }

      if (chapter.rotateAnimation) {
        map.once("moveend", function () {
          var currentBearing = map.getBearing();
          map.rotateTo(currentBearing + 180, { duration: 12000, easing: function (t) { return t; } });
        });
      }

      if (chapter.callback && typeof window[chapter.callback] === "function") {
        window[chapter.callback]();
      }
    })
    .onStepExit(function (response) {
      var chapter = config.chapters.find(function (chap) {
        return chap.id === response.element.id;
      });
      response.element.classList.remove("active");
      if (chapter && Array.isArray(chapter.onChapterExit) && chapter.onChapterExit.length) {
        chapter.onChapterExit.forEach(setLayerOpacity);
      }
    });
});

window.addEventListener("resize", function () {
  scroller.resize();
});
