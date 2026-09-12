const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const painting = paintings.find(p => p.id === id) || paintings[0];

document.getElementById('pageTitle').textContent = `${painting.title} — Lumino's Artefact`;

let current = 0;

function render() {
  const main = document.getElementById('paintingMain');
  main.innerHTML = `
    <div class="painting-media">
      <div class="main-frame">
        <img id="mainImg" src="${painting.images[current]}" alt="${painting.title}">
      </div>
      ${painting.images.length > 1 ? `
        <div class="thumb-row" id="thumbRow">
          ${painting.images.map((src, i) => `
            <button data-i="${i}" class="${i === current ? 'on' : ''}">
              <img src="${src}" alt="${painting.title}, фото ${i + 1}">
            </button>
          `).join('')}
        </div>
      ` : ''}
    </div>
    <div class="painting-info">
      <p class="cat">${painting.categoryLabel}</p>
      <h1>${painting.title}</h1>
      <p class="meta">${painting.meta}</p>
      <p class="price">${painting.price}</p>
      <p class="description">${painting.description}</p>
      <div class="order-links">
        <a class="primary" href="https://wa.me/00000000000" target="_blank" rel="noopener">Заказать в WhatsApp</a>
        <a href="https://t.me/your_telegram" target="_blank" rel="noopener">Telegram</a>
        <a href="mailto:youremail@example.com">Email</a>
      </div>
    </div>
  `;

  document.querySelectorAll('.thumb-row button').forEach(btn => {
    btn.addEventListener('click', () => {
      current = Number(btn.dataset.i);
      render();
    });
  });
}

render();
