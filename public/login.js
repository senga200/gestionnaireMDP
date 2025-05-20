let token = null;

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardBtn = document.getElementById("dashboardBtn");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      message.textContent = "Erreur de connexion";
      return;
    }

    const data = await res.json();
    token = data.token;
    message.textContent = "Connecté avec succès !\nToken stocké.";
    dashboardBtn.disabled = false;
    logoutBtn.disabled = false;
  } catch (err) {
    message.textContent = "Erreur: " + err.message;
  }
});
