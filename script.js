
let count = 0;

// Poze simulate ca fiind adăugate de alți invitați (ex: din backend)
function adaugaPozeDeLaAltiInvitati() {
  const poze = [
    'https://via.placeholder.com/150x150.png?text=Selfie+1',
    'https://via.placeholder.com/150x150.png?text=Selfie+2',
    'https://via.placeholder.com/150x150.png?text=Selfie+3',
    'https://via.placeholder.com/150x150.png?text=Selfie+4',
  ];

  poze.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "animated-img " + (i % 2 === 0 ? "from-left" : "from-right");
    document.getElementById("photoSlider").appendChild(img);
  });
}

// Pozele încărcate de utilizator nu au animație specială
function uploadImage() {
  const input = document.getElementById("fileInput");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "animated-img";
      document.getElementById("photoSlider").appendChild(img);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Simulăm update-ul cu poze noi din backend la câteva secunde după încărcare
window.onload = function () {
  setTimeout(adaugaPozeDeLaAltiInvitati, 1000);
};
