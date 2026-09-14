// Конфиг вашего проекта Firebase.
// Взять здесь: Firebase Console → ⚙ Project settings → раздел "Your apps" → веб-приложение → SDK setup and configuration → Config.
// Это открытые идентификаторы проекта, не секретный ключ — их можно спокойно хранить в коде сайта.
const firebaseConfig = {
  apiKey: "ВСТАВЬТЕ_apiKey",
  authDomain: "ВАШ-ПРОЕКТ.firebaseapp.com",
  projectId: "ВАШ-ПРОЕКТ",
  storageBucket: "ВАШ-ПРОЕКТ.appspot.com",
  messagingSenderId: "ВСТАВЬТЕ_messagingSenderId",
  appId: "ВСТАВЬТЕ_appId"
};

firebase.initializeApp(firebaseConfig);
