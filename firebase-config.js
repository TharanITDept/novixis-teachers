// === Novixis Education — Firebase configuration ===
// 1. Go to https://console.firebase.google.com and create a project (or use an existing one).
// 2. In Project settings > General > "Your apps", add a Web app and copy the config object it gives you.
// 3. Paste those real values below, replacing every "YOUR_..." placeholder.
// 4. In the Firebase console: Build > Firestore Database > Create database (start in test mode is fine to begin).
// 5. Build > Authentication > Sign-in method > enable "Email/Password".
// 6. Build > Authentication > Users > Add user — create yourself an admin login (email + password).
//    That's the account you'll sign in with on admin.html.
// 7. Before going live, replace the default Firestore rules with the ones in FIRESTORE_RULES.txt
//    (included alongside this file) so random visitors can't read or edit your data.
window.NOVIXIS_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAA6fJujno1_66rWOiGZb233h0SZimWlQk",
  authDomain: "novixis-858986.firebaseapp.com",
  projectId: "novixis-858986",
  storageBucket: "novixis-858986.firebasestorage.app",
  messagingSenderId: "276523973565",
  appId: "1:276523973565:web:951867fb13971735d630d4",
  measurementId: "G-JBVSF98MMF",
  projectNumber: "276523973565"
};

window.novixisFirebaseReady = false;
window.novixisDb = null;
window.novixisAuth = null;
(function(){
  var cfg = window.NOVIXIS_FIREBASE_CONFIG;
  if (!cfg || cfg.apiKey === "YOUR_API_KEY" || !cfg.projectId) {
    console.warn('[Novixis] Firebase is not configured yet — edit firebase-config.js with your real project keys. Falling back to local-only storage.');
    return;
  }
  try {
    firebase.initializeApp(cfg);
    window.novixisDb = firebase.firestore();
    window.novixisAuth = firebase.auth();
    window.novixisFirebaseReady = true;
  } catch(e) {
    console.warn('[Novixis] Firebase failed to initialize:', e);
  }
})();
