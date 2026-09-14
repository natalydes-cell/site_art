const gallery = document.getElementById('gallery');
const catButtons = document.querySelectorAll('.cat-btn');

let activeCat = 'all';
let paintings = [];
const cardImageIndex = new Map(); // id -> текущий индекс фото в карточке

function renderGallery() {
  gallery.innerHTML = '';
  const list = paintings.filter(p => activeCat === 'all' || p.category === activeCat);

  list.forEach(p => {
    if (!cardImageIndex.has(p.id)) cardImageIndex.set(p.id, 0);
    const idx = cardImageIndex.get(p.id);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-frame" data-id="${p.id}">
        <img src="${p.images[idx]}" alt="${p.title}" loading="lazy">
        <div class="quick-hint">Быстрый просмотр</div>
        ${p.images.length > 1 ? `<div class="card-dots">${p.images.map((_, i) => `<button data-i="${i}" class="${i === idx ? 'on' : ''}"></button>`).join('')}</div>` : ''}
      </div>
      <div class="card-body">
        <p class="card-cat">${p.categoryLabel}</p>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-meta">${p.meta}</p>
        <div class="card-footer-row">
          <p class="card-price">${p.price}</p>
          <a class="card-link" href="painting.html?id=${p.id}">Подробнее →</a>
        </div>
      </div>
    `;

    const frame = card.querySelector('.card-frame');
    frame.addEventListener('click', (e) => {
      if (e.target.closest('.card-dots')) return;
      openModal(p.id);
    });

    card.querySelectorAll('.card-dots button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        cardImageIndex.set(p.id, Number(btn.dataset.i));
        renderGallery();
      });
    });

    gallery.appendChild(card);
  });
}

catButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    catButtons.forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    activeCat = btn.dataset.cat;
    renderGallery();
  });
});

async function initGallery() {
  gallery.innerHTML = '<p class="loading">Загрузка каталога…</p>';
  try {
    paintings = await loadPaintings();
  } catch (err) {
    console.error('Не удалось загрузить каталог из Firebase, показываю резервные данные:', err);
    paintings = seedPaintings;
  }
  renderGallery();
}

initGallery();

/* ---------- quick-view modal ---------- */
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalDots = document.getElementById('modalDots');
const modalCat = document.getElementById('modalCat');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalLink = document.getElementById('modalLink');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentPainting = null;
let currentImg = 0;

function openModal(id) {
  currentPainting = paintings.find(p => p.id === id);
  currentImg = 0;
  fillModal();
  modal.classList.remove('hidden');
}

function fillModal() {
  const p = currentPainting;
  modalImg.src = p.images[currentImg];
  modalImg.alt = p.title;
  modalCat.textContent = p.categoryLabel;
  modalTitle.textContent = p.title;
  modalMeta.textContent = p.meta;
  modalPrice.textContent = p.price;
  modalDesc.textContent = p.description;
  modalLink.href = `painting.html?id=${p.id}`;

  modalDots.innerHTML = p.images.length > 1
    ? p.images.map((_, i) => `<button data-i="${i}" class="${i === currentImg ? 'on' : ''}"></button>`).join('')
    : '';
  modalDots.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentImg = Number(btn.dataset.i);
      fillModal();
    });
  });

  const multi = p.images.length > 1;
  modalPrev.style.display = multi ? 'flex' : 'none';
  modalNext.style.display = multi ? 'flex' : 'none';
}

function closeModal() {
  modal.classList.add('hidden');
  modalImg.src = '';
  currentPainting = null;
}

modalPrev.addEventListener('click', () => {
  currentImg = (currentImg - 1 + currentPainting.images.length) % currentPainting.images.length;
  fillModal();
});

modalNext.addEventListener('click', () => {
  currentImg = (currentImg + 1) % currentPainting.images.length;
  fillModal();
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
