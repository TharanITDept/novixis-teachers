// Initialize Firebase
const firebaseConfig = {
    projectId: "novixis-858986",
    appId: "1:276523973565:web:951867fb13971735d630d4",
    storageBucket: "novixis-858986.firebasestorage.app",
    apiKey: "AIzaSyAA6fJujno1_66rWOiGZb233h0SZimWlQk",
    authDomain: "novixis-858986.firebaseapp.com",
    messagingSenderId: "276523973565",
    measurementId: "G-JBVSF98MMF",
    projectNumber: "276523973565"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

function showError(msg) {
    errorMsg.style.display = 'block';
    errorMsg.innerText = msg;
    successMsg.style.display = 'none';
}

function showSuccess(msg) {
    successMsg.style.display = 'block';
    successMsg.innerText = msg;
    errorMsg.style.display = 'none';
}

// 1. Google Sign-In
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        checkUserRoleAndRedirect(result.user);
    }).catch((error) => {
        showError(error.message);
    });
}

// 2. Email & Password Sign-In
function loginWithEmail() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if(!email || !password) {
        showError("Please enter both email and password.");
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        checkUserRoleAndRedirect(userCredential.user);
    }).catch((error) => {
        showError(error.message);
    });
}

// 3. Email Link (Magic Link)
function sendMagicLink() {
    const email = document.getElementById('email').value;
    if(!email) {
        showError("Please enter your email address to receive a magic link.");
        return;
    }
    
    const actionCodeSettings = {
        url: window.location.href, // redirect back to this page
        handleCodeInApp: true
    };
    
    auth.sendSignInLinkToEmail(email, actionCodeSettings).then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        showSuccess(`Magic link sent to ${email}. Please check your inbox.`);
    }).catch((error) => {
        showError(error.message);
    });
}

// Check if returning from Magic Link
if (auth.isSignInWithEmailLink(window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        email = window.prompt('Please provide your email for confirmation');
    }
    
    auth.signInWithEmailLink(email, window.location.href).then((result) => {
        window.localStorage.removeItem('emailForSignIn');
        checkUserRoleAndRedirect(result.user);
    }).catch((error) => {
        showError(error.message);
    });
}

// Auth State Observer
auth.onAuthStateChanged((user) => {
    if (user && !auth.isSignInWithEmailLink(window.location.href)) {
        // User is already logged in, redirect them
        checkUserRoleAndRedirect(user);
    }
});

function checkUserRoleAndRedirect(user) {
    // For now, redirect to the dashboard. 
    // Later we will query Firestore `users` collection to verify they are an admin.
    window.location.href = "index.html";
}
