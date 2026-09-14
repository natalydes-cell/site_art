// Слой данных: каталог картин хранится в Firestore (коллекция "paintings"),
// это дает вам форму администратора для добавления/удаления работ без правки кода.

const CATEGORY_LABELS = { acrylic: "Акрил", graphic: "Графика" };

function catalogDb() {
  return firebase.firestore();
}

async function loadPaintings() {
  const snap = await catalogDb().collection('paintings').orderBy('createdAt', 'asc').get();
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
