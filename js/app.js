const APPWRITE_ENDPOINT = "https://appwrite.chjk.xyz/v1";
const APPWRITE_PROJECT_ID = "6968a0ae003339fc702b";

const client = new Appwrite.Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const account = new Appwrite.Account(client);
const { ID } = Appwrite;

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const msg = document.getElementById("msg");
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");

const redirectToHomework = () => {
  window.location.href = "js/homework.html";
};

const setMessage = (text, type = "info") => {
  if (!msg) return;
  msg.textContent = text;
  msg.dataset.type = type;
};

const showLoginTab = () => {
  loginForm.hidden = false;
  registerForm.hidden = true;
  loginForm.classList.add("visible");
  registerForm.classList.remove("visible");
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  setMessage("");
};

const showRegisterTab = () => {
  loginForm.hidden = true;
  registerForm.hidden = false;
  registerForm.classList.add("visible");
  loginForm.classList.remove("visible");
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  setMessage("");
};

const checkExistingSession = async () => {
  try {
    await account.get();
    redirectToHomework();
  } catch (error) {
    // no active session; stay on login
  }
};

if (tabLogin && tabRegister) {
  tabLogin.addEventListener("click", showLoginTab);
  tabRegister.addEventListener("click", showRegisterTab);
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    setMessage("Anmeldung laeuft...");

    try {
      await account.createEmailSession(email, password);
      setMessage("Login erfolgreich.", "success");
      redirectToHomework();
    } catch (err) {
      const reason = err?.message || "Login fehlgeschlagen.";
      setMessage(reason, "error");
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    setMessage("Account wird erstellt...");

    try {
      await account.create(ID.unique(), email, password);
      await account.createEmailSession(email, password);
      setMessage("Account erstellt und eingeloggt.", "success");
      redirectToHomework();
    } catch (err) {
      const reason = err?.message || "Registrierung fehlgeschlagen.";
      setMessage(reason, "error");
    }
  });
}

showLoginTab();
checkExistingSession();
