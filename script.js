const pubKey = "039d86309c4dc98c4ce0"; 
const apiKey = "6c457c3ad93930d7a9b1"; 
const photoSlider = document.getElementById('photoSlider');
const galleryAll = document.getElementById('galleryAll');
const showAllBtn = document.getElementById('showAllBtn');

let imageURLs = [];
let currentIndex = 0;

// Fetch pozele de pe Uploadcare
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

  if(imageURLs.length === 0) {
    photoSlider.textContent = "Nu sunt poze disponibile.";
  } else {
    startCarousel();
    renderAllGallery();
  }
}

// Încarcă poză nouă
async function uploadImage() {
  const input = document.getElementById('fileInput');
  const file = input.files[0];
  if (!file) return alert("Alege o poză!");

  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", pubKey);
  formData.append("file", file);

  await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  });

  await fetchImages();
  input.value = ""; // resetează inputul
}

// Pornește carousel cu 2 poze mici
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

  for(let i = 0; i < 2; i++) {
    const img = document.createElement('img');
    img.src = imageURLs[(currentIndex + i) % imageURLs.length];
    img.addEventListener('click', () => showPopup(img.src));
    photoSlider.appendChild(img);
  }
}

// Toggle galerie mare (toate pozele)
function toggleGallery() {
  const gallerySection = document.querySelector('.gallery-all-section');
  gallerySection.classList.toggle('hidden');
}

// Render toate pozele în galerie mare
function renderAllGallery() {
  galleryAll.innerHTML = "";
  imageURLs.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.addEventListener('click', () => showPopup(src));
    galleryAll.appendChild(img);
  });
}

// Popup poza mare
function showPopup(src) {
  let overlay = document.getElementById('popupOverlay');
  if(!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'popupOverlay';
    overlay.addEventListener('click', () => {
      overlay.style.display = 'none';
    });
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<img src="${src}" alt="Poză mare" />`;
  overlay.style.display = 'flex';
}

window.onload = () => {
  fetchImages();
};
