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

  const imgLeft = document.createElement('img');
  const imgRight = document.createElement('img');

  imgLeft.src = imageURLs[currentIndex % imageURLs.length];
  imgRight.src = imageURLs[(currentIndex + 1) % imageURLs.length];

  imgLeft.classList.add("left");
  imgRight.classList.add("right");

  photoSlider.appendChild(imgLeft);
  photoSlider.appendChild(imgRight);
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
