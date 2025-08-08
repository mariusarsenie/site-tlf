const pubKey = "039d86309c4dc98c4ce0"; // Folosește cheia ta corectă
const apiKey = "6c457c3ad93930d7a9b1"; // Folosește cheia ta corectă

const photoSlider = document.getElementById('photoSlider');
const previewPhotos = document.getElementById('previewPhotos');
const fullGallery = document.getElementById('fullGallery');
const galleryPhotos = document.getElementById('galleryPhotos');
const closeGalleryBtn = document.getElementById('closeGallery');

let imageURLs = [];
let currentIndex = 0;

// Fetch imagini din Uploadcare
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

    if(imageURLs.length === 0) {
      photoSlider.textContent = "Nu sunt poze disponibile.";
      previewPhotos.textContent = "Nu sunt poze încărcate.";
    } else {
      startCarousel();
      updateGalleryUI();
    }
  } catch(e) {
    console.error("Eroare la fetchImages:", e);
    photoSlider.textContent = "Eroare la încărcarea pozelor.";
    previewPhotos.textContent = "Eroare la încărcarea pozelor.";
  }
}

// Încarcă o imagine în Uploadcare
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

    await fetchImages(); // Reîncarcă lista și UI-ul
  } catch(e) {
    alert("Eroare la încărcarea pozei.");
    console.error(e);
  }
}

// Carusel imagini în slider
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

// Actualizează miniaturile din preview (patratul mic)
function updatePreview() {
  previewPhotos.innerHTML = '';
  if(imageURLs.length === 0){
    previewPhotos.textContent = 'Nu sunt poze încărcate.';
    return;
  }
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    previewPhotos.appendChild(img);
  });
}

// Deschide galeria mare
function openGallery() {
  galleryPhotos.innerHTML = '';
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    galleryPhotos.appendChild(img);
  });
  fullGallery.classList.remove('hidden');
}

// Închide galeria mare
function closeGallery() {
  fullGallery.classList.add('hidden');
}

// Evenimente click pentru deschidere și închidere galerie
previewPhotos.addEventListener('click', openGallery);
closeGalleryBtn.addEventListener('click', closeGallery);

// Apeluri la încărcarea paginii
window.onload = async () => {
  await fetchImages();
};

// Actualizează preview și altele când se schimbă pozele
function updateGalleryUI() {
  updatePreview();
}



