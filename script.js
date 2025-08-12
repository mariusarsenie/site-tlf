const pubKey = "039d86309c4dc98c4ce0"; // Schimbă dacă vrei
const apiKey = "6c457c3ad93930d7a9b1";

const photoSlider = document.getElementById('photoSlider');
const showAllBtn = document.getElementById('showAllBtn');
const allGallerySection = document.querySelector('.all-gallery-section');
const allPhotosGrid = document.getElementById('allPhotosGrid');
const closeAllBtn = document.getElementById('closeAllBtn');

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');

let imageURLs = [];
let currentIndex = 0;

async function fetchImages() {
  try {
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
      showAllBtn.style.display = "none";
    } else {
      showAllBtn.style.display = "inline-block";
      startCrossfadeCarousel();
      prepareAllGallery();
    }
  } catch (e) {
    photoSlider.textContent = "Eroare la încărcarea pozelor.";
    console.error(e);
  }
}

async function uploadImage() {
  const input = document.getElementById('fileInput');
  const file = input.files[0];
  if (!file) return alert("Alege o poză!");

  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", pubKey);
  formData.append("file", file);

  try {
    await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: formData,
    });
    input.value = "";
    await fetchImages();
  } catch (e) {
    alert("Eroare la încărcare.");
    console.error(e);
  }
}

let crossfadeTimer;
function startCrossfadeCarousel() {
  photoSlider.innerHTML = '';

  // Creăm două img pentru crossfade
  const img1 = document.createElement('img');
  const img2 = document.createElement('img');

  img1.classList.add('visible');
  photoSlider.appendChild(img1);
  photoSlider.appendChild(img2);

  img1.src = imageURLs[0];
  img2.src = imageURLs[1 % imageURLs.length];
  currentIndex = 0;

  // Click pe imagine deschide modal
  img1.onclick = () => openModal(img1.src);
  img2.onclick = () => openModal(img2.src);

  let visibleImg = img1;

  if(crossfadeTimer) clearInterval(crossfadeTimer);

  crossfadeTimer = setInterval(() => {
    // Calc următoarea poză
    const nextIndex = (currentIndex + 2) % imageURLs.length;

    // Schimbăm sursele și opacitățile
    if (visibleImg === img1) {
      img2.src = imageURLs[nextIndex];
      img2.classList.add('visible');
      img1.classList.remove('visible');
      visibleImg = img2;
    } else {
      img1.src = imageURLs[nextIndex];
      img1.classList.add('visible');
      img2.classList.remove('visible');
      visibleImg = img1;
    }
    currentIndex = nextIndex;
  }, 2000);
}

function prepareAllGallery() {
  allPhotosGrid.innerHTML = "";
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = "Selfie de la nuntă";
    img.onclick = () => openModal(url);
    allPhotosGrid.appendChild(img);
  });
}

showAllBtn.onclick = () => {
  allGallerySection.classList.remove('hidden');
  document.querySelector('.gallery-section').classList.add('hidden');
};

closeAllBtn.onclick = () => {
  allGallerySection.classList.add('hidden');
  document.querySelector('.gallery-section').classList.remove('hidden');
};

function openModal(src) {
  modalImg.src = src;
  modal.classList.remove('hidden');
}

modalClose.onclick = () => {
  modal.classList.add('hidden');
  modalImg.src = "";
};

// Închide modal și la click pe fundal
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
    modalImg.src = "";
  }
};

window.onload = fetchImages;
