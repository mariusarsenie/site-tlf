const pubKey = "039d86309c4dc98c4ce0"; // Înlocuiește dacă faci cheie nouă
const apiKey = "6c457c3ad93930d7a9b1"; // Cheia privată API
const photoSlider = document.getElementById('photoSlider');
const allGallerySection = document.querySelector('.all-gallery-section');
const allGallery = document.getElementById('allGallery');
const modalOverlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');

let imageURLs = [];
let currentIndex = 0;
let allGalleryVisible = false;

// Fetch imagini de pe Uploadcare
async function fetchImages() {
  try {
    const res = await fetch('https://api.uploadcare.com/files/', {
      headers: {
        'Authorization': 'Uploadcare.Simple ' + pubKey + ':' + apiKey,
        'Accept': 'application/json',
      }
    });
    const data = await res.json();

    imageURLs = data.results
      .filter(file => file.is_image)
      .slice(0, 50) // maxim 50 poze
      .map(file => `https://ucarecdn.com/${file.uuid}/-/preview/400x400/`);

    if(imageURLs.length === 0) {
      photoSlider.textContent = "Nu sunt poze disponibile.";
      allGallery.innerHTML = "Nu sunt poze disponibile.";
    } else {
      startCarousel();
      populateAllGallery();
    }
  } catch (e) {
    photoSlider.textContent = "Eroare la încărcarea pozelor.";
    allGallery.innerHTML = "Eroare la încărcarea pozelor.";
    console.error(e);
  }
}

// Porneste slideshow-ul din 2 în 2 poze
function startCarousel() {
  showImages();
  if(window.carouselInterval) clearInterval(window.carouselInterval);

  window.carouselInterval = setInterval(() => {
    currentIndex = (currentIndex + 2) % imageURLs.length;
    showImages();
  }, 2000);
}

// Afișează cele 2 poze din slideshow
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

  imgLeft.onclick = () => openModal(imgLeft.src);
  imgRight.onclick = () => openModal(imgRight.src);

  photoSlider.appendChild(imgLeft);
  photoSlider.appendChild(imgRight);
}

// Populează galeria completă cu toate pozele
function populateAllGallery() {
  allGallery.innerHTML = "";
  if (imageURLs.length === 0) {
    allGallery.textContent = "Nu sunt poze disponibile.";
    return;
  }
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.classList.add('gallery-thumb');
    img.onclick = () => openModal(url);
    allGallery.appendChild(img);
  });
}

// Arată/ascunde galeria completă
function toggleAllGallery() {
  allGalleryVisible = !allGalleryVisible;
  allGallerySection.style.display = allGalleryVisible ? "block" : "none";
}

// Deschide modal poza mare
function openModal(src) {
  modalImage.src = src;
  modalOverlay.style.display = "flex";
}

// Închide modal
function closeModal() {
  modalOverlay.style.display = "none";
  modalImage.src = "";
}

// Upload poză (folosit de ambele input-uri)
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", pubKey);
  formData.append("file", file);

  try {
    await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: formData,
    });

    await fetchImages();
  } catch(e) {
    alert("Eroare la încărcarea pozei.");
    console.error(e);
  }
}

// Funcții pentru input-urile camera și galerie
async function handleCameraInput(event) {
  const file = event.target.files[0];
  if (!file) return;
  await uploadFile(file);
  event.target.value = ""; // reset input
}

async function handleFileInput(event) {
  const file = event.target.files[0];
  if (!file) return;
  await uploadFile(file);
  event.target.value = ""; // reset input
}

// La încărcarea paginii, aduce pozele
window.onload = () => {
  fetchImages();
};

