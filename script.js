const pubKey = "039d86309c4dc98c4ce0";
const apiKey = "6c457c3ad93930d7a9b1";
const photoSlider = document.getElementById('photoSlider');

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
    .filter(file => file.is_image && file.mime_type.startsWith("image/"))
    .slice(0, 20)
    .map(file => `https://ucarecdn.com/${file.uuid}/-/preview/400x400/`);

  startCarousel();
}

function startCarousel() {
  showImages();
  setInterval(() => {
    currentIndex = (currentIndex + 2) % imageURLs.length;
    showImages();
  }, 2000);
}

function showImages() {
  photoSlider.innerHTML = "";

  const img1 = document.createElement('img');
  const img2 = document.createElement('img');

  img1.src = imageURLs[currentIndex % imageURLs.length];
  img2.src = imageURLs[(currentIndex + 1) % imageURLs.length];

  img1.classList.add("active");
  img2.classList.add("active");

  photoSlider.appendChild(img1);
  photoSlider.appendChild(img2);
}

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

  fetchImages(); // reîncarcă galeria
}

window.onload = fetchImages;
