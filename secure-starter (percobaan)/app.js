import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Firebase config kamu
const firebaseConfig = {
  apiKey: "AIzaSyC1nZ6mRQ8e2UxGICljLujaUiLeS813tkY",
  authDomain: "starter-ed0c5.firebaseapp.com",
  projectId: "starter-ed0c5",
  storageBucket: "starter-ed0c5.firebasestorage.app",
  messagingSenderId: "749688487613",
  appId: "1:749688487613:web:66c53f3bb82bcf277801d4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// UI Elements
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

let currentUser = null;

// Flash message
function flash(msg){ alert(msg); }

// ===== Register =====
registerForm.addEventListener("submit", async e=>{
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  const userRef = ref(db, `users/${username}`);
  const snapshot = await get(userRef);

  if(snapshot.exists()){
    flash("Username sudah digunakan");
    return;
  }

  await set(userRef, { username, password });
  flash("Akun berhasil dibuat. Silakan login");
});

// ===== Login =====
loginForm.addEventListener("submit", async e=>{
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  const snapshot = await get(ref(db, `users/${username}`));
  if(!snapshot.exists() || snapshot.val().password !== password){
    flash("Username/password salah");
    return;
  }

  currentUser = username;
  flash("Login sukses");
  showApp();
});

// ===== UI Handling & console log =====
function showApp(){
  loginSection.classList.add("hidden");
  registerSection.classList.add("hidden");

  console.log("=== Semua user terdaftar di Firebase ===");
  const usersRef = ref(db, "users");
  onValue(usersRef, snapshot=>{
    console.clear();
    snapshot.forEach(childSnap=>{
      console.log(childSnap.key, childSnap.val());
    });
  });
}

function showLogin(){
  loginSection.classList.remove("hidden");
  registerSection.classList.remove("hidden");
}
