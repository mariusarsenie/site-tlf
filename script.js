const photoSlider = document.getElementById('photoSlider');
const allPhotosSection = document.getElementById('allPhotosSection');
const allPhotosGrid = document.getElementById('allPhotosGrid');

let photos = [];

function uploadImage(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      photos.push(e.target.result);
      updateSlider();
    };

    reader.readAsDataURL(file);
  }
}

function updateSlider() {
  photoSlider.innerHTML = '';

  // Afișăm două poze câte două în slider
  for (let i = 0; i < photos.length; i += 2) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '1rem';
    container.style.justifyContent = 'center';
    container.style.marginBottom = '1rem';

    const img1 = document.createElement('img');
    img1.src = photos[i];
    img1.alt = 'Selfie zbor';
    img1.onclick = showAllPhotos;

    container.appendChild(img1);

    if (i + 1 < photos.length) {
      const img2 = document.createElement('img');
      img2.src = photos[i + 1];
      img2.alt = 'Selfie zbor';
      img2.onclick = showAllPhotos;
      container.appendChild(img2);
    }

    photoSlider.appendChild(container);
  }
}

function showAllPhotos() {
  allPhotosGrid.innerHTML = '';
  photos.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Poza încărcată';
    allPhotosGrid.appendChild(img);
  });
  allPhotosSection.style.display = 'block';
}

function hideAllPhotos() {
  allPhotosSection.style.display = 'none';
}
