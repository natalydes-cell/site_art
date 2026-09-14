const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const addForm = document.getElementById('addForm');
const addStatus = document.getElementById('addStatus');
const itemsList = document.getElementById('itemsList');
const seedBtn = document.getElementById('seedBtn');

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    loginSection.hidden = true;
    adminSection.hidden = false;
    refreshList();
  } else {
    loginSection.hidden = false;
    adminSection.hidden = true;
  }
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  loginError.textContent = '';
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    loginForm.reset();
  } catch (err) {
    loginError.textContent = 'Не удалось войти: проверьте почту и пароль.';
  }
});

logoutBtn.addEventListener('click', () => firebase.auth().signOut());

addForm.addEventListener('submit', async e => {
  e.preventDefault();
  addStatus.textContent = 'Сохранение…';
  const fd = new FormData(addForm);
  const images = fd.get('images').split('\n').map(s => s.trim()).filter(Boolean);
  const category = fd.get('category');

  const data = {
    title: fd.get('title').trim(),
    category,
    categoryLabel: CATEGORY_LABELS[category] || category,
    meta: fd.get('meta').trim(),
    price: fd.get('price').trim(),
    description: fd.get('description').trim(),
    images
  };

  try {
    await addPainting(data);
    addForm.reset();
    addStatus.textContent = 'Готово — картина добавлена и уже видна на сайте.';
    refreshList();
  } catch (err) {
    console.error(err);
    addStatus.textContent = 'Ошибка сохранения: ' + err.message;
  }
});

seedBtn.addEventListener('click', async () => {
  seedBtn.disabled = true;
  seedBtn.textContent = 'Импорт…';
  try {
    const added = await seedCatalogIfEmpty();
    seedBtn.textContent = added ? 'Готово — 6 картин загружены' : 'В базе уже есть картины';
  } catch (err) {
    seedBtn.textContent = 'Ошибка импорта';
    console.error(err);
  }
  refreshList();
});

async function refreshList() {
  itemsList.innerHTML = '<p class="admin-status">Загрузка…</p>';
  let list;
  try {
    list = await loadPaintings();
  } catch (err) {
    itemsList.innerHTML = '<p class="admin-status">Не удалось загрузить каталог: ' + err.message + '</p>';
    return;
  }

  if (!list.length) {
    itemsList.innerHTML = '<p class="admin-status">Каталог пуст.</p>';
    return;
  }

  itemsList.innerHTML = list.map(p => `
    <div class="item-row">
      <img src="${p.images && p.images[0] ? p.images[0] : ''}" alt="${p.title}">
      <div>
        <p class="item-title">${p.title}</p>
        <p class="item-meta">${p.categoryLabel} · ${p.price}</p>
      </div>
      <button class="item-delete" data-id="${p.id}">Удалить</button>
    </div>
  `).join('');

  itemsList.querySelectorAll('.item-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Удалить эту картину из каталога?')) return;
      await deletePainting(btn.dataset.id);
      refreshList();
    });
  });
}
