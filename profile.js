// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDLmDOVDYHMrx856WTVlC-AYhEhFUQvNec",
  authDomain: "witm-d28ce.firebaseapp.com",
  databaseURL: "https://witm-d28ce-default-rtdb.firebaseio.com",
  projectId: "witm-d28ce",
  storageBucket: "witm-d28ce.appspot.com",
  messagingSenderId: "361026083423",
  appId: "1:361026083423:web:1a207ba6efc173612e59ea",
  measurementId: "G-ZBD1D4NRT0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Sign Up Logic
document.getElementById("signupBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const street = document.getElementById("street").value;
  const buildingType = document.getElementById("buildingType").value;
  const neighborhood = document.getElementById("neighborhood").value;
  const city = document.getElementById("city").value;
  const postalCode = document.getElementById("postalCode").value;

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Realtime Database
    await set(ref(db, `users/${user.uid}`), {
      name,
      surname,
      email,
      phoneNumber,
      address: {
        street,
        buildingType,
        neighborhood,
        city,
        postalCode
      }
    });

    document.getElementById("userStatus").innerText = "✅ Account created successfully!";
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

// Sign In Logic
document.getElementById("signinBtn").addEventListener("click", async () => {
  const email = document.getElementById("signinEmail").value;
  const password = document.getElementById("signinPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("userStatus").innerText = `✅ Signed in as ${email}`;
  } catch (error) {
    console.error(error);
    alert("❌ Invalid credentials. Try again.");
  }
});

// Google Sign In
document.getElementById("googleSignInBtn").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user data only if new
    await set(ref(db, `users/${user.uid}`), {
      fullName: user.displayName,
      email: user.email
    });

    document.getElementById("userStatus").innerText = `✅ Signed in with Google: ${user.displayName}`;
  } catch (error) {
    console.error(error);
    alert("❌ Google Sign-In failed.");
  }
});
