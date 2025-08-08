const pubKey = "039d86309c4dc98c4ce0";
const apiKey = "6c457c3ad93930d7a9b1";
const photoSlider = document.getElementById('photoSlider');
const thumbnailGallery = document.getElementById('thumbnailGallery');
const allPhotos = document.getElementById('allPhotos');

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

  imageURLs = data.results
    .filter(file => file.is_image)
    .slice(0, 50)
    .map(file => `https://ucarecdn.com/${file.uuid}/-/preview/400x400/`);

  showThumbnails();
  startCarousel();
}

function showThumbnails() {
  thumbnailGallery.innerHTML = "";
  allPhotos.innerHTML = "";

  imageURLs.forEach(url => {
    const thumb = document.createElement('img');
    thumb.src = url;
    thumbnailGallery.appendChild(thumb);

    const full = document.createElement('img');
    full.src = url;
    allPhotos.appendChild(full);
  });
}

function toggleFullGallery() {
  const fullGallery = document.getElementById('fullGallery');
  fullGallery.classList.toggle('visible');
}

function uploadImage() {
  const cameraFile = document.getElementById('cameraInput').files[0];
  const galleryFile = document.getElementById('galleryInput').files[0];
  const file = cameraFile || galleryFile;

  if (!file) return alert("Alege sau fă o poză mai întâi!");

  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", pubKey);
  formData.append("file", file);

  fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  }).then(() => fetchImages());
}

function startCarousel() {
  showImages();
  if(window.carouselInterval) clearInterval(window.carouselInterval);
  window.carouselInterval = setInterval(() => {
    currentIndex = (currentIndex + 2) % imageURLs.length;
    showImages();
  }, 2000);
}

function showImages() {
  photoSlider.innerHTML = "";

  if (imageURLs.length === 0) {
    photoSlider.textContent = "Nu sunt poze încă.";
    return;
  }

  const img1 = document.createElement('img');
  const img2 = document.createElement('img');

  img1.src = imageURLs[currentIndex % imageURLs.length];
  img2.src = imageURLs[(currentIndex + 1) % imageURLs.length];

  photoSlider.appendChild(img1);
  photoSlider.appendChild(img2);
}

window.onload = fetchImages;
