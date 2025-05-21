const fetchPasswordsBtn = document.getElementById("fetchPasswordsBtn");
const passwordsList = document.getElementById("passwordsList");
const passwordForm = document.getElementById("passwordForm");

//attendre que le DOM soit chargé avant d'exécuter le code et vérifier si l utilisateur est co
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include", // pour envoyer le cookie
    });

    if (res.ok) {
      const data = await res.json();
      passwordsList.textContent = JSON.stringify(data, null, 2);
      fetchPasswordsBtn.disabled = false;
      console.log("Connecté en tant qu'utilisateur avec ID: " + data.userId);
    } else {
      passwordsList.textContent = "Tu dois te connecter d'abord";
      window.location.href = "/login.html";
      console.log("Non connecté");
    }
  } catch (err) {
    passwordsList.textContent = "Erreur: " + err.message;
    console.log("Erreur: " + err.message);
    window.location.href = "/login.html";
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
    fetchPasswordsBtn.disabled = false;

    passwordsList.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    passwordsList.textContent = "Erreur: " + err.message;
  }
});

passwordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const service = document.getElementById("service").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/passwords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // pour envoyer le cookie
      body: JSON.stringify({ service, username, password }),
    });

    if (!res.ok) {
      const error = await res.text();
      alert("Erreur : " + error);
      return;
    }

    const data = await res.json();
    alert("Mot de passe ajouté !");
    console.log("Ajouté :", data);

    // reinitialise le form
    passwordForm.reset();

    // refresh la liste direct
    fetchPasswordsBtn.click();
  } catch (err) {
    alert("Erreur : " + err.message);
  }
});
