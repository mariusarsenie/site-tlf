// Aici adaugă link-urile tale Uploadcare (poze încărcate anterior)
const backendImages = [
  'https://ucarecdn.com/003b623e-5569-4f32-a313-85ef960f11aa/',
  // Poți adăuga aici alte link-uri dacă ai
];

let currentIndex = 0;

// Funcție care afișează câte 2 poze din backendImages în slider
function showNextImages() {
  const container = document.getElementById("photoSlider");
  container.innerHTML = "";

  for (let i = 0; i < 2; i++) {
    const img = document.createElement("img");
    img.src = backendImages[(currentIndex + i) % backendImages.length];
    container.appendChild(img);
  }

  currentIndex = (currentIndex + 2) % backendImages.length;
}

// Funcție care adaugă poza încărcată de la widget în backendImages și o afișează
function addUploadedPhoto() {
  const widget = uploadcare.Widget('[role=uploadcare-uploader]');
  const file = widget.value();

  if (!file) {
    alert("Selectează o poză înainte să încarci!");
    return;
  }

  // Obține URL-ul imaginii încărcate
  file.done(info => {
    const fileUrl = info.cdnUrl;
    backendImages.push(fileUrl);
    showNextImages();
  });
}

window.onload = () => {
  showNextImages();
  setInterval(showNextImages, 2000);
};
