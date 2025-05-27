const fetchPasswordsBtn = document.getElementById("fetchPasswordsBtn");
const passwordsList = document.getElementById("passwordsList");
const passwordForm = document.getElementById("passwordForm");
const searchService = document.getElementById("searchService");
const searchResults = document.getElementById("searchResults");
const deletePasswordForm = document.getElementById("deletePasswordForm");

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
//rechercher un mot de passe
searchService.addEventListener("input", async (e) => {
  e.preventDefault();
  const input = searchService.value.toLowerCase();
  let results = [];

  if (input.length > 2) {
    try {
      const res = await fetch("/api/passwords", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // pour envoyer le cookie
      });

      if (!res.ok) {
        passwordsList.textContent =
          "Erreur lors de la récupération du mot de passe";
        return;
      }

      const data = await res.json();
      results = data.filter((password) =>
        password.service.toLowerCase().includes(input)
      );
      console.log("Résultats du get passwords :", results);
      searchResults.textContent = JSON.stringify(results, null, 2);
    } catch (err) {
      passwordsList.textContent = "Erreur: " + err.message;
    }
  }
});

//afficher les mots de passe
fetchPasswordsBtn.addEventListener("click", async (e) => {
  e.preventDefault();
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
    console.log("Mots de passe récupérés :", data);
  } catch (err) {
    passwordsList.textContent = "Erreur: " + err.message;
  }
});
//ajouter un mot de passe
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

// Modifier un mot de passe
const updatePasswordForm = document.getElementById("updatePasswordForm");
updatePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const serviceToUpdate = document
    .getElementById("updateService")
    .value.toLowerCase();
  const newUsername = document.getElementById("updateUsername").value;
  const newPassword = document.getElementById("updatePassword").value;

  try {
    // 1. Récupère tous les mots de passe de l'utilisateur parce qu'il faut l'id pour mettre à jour
    const res = await fetch("/api/passwords", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      alert("Erreur lors de la récupération des mots de passe");
      return;
    }

    const passwords = await res.json();

    // 2. quel mot de passe correspond au service ?
    const passwordEntry = passwords.find(
      (p) => p.service.toLowerCase() === serviceToUpdate
    );

    if (!passwordEntry) {
      alert("Service non trouvé.");
      return;
    }

    // 3. go mettre à jour
    const updateRes = await fetch(`/api/passwords/${passwordEntry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        service: serviceToUpdate,
        username: newUsername,
        password: newPassword,
      }),
    });

    if (updateRes.ok) {
      alert("Mot de passe mis à jour avec succès.");
      updatePasswordForm.reset();
      fetchPasswordsBtn.click(); // refresh la liste
    } else {
      alert("Erreur lors de la mise à jour du mot de passe.");
    }
  } catch (err) {
    alert("Erreur: " + err.message);
  }
});

//supprimer un mot de passe
deletePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const serviceToDelete = deleteService.value.toLowerCase();

  try {
    // 1. Récupère tous les mots de passe de l'utilisateur parce qu'il faut l'id pour supprimer
    const res = await fetch("/api/passwords", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      alert("Erreur lors de la récupération des mots de passe");
      return;
    }

    const passwords = await res.json();

    // 2. quel est le mot de passe qui correspond au service
    const passwordEntry = passwords.find(
      (p) => p.service.toLowerCase() === serviceToDelete
    );

    if (!passwordEntry) {
      alert("Service non trouvé.");
      return;
    }

    // 3. go supprimer
    const deleteRes = await fetch(`/api/passwords/${passwordEntry.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (deleteRes.status === 204) {
      alert("Mot de passe supprimé avec succès.");
      deleteService.value = "";
    } else {
      alert("Erreur lors de la suppression.");
    }
  } catch (err) {
    alert("Erreur: " + err.message);
  }
});

// change le mot de passe de l'utilisateur
const changePasswordForm = document.getElementById("changeMasterForm");

changePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(" future feature");
});

//deconnexion
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // pour envoyer le cookie
    });

    if (res.ok) {
      alert("Déconnexion réussie.");
      window.location.href = "/index.html"; // redirige vers la page de connexion
    } else {
      alert("Erreur lors de la déconnexion.");
    }
  } catch (err) {
    alert("Erreur: " + err.message);
  }
});
