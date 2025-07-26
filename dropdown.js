const toggle = document.getElementById('dropdownToggle');
  const menu = document.getElementById('dropdownMenu');
  const selectedImage = document.getElementById('selectedImage');

  toggle.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  document.querySelectorAll('.image-option img').forEach(img => {
    img.addEventListener('click', () => {
      selectedImage.src = img.src;
      selectedImage.style.display = 'block';
      toggle.innerText = 'Image selected ▼';
      menu.style.display = 'none';
    });
  });

  window.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      menu.style.display = 'none';
    }
  });