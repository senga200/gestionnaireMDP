let token = null;

const loginForm = document.getElementById("loginForm");
const passwordsList = document.getElementById("passwordsList");
const fetchPasswordsBtn = document.getElementById("fetchPasswordsBtn");

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
      passwordsList.textContent = "Erreur de connexion";
      return;
    }

    const data = await res.json();
    token = data.token;
    passwordsList.textContent = "Connecté avec succès !\nToken stocké.";
    fetchPasswordsBtn.disabled = false;
  } catch (err) {
    passwordsList.textContent = "Erreur: " + err.message;
  }
});

fetchPasswordsBtn.addEventListener("click", async () => {
  // on n'a plus accès au token car on ne l'envoie plus dans les headers donc on ne le stocke plus et du coup renvoie null
  //   if (!token) {
  //     passwordsList.textContent = "Tu dois te connecter d'abord";
  //     return;
  //   }

  try {
    const res = await fetch("/api/passwords", {
      //headers: { Authorization: "Bearer " + token }, => maintenant il ne faut plus passer le token dans les headers avec le httpOnly
      credentials: "include", // pour envoyer le cookie
    });

    if (!res.ok) {
      passwordsList.textContent =
        "Erreur lors de la récupération des mots de passe";
      return;
    }

    const data = await res.json();
    passwordsList.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    passwordsList.textContent = "Erreur: " + err.message;
  }
});
