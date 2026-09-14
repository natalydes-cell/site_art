const params = new URLSearchParams(window.location.search);
const id = params.get('id');

let painting = null;
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
      <div class="description">${painting.descriptionHtml || `<p>${painting.description}</p>`}</div>
      <div class="order-links">
        <a class="primary" href="https://max.ru/u/f9LHodD0cOLGrv2IVl0ph_U3VSbgk9J3b61NacFTRPmokoeO5pcAcMMpPfM" target="_blank" rel="noopener">Заказать в Max</a>
        <a href="https://t.me/Nataly_Xa" target="_blank" rel="noopener">Telegram</a>
        <a href="mailto:luminosartefact@gmail.com">Email</a>
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

async function init() {
  let list;
  try {
    list = await loadPaintings();
    if (!list.length) list = seedPaintings;
  } catch (err) {
    console.error('Не удалось загрузить каталог из Firebase, показываю резервные данные:', err);
    list = seedPaintings;
  }
  painting = list.find(p => p.id === id) || list[0];
  document.getElementById('pageTitle').textContent = `${painting.title} — Lumino's Artefact`;
  render();
}

init();
