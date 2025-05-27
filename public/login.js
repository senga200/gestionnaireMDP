let token = null;

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

//display none sur message
message.style.display = "none";

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
    window.location.href = "/dashboard.html";
  } catch (err) {
    message.style.display = "block";
    message.textContent = "Erreur: " + err.message;
  }
});
