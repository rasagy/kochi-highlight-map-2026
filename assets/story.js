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

function normalizeImageItem(imageItem) {
  if (typeof imageItem === "string") {
    return { src: imageItem, note: "" };
  }
  if (imageItem && typeof imageItem === "object" && imageItem.src) {
    return { src: imageItem.src, note: imageItem.note || "" };
  }
  return { src: "", note: "" };
}

function createImageModal() {
  var modal = document.createElement("div");
  modal.id = "image-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Fullscreen image viewer");

  var card = document.createElement("div");
  card.id = "image-modal-card";

  var image = document.createElement("img");
  image.id = "image-modal-img";
  image.alt = "";
  card.appendChild(image);

  var note = document.createElement("p");
  note.id = "image-modal-note";
  card.appendChild(note);

  modal.appendChild(card);

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    image.src = "";
    image.alt = "";
    note.textContent = "";
    card.style.removeProperty("--polaroid-tilt");
  }

  function openModal(src, alt, imageNote) {
    var tilt = (Math.random() * 10 - 5).toFixed(2) + "deg";
    card.style.setProperty("--polaroid-tilt", tilt);
    image.src = src;
    image.alt = alt || "Fullscreen image";
    note.textContent = imageNote || "";
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
  }

  modal.addEventListener("click", closeModal);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  document.body.appendChild(modal);

  return { openModal: openModal, closeModal: closeModal };
}

function enableGalleryDrag(gallery) {
  var isDown = false;
  var startX = 0;
  var scrollLeft = 0;
  var dragged = false;

  gallery.addEventListener("mousedown", function (event) {
    isDown = true;
    dragged = false;
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
    if (Math.abs(x - startX) > 6) dragged = true;
    var walk = (x - startX) * 1.2;
    gallery.scrollLeft = scrollLeft - walk;
  });

  gallery.addEventListener(
    "click",
    function (event) {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    },
    true
  );
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
    record.images.forEach(function (imageItem, imageIndex) {
      var normalizedImage = normalizeImageItem(imageItem);
      if (!normalizedImage.src) return;
      var figure = document.createElement("figure");
      figure.className = "chapter-gallery-item";

      var galleryImage = document.createElement("img");
      galleryImage.src = normalizedImage.src;
      galleryImage.alt = (record.title || record.id) + " photo " + (imageIndex + 1);
      galleryImage.loading = "lazy";
      galleryImage.dataset.note = normalizedImage.note;
      figure.appendChild(galleryImage);

      gallery.appendChild(figure);
    });
    enableGalleryDrag(gallery);
    container.appendChild(gallery);
  } else if (record.image) {
    var singleImage = normalizeImageItem(record.image);
    var image = document.createElement("img");
    image.src = singleImage.src;
    image.alt = record.title || record.id;
    image.dataset.note = singleImage.note || record.imageNote || "";
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

var imageModal = createImageModal();
Array.prototype.forEach.call(features.querySelectorAll("img"), function (img) {
  img.classList.add("zoomable-image");
  img.addEventListener("click", function () {
    imageModal.openModal(img.src, img.alt, img.dataset.note || "");
  });
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
