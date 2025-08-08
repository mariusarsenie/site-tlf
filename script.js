const pubKey = "039d86309c4dc98c4ce0";
const apiKey = "6c457c3ad93930d7a9b1";
const photoSlider = document.getElementById('photoSlider');
const miniGallery = document.getElementById('miniGallery');
const fullGalleryOverlay = document.getElementById('fullGalleryOverlay');
const fullGallery = document.getElementById('fullGallery');

let imageURLs = [];
let currentIndex = 0;

async function fetchImages() {
  const res = await fetch('https://api.uploadcare.com/files/', {
    headers: {
      'Authorization': 'Uploadcare.Simple ' + pubKey + ':' + apiKey,
      'Accept': 'application/json',
    }
  });
  const data = await res.json();

  imageURLs = data.results.slice(0, 20).map(file => `https://ucarecdn.com/${file.uuid}/-/preview/400x400/`);

  if (imageURLs.length === 0) {
    photoSlider.textContent = "Nu sunt poze disponibile.";
    miniGallery.innerHTML = "";
  } else {
    startCarousel();
    updateMiniGallery();
  }
}

function updateMiniGallery() {
  miniGallery.innerHTML = "";
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    miniGallery.appendChild(img);
  });
}

function openFullGallery() {
  fullGalleryOverlay.style.display = "flex";
  fullGallery.innerHTML = "";
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    fullGallery.appendChild(img);
  });
}

function closeFullGallery() {
  fullGalleryOverlay.style.display = "none";
}

function startCarousel() {
  showImages();
  if (window.carouselInterval) clearInterval(window.carouselInterval);

  window.carouselInterval = setInterval(() => {
    currentIndex = (currentIndex + 2) % imageURLs.length;
    showImages();
  }, 2000);
}

function showImages() {
  photoSlider.innerHTML = "";
  const imgLeft = document.createElement('img');
  const imgRight = document.createElement('img');

  imgLeft.src = imageURLs[currentIndex % imageURLs.length];
  imgRight.src = imageURLs[(currentIndex + 1) % imageURLs.length];

  photoSlider.appendChild(imgLeft);
  photoSlider.appendChild(imgRight);
}

async function uploadImage(file) {
  if (!file) return alert("Alege o poză!");
  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", pubKey);
  formData.append("file", file);

  await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  });

  await fetchImages();
}

document.getElementById('cameraInput').addEventListener('change', e => {
  uploadImage(e.target.files[0]);
});

document.getElementById('galleryInput').addEventListener('change', e => {
  uploadImage(e.target.files[0]);
});

window.onload = fetchImages;
