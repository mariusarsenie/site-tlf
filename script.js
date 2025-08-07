let count = 0;

// Simulare: adaugă poze vechi cu animație la început
window.onload = function () {
  const oldImages = [
    'https://via.placeholder.com/150x150.png?text=Poza+1',
    'https://via.placeholder.com/150x150.png?text=Poza+2',
    'https://via.placeholder.com/150x150.png?text=Poza+3',
    'https://via.placeholder.com/150x150.png?text=Poza+4'
  ];

  oldImages.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "animated-img " + (i % 2 === 0 ? "from-left" : "from-right");
    document.getElementById("photoSlider").appendChild(img);
  });
};

function uploadImage() {
  const input = document.getElementById("fileInput");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "animated-img"; // fără animație specială pentru noi poze
      document.getElementById("photoSlider").appendChild(img);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
