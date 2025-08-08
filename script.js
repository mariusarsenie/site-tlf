const pubKey = "039d86309c4dc98c4ce0";
const apiKey = "6c457c3ad93930d7a9b1";

const photoSlider = document.getElementById('photoSlider');
const staticGallery = document.getElementById('staticGallery');
const fullGallery = document.getElementById('fullGallery');
const fullGalleryImages = document.getElementById('fullGalleryImages');
const fileInput = document.getElementById('fileInput');

let imageURLs = [];
let currentIndex = 0;
let capturePhoto = true; // dacă vrem captură camera sau galerie

// Schimbă mod input (camera sau galerie)
function setCapture(isCapture) {
  capturePhoto = isCapture;
  if (capturePhoto) {
    fileInput.setAttribute('capture', 'environment');
  } else {
    fileInput.removeAttribute('capture');
  }
  fileInput.click();
}

fileInput.addEventListener('change', () => {
  // doar afișăm fișierul ales (poate mai vrei validare)
});

// Încarcă poza în Uploadcare
async function uploadImage() {
  const file = fileInput.files[0];
  if (!file) {
    alert("Alege o poză!");
    return;
  }

  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", pubKey);
  formData.append("file", file);

  await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  });

  await fetchImages(); // Reîncarcă lista și repornește caruselul
  fileInput.value = "";
}

// Preia pozele din Uploadcare
async function fetchImages() {
  const res = await fetch('https://api.uploadcare.com/files/', {
    headers: {
      'Authorization': 'Uploadcare.Simple ' + pubKey + ':' + apiKey,
      'Accept': 'application/json',
    }
  });
  const data = await res.json();

  imageURLs = data.results.slice(0, 20).map(file => `https://ucarecdn.com/${file.uuid}/-/preview/400x400/`);

  if(imageURLs.length === 0) {
    photoSlider.textContent = "Nu sunt poze disponibile.";
  } else {
    startCarousel();
    updateStaticGallery();
  }
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

// Actualizează mini-galeria cu toate pozele
function updateStaticGallery() {
  staticGallery.innerHTML = "";
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.onclick = openFullGallery;
    staticGallery.appendChild(img);
  });
}

// Deschide galeria completă
function openFullGallery() {
  fullGallery.classList.remove('hidden');
  fullGalleryImages.innerHTML = "";
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    fullGalleryImages.appendChild(img);
  });
}

// Închide galeria completă
