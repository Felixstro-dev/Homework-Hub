const APPWRITE_ENDPOINT = "https://appwrite.chjk.xyz/v1";
const APPWRITE_PROJECT_ID = "6968a0ae003339fc702b";

let account;
let appwriteReady = false;

// Warte bis Appwrite geladen ist
function waitForAppwrite() {
  return new Promise((resolve) => {
    let checks = 0;
    const interval = setInterval(() => {
      checks++;
      if (window.Appwrite) {
        clearInterval(interval);
        appwriteReady = true;
        resolve(true);
      } else if (checks > 50) { // 5 Sekunden timeout
        clearInterval(interval);
        console.warn("Appwrite CDN konnte nicht geladen werden");
        resolve(false);
      }
    }, 100);
  });
}

async function initAppwrite() {
  if (!window.Appwrite) {
    return false;
  }

  try {
    const client = new Appwrite.Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID);

    account = new Appwrite.Account(client);
    return true;
  } catch (err) {
    console.error("Appwrite init error:", err);
    return false;
  }
}

async function startApp() {
  // Warte auf Appwrite oder nutze Timeout
  const isReady = await waitForAppwrite();
  
  if (!isReady) {
    document.getElementById("msg").textContent = "Fehler: Backend nicht verfügbar. Später erneut versuchen.";
    document.getElementById("msg").dataset.type = "error";
    return;
  }

  if (!await initAppwrite()) {
    document.getElementById("msg").textContent = "Fehler: Appwrite konnte nicht initialisiert werden.";
    document.getElementById("msg").dataset.type = "error";
    return;
  }

  initializeUI();
}

function initializeUI() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const msgEl = document.getElementById("msg");

  // Tab switching
  tabLogin.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.hidden = false;
    registerForm.hidden = true;
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    msgEl.textContent = "";
  });

  tabRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.hidden = true;
    registerForm.hidden = false;
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    msgEl.textContent = "";
  });

  // Check existing session
  checkSession();

  // Login submit
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      msgEl.textContent = "Bitte Email und Passwort eingeben.";
      msgEl.dataset.type = "error";
      return;
    }

    msgEl.textContent = "Anmeldung laeuft...";
    msgEl.dataset.type = "info";

    try {
      await account.createEmailSession(email, password);
      msgEl.textContent = "Login erfolgreich!";
      msgEl.dataset.type = "success";
      setTimeout(() => {
        window.location.href = "js/homework.html";
      }, 800);
    } catch (err) {
      msgEl.textContent = err.message || "Login fehlgeschlagen";
      msgEl.dataset.type = "error";
      console.error("Login error:", err);
    }
  });

  // Register submit
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;

    if (!email || !password) {
      msgEl.textContent = "Bitte Email und Passwort eingeben.";
      msgEl.dataset.type = "error";
      return;
    }

    if (password.length < 8) {
      msgEl.textContent = "Passwort muss mindestens 8 Zeichen lang sein.";
      msgEl.dataset.type = "error";
      return;
    }

    msgEl.textContent = "Account wird erstellt...";
    msgEl.dataset.type = "info";

    try {
      await account.create("unique()", email, password, email.split("@")[0]);
      msgEl.textContent = "Account erstellt! Logge ein...";
      msgEl.dataset.type = "success";
      
      setTimeout(async () => {
        try {
          await account.createEmailSession(email, password);
          msgEl.textContent = "Eingeloggt!";
          msgEl.dataset.type = "success";
          setTimeout(() => {
            window.location.href = "js/homework.html";
          }, 800);
        } catch (err) {
          msgEl.textContent = err.message || "Anmeldung fehlgeschlagen";
          msgEl.dataset.type = "error";
          console.error("Session error:", err);
        }
      }, 300);
    } catch (err) {
      msgEl.textContent = err.message || "Registrierung fehlgeschlagen";
      msgEl.dataset.type = "error";
      console.error("Register error:", err);
    }
  });
}

async function checkSession() {
  if (!account) return;
  try {
    await account.get();
    window.location.href = "js/homework.html";
  } catch (err) {
    // No session, stay on login
  }
}

// Start wenn DOM ready ist
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}
