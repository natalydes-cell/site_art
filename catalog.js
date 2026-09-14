// Слой данных: каталог картин хранится в Firestore (коллекция "paintings"),
// это дает вам форму администратора для добавления/удаления работ без правки кода.

const CATEGORY_LABELS = { acrylic: "Акрил", graphic: "Графика" };

function catalogDb() {
  return firebase.firestore();
}

// Пока в firebase-config.js не вставлен реальный конфиг проекта, Firestore
// не отвечает ошибкой, а зависает в бесконечном ретрае — поэтому здесь
// стоит таймаут, чтобы сайт не завис в "Загрузка каталога..." навсегда.
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), ms))
  ]);
}

async function loadPaintings() {
  const snap = await withTimeout(
    catalogDb().collection('paintings').orderBy('createdAt', 'asc').get(),
    6000
  );
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Разово переносит стартовые 6 картин (из paintings.js) в Firestore, если база ещё пуста.
async function seedCatalogIfEmpty() {
  const snap = await catalogDb().collection('paintings').limit(1).get();
  if (!snap.empty) return false;

  const batch = catalogDb().batch();
  seedPaintings.forEach(p => {
    const { id, ...data } = p;
    const ref = catalogDb().collection('paintings').doc();
    batch.set(ref, { ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  });
  await batch.commit();
  return true;
}

async function addPainting(data) {
  return catalogDb().collection('paintings').add({
    ...data,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

async function deletePainting(id) {
  return catalogDb().collection('paintings').doc(id).delete();
}
