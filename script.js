const pubKey = "039d86309c4dc98c4ce0";
const apiKey = "6c457c3ad93930d7a9b1";
const photoSlider = document.getElementById('photoSlider');
const thumbGrid = document.getElementById('thumbGrid');
const modal = document.getElementById('galleryModal');
const modalContent = document.getElementById('modalContent');

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

  imageURLs = data.results.slice(0, 100).map(file => `https://ucarecdn.com/${file.uuid}/-/preview/400x400/`);

  if (imageURLs.length === 0) {
    photoSlider.textContent = "Nu sunt poze disponibile.";
  } else {
    startCarousel();
    showThumbnails();
  }
}

async function uploadImage(event) {
  const file = event.target.files[0];
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

  if (imageURLs.length === 0) {
    photoSlider.textContent = "Nu sunt poze disponibile.";
    return;
  }

  const imgLeft = document.createElement('img');
  const imgRight = document.createElement('img');

  imgLeft.src = imageURLs[currentIndex % imageURLs.length];
  imgRight.src = imageURLs[(currentIndex + 1) % imageURLs.length];

  photoSlider.appendChild(imgLeft);
  photoSlider.appendChild(imgRight);
}

function showThumbnails() {
  thumbGrid.innerHTML = "";
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.onclick = openFullGallery;
    thumbGrid.appendChild(img);
  });

  modalContent.innerHTML = "";
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    modalContent.appendChild(img);
  });
}

function openFullGallery() {
  modal.style.display = "block";
}

function closeFullGallery() {
  modal.style.display = "none";
}

// Atașare pentru cele două input-uri
document.getElementById('cameraInput').addEventListener('change', uploadImage);
document.getElementById('galleryInput').addEventListener('change', uploadImage);

window.onload = fetchImages;



