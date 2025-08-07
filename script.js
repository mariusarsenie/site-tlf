const backendImages = [
  'https://ucarecdn.com/003b623e-5569-4f32-a313-85ef960f11aa/', 
  'https://ucarecdn.com/alt-url-poza-2/',
  'https://ucarecdn.com/alt-url-poza-3/',
  'https://ucarecdn.com/alt-url-poza-4/'
  // Adaugă aici toate linkurile tale Uploadcare
];

let currentIndex = 0;

function showNextImages() {
  const container = document.getElementById("photoSlider");
  container.innerHTML = "";  // Șterge imaginile vechi

  // Adaugă 2 imagini noi
  for (let i = 0; i < 2; i++) {
    const img = document.createElement("img");
    img.src = backendImages[(currentIndex + i) % backendImages.length];
    container.appendChild(img);
  }

  currentIndex = (currentIndex + 2) % backendImages.length;
}

window.onload = function () {
  showNextImages();
  setInterval(showNextImages, 2000);  // Schimbă la fiecare 2 secunde
};

// Dacă vrei, poți lăsa funcția uploadImage goală sau afișând un mesaj
function uploadImage() {
  alert("Uploadul nu este implementat încă.");
}
