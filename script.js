const pubKey = "039d86309c4dc98c4ce0"; // Înlocuiește dacă faci cheie nouă
const apiKey = "6c457c3ad93930d7a9b1"; // Cheia privată API
const photoSlider = document.getElementById("photoSlider");
const allPhotosSection = document.getElementById("allPhotosSection");
const allPhotosGallery = document.getElementById("allPhotosGallery");
const imagePopup = document.getElementById("imagePopup");
const popupImg = document.getElementById("popupImg");

let imageURLs = [];
let currentIndex = 0;

async function fetchImages() {
  const res = await fetch("https://api.uploadcare.com/files/", {
    headers: {
      Authorization: "Uploadcare.Simple " + pubKey + ":" + apiKey,
      Accept: "application/json",
    },
  });
  const data = await res.json();

  imageURLs = data.results
    .slice(0, 50)
    .map(
      (file) =>
        `https://ucarecdn.com/${file.uuid}/-/preview/400x400/`
    );

  if (imageURLs.length === 0) {
    photoSlider.textContent = "Nu sunt poze disponibile.";
  } else {
    startCarousel();
  }
}

document.getElementById("cameraInput").addEventListener("change", uploadImage);
document.getElementById("galleryInput").addEventListener("change", uploadImage);

async function uploadImage(event) {
  const input = event.target;
  const file = input.files[0];
  if (!file) return alert("Alege o poză!");

  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", pubKey);
  formData.append("file", file);

  await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  });

  input.value = ""; // resetează inputul
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

  // arată doar 2 poze în slider
  const imgLeft = document.createElement("img");
  const imgRight = document.createElement("img");

  imgLeft.src = imageURLs[currentIndex % imageURLs.length];
  imgRight.src = imageURLs[(currentIndex + 1) % imageURLs.length];

  imgLeft.onclick = () => openPopup(imgLeft.src);
  imgRight.onclick = () => openPopup(imgRight.src);

  photoSlider.appendChild(imgLeft);
  photoSlider.appendChild(imgRight);
}

function showAllPhotos() {
  allPhotosSection.style.display = "block";
  document.querySelector(".gallery-section").style.display = "none";
  allPhotosGallery.innerHTML = "";

  if (imageURLs.length === 0) {
    allPhotosGallery.textContent = "Nu sunt poze disponibile.";
    return;
  }

  imageURLs.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Poză nuntă";
    img.onclick = () => openPopup(url);
    allPhotosGallery.appendChild(img);
  });
}

function closeAllPhotos() {
  allPhotosSection.style.display = "none";
  document.querySelector(".gallery-section").style.display = "block";
}

function openPopup(src) {
  popupImg.src = src;
  imagePopup.style.display = "flex";
}

function closePopup() {
  imagePopup.style.display = "none";
}

window.onload = async () => {
  await fetchImages();
};

