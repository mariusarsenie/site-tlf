const photoSlider = document.getElementById('photoSlider');

let imageURLs = [
  "https://picsum.photos/id/237/400/400",
  "https://picsum.photos/id/238/400/400",
  "https://picsum.photos/id/239/400/400"
];
let currentIndex = 0;

function startCarousel() {
  showImages();
  setInterval(() => {
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

window.onload = startCarousel;
