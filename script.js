const pubKey = "039d86309c4dc98c4ce0"; // Cheia publică Uploadcare
const apiKey = "6c457c3ad93930d7a9b1"; // Cheia privată API
const photoSlider = document.getElementById('photoSlider');

let imageURLs = [];
let currentIndex = 0;
let carouselInterval = null;
let showingAll = false;

// Preia toate pozele din Uploadcare cu paginare
async function fetchAllImages() {
  let allResults = [];
  let url = 'https://api.uploadcare.com/files/?limit=100';

  while (url) {
    const res = await fetch(url, {
      headers: {
        'Authorization': 'Uploadcare.Simple ' + pubKey + ':' + apiKey,
        'Accept': 'application/json',
      }
    });
    const data = await res.json();

    allResults = allResults.concat(data.results);
    url = data.next; // URL-ul paginii următoare, sau null dacă s-a terminat
  }

  imageURLs = allResults.map(file => `https://ucarecdn.com/${file.uuid}/-/preview/400x400/`);
}

// Afișează două poze ca slider (carousel)
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

  imgLeft.classList.add("left");
  imgRight.classList.add("right");

  // Adaugă click pe poză pentru mărire
  imgLeft.addEventListener('click', () => openModal(imgLeft.src));
  imgRight.addEventListener('click', () => openModal(imgRight.src));

  photoSlider.appendChild(imgLeft);
  photoSlider.appendChild(imgRight);
}

// Porneste carousel-ul (slider-ul cu 2 poze care se schimba)
function startCarousel() {
  showImages();
  if (carouselInterval) clearInterval(carouselInterval);

  carouselInterval = setInterval(() => {
    currentIndex = (currentIndex + 2) % imageURLs.length;
    showImages();
  }, 2000);
}

// Buton pentru a arăta toate pozele
function showAllImages() {
  showingAll = true;
  if (carouselInterval) clearInterval(carouselInterval);

  photoSlider.innerHTML = "";

  if (imageURLs.length === 0) {
    photoSlider.textContent = "Nu sunt poze disponibile.";
    return;
  }

  // Creează o galerie grid cu toate pozele
  const galleryDiv = document.createElement('div');
  galleryDiv.classList.add('all-gallery');

  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.classList.add('gallery-thumb');
    img.addEventListener('click', () => openModal(url));
    galleryDiv.appendChild(img);
  });

  photoSlider.appendChild(galleryDiv);
}

// Upload imagine nouă în Uploadcare
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

  await initGallery();
}

// Modal pentru poza mărită
function openModal(src) {
  // Creează un overlay
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');

  // Creează imaginea mărită
  const img = document.createElement('img');
  img.src = src;
  img.classList.add('modal-image');

  overlay.appendChild(img);

  // Click pe overlay închide modalul
  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  document.body.appendChild(overlay);
}

// Inițializează și afișează galeria normală
async function initGallery() {
  showingAll = false;
  await fetchAllImages();

  if (imageURLs.length === 0) {
    photoSlider.textContent = "Nu sunt poze disponibile.";
  } else {
    startCarousel();
  }
}

window.onload = () => {
  initGallery();

  // Adaugă butonul "Vezi toate pozele"
  const gallerySection = document.querySelector('.gallery-section');
  const btn = document.createElement('button');
  btn.textContent = "Vezi toate pozele";
  btn.style.marginTop = "10px";
  btn.addEventListener('click', () => {
    if (showingAll) {
      // Dacă deja vedem toate, revenim la slider
      showingAll = false;
      startCarousel();
      btn.textContent = "Vezi toate pozele";
    } else {
      // Arată toate pozele
      showAllImages();
      btn.textContent = "Vezi slider-ul";
    }
  });
  gallerySection.appendChild(btn);
};
