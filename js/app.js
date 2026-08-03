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
const db = firebase.firestore();

// Auth Guard
let currentUser = null;
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        currentUser = user;
        document.getElementById('userEmail').innerText = user.email;
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut();
});

// Sidebar Navigation Logic
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');
const pageTitle = document.getElementById('pageTitle');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all
        navItems.forEach(nav => nav.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked
        item.classList.add('active');
        const target = item.getAttribute('data-target');
        document.getElementById(`panel-${target}`).classList.add('active');
        pageTitle.innerText = item.innerText;
    });
});

// Jitsi Meet Integration
let api = null;

async function startJitsiMeeting(batchName) {
    const container = document.getElementById('jitsi-container');
    container.style.display = 'block';
    
    // Clear previous meeting if any
    if (api) {
        api.dispose();
    }

    // Generate a secure unique room name
    const uniqueRoomName = "NovixisClass-" + batchName.replace(/\s+/g, '') + "-" + Math.floor(Math.random() * 1000000);

    const domain = 'meet.jit.si';
    const options = {
        roomName: uniqueRoomName,
        width: '100%',
        height: '100%',
        parentNode: container,
        userInfo: {
            email: currentUser ? currentUser.email : '',
            displayName: 'Teacher'
        },
        configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false, // jump right in
        }
    };
    
    api = new JitsiMeetExternalAPI(domain, options);
    
    // Save to Firestore so students can join
    try {
        await db.collection('classes').doc('active_class').set({
            batch: batchName,
            roomName: uniqueRoomName,
            startedAt: firebase.firestore.FieldValue.serverTimestamp(),
            teacherEmail: currentUser ? currentUser.email : 'Unknown'
        });
        console.log("Class broadcasted to students!");
    } catch (e) {
        console.error("Error saving class to Firestore:", e);
    }
}
