let count = 0;

function uploadImage() {
  const input = document.getElementById("fileInput");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "animated-img " + (count % 2 === 0 ? "from-left" : "from-right");
      document.getElementById("photoSlider").appendChild(img);
      count++;
    };
    reader.readAsDataURL(input.files[0]);
  }
}
