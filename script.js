const pubKey = "039d86309c4dc98c4ce0";
const apiKey = "6c457c3ad93930d7a9b1";

const photoSlider = document.getElementById('photoSlider');
const staticGallery = document.getElementById('staticGallery');
const fullGallery = document.getElementById('fullGallery');
const fullGalleryImages = document.getElementById('fullGalleryImages');

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
  imageURLs = data.results.slice(0, 50).map(file => `https://ucarecdn.com/${file.uuid}/-/preview/400x400/`);

  if (imageURLs.length === 0) {
    photoSlider.textContent = "Nu sunt poze disponibile.";
  } else {
    startCarousel();
    buildStaticGallery();
    buildFullGallery();
  }
}

function showImages() {
  photoSlider.innerHTML = '';
  const img1 = new Image();
  const img2 = new Image();

  img1.src = imageURLs[currentIndex % imageURLs.length];
  img2.src = imageURLs[(currentIndex + 1) % imageURLs.length];

  photoSlider.appendChild(img1);
  photoSlider.appendChild(img2);
}

function startCarousel() {
  showImages();
  if (window.carouselInterval) clearInterval(window.carouselInterval);
  window.carouselInterval = setInterval(() => {
    currentIndex = (currentIndex + 2) % imageURLs.length;
    showImages();
  }, 2000);
}

function buildStaticGallery() {
  staticGallery.innerHTML = '';
  imageURLs.forEach(url => {
    const img = new Image();
    img.src = url;
    staticGallery.appendChild(img);
  });
}

function buildFullGallery() {
  fullGalleryImages.innerHTML = '';
  imageURLs.forEach(url => {
    const img = new Image();
    img.src = url;
    fullGalleryImages.appendChild(img);
  });
}

function toggleFullGallery() {
  fullGallery.classList.toggle('hidden');
}

async function uploadSelectedImage() {
  const cameraFile = document.getElementById('cameraInput').files[0];
  const galleryFile = document.getElementById('galleryInput').files[0];
  const file = cameraFile || galleryFile;

  if (!file) return alert("Alege o poză mai întâi!");

  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", pubKey);
  formData.append("file", file);

  await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  });

  await fetchImages();
}

window.onload = fetchImages;
