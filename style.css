/* Fundal cer schimbat cu poza ta */
body {
  font-family: Arial, sans-serif;
  background: url("sky-with-clouds-1587031941zje.jpg") no-repeat center center fixed;
  background-size: cover;
  margin: 0;
  padding: 0;
  text-align: center;
  color: #003366;
}

/* Container imagine avion + text */
.header-image {
  position: relative;
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.header-image img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 0;
}

/* Text mare suprapus + data mică */
.text-on-image {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.small-text {
  font-size: 1.2rem;
  font-weight: normal;
  color: #e0e0e0;
  text-shadow: 2px 2px 5px rgba(0,0,0,0.7);
  white-space: nowrap;
}

/* Upload și galerie slider */
.upload-section, .gallery-section {
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.6);
  padding: 15px;
  border-radius: 10px;
  max-width: 400px;
}

/* Galerie slider cu 2 poze mai mici */
#photoSlider {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

#photoSlider img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.2);
  cursor: pointer;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

button {
  padding: 8px 16px;
  background-color: #003366;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #00509e;
}

/* Galerie mare (toate pozele) */
.gallery-all-section {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  max-width: 95vw;
  margin: 20px auto;
}

.gallery-all-section.hidden {
  display: none;
}

#galleryAll {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(100px,1fr));
  gap: 10px;
  margin-top: 15px;
}

#galleryAll img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

#galleryAll img:hover {
  transform: scale(1.05);
}

/* Popup poza mare */
#popupOverlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  display: none;
}

#popupOverlay img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255,255,255,0.8);
  cursor: pointer;
}
