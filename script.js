
const backendImages = [
  'poza1.jpg',
  'poza2.jpg',
  'poza3.jpg',
  'poza4.jpg',
  'poza1.jpg',
  'poza2.jpg'
];

let currentIndex = 0;

function showNextImages() {
  const container = document.getElementById("photoSlider");
  container.innerHTML = ""; // Șterge imaginile vechi

  // Adaugă 2 imagini noi
  for (let i = 0; i < 2; i++) {
    const img = document.createElement("img");
    img.src = backendImages[(currentIndex + i) % backendImages.length];
    container.appendChild(img);
  }

  currentIndex = (currentIndex + 2) % backendImages.length;
}

function uploadImage() {
  const input = document.getElementById("fileInput");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      document.getElementById("photoSlider").appendChild(img);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

window.onload = function () {
  showNextImages();
  setInterval(showNextImages, 2000); // La fiecare 2 secunde
};
