const pubKey = "039d86309c4dc98c4ce0";
const apiKey = "6c457c3ad93930d7a9b1";

const photoSlider = document.getElementById('photoSlider');
const allPhotosGrid = document.getElementById('allPhotosGrid');
const toggleGallery = document.getElementById('toggleGallery');

let imageURLs = [];
let currentIndex = 0;

const fileCameraInput = document.getElementById('fileCamera');
const fileGalleryInput = document.getElementById('fileGallery');

let selectedFile = null;

// Permite alegerea unei poze fie din camera fie din galerie
fileCameraInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) selectedFile = e.target.files[0];
});

fileGalleryInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) selectedFile = e.target.files[0];
});

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
      .filter(file => file.isImage)
      .slice(0, 50)
      .map(file => `https://ucarecdn.com/${file.uuid}/-/preview/400x400/`);

    if(imageURLs.length === 0) {
      photoSlider.textContent = "Nu sunt poze disponibile.";
      allPhotosGrid.innerHTML = "";
    } else {
      startCarousel();
      populateAllPhotosGrid();
    }
  } catch (err) {
    photoSlider.textContent = "Eroare la încărcarea pozelor.";
    console.error(err);
  }
}

async function uploadImage() {
  if (!selectedFile) {
    alert("Alege o poză din galerie sau fă o poză cu camera!");
    return;
  }

  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", pubKey);
  formData.append("file", selectedFile);

  try {
    await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: formData,
    });

    selectedFile = null;
    fileCameraInput.value = "";
    fileGalleryInput.value = "";

    await fetchImages();
  } catch (err) {
    alert("Eroare la încărcare.");
    console.error(err);
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

  imgLeft.classList.add("left");
  imgRight.classList.add("right");

  photoSlider.appendChild(imgLeft);
  photoSlider.appendChild(imgRight);
}

function populateAllPhotosGrid() {
  allPhotosGrid.innerHTML = "";
  imageURLs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    allPhotosGrid.appendChild(img);
  });
}

toggleGallery.addEventListener('click', () => {
  allPhotosGrid.classList.toggle('hidden');
  if(allPhotosGrid.classList.contains('hidden')) {
    toggleGallery.textContent = "Toate pozele încărcate (click pentru galerie)";
  } else {
    toggleGallery.textContent = "Ascunde galeria";
  }
});

// Încarcă pozele la pornirea paginii
window.onload = fetchImages;
