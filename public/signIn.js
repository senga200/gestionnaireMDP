const registerForm = document.querySelector("#registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#registerEmail").value;
  const password = document.querySelector("#registerPassword").value;

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert("Erreur lors de l'enregistrement : " + data.message);
      return;
    }
    alert(
      "Inscription réussie ! Vous allez être redirigé vers votre dashboard."
    );
    window.location.href = "/dashboard.html";
  } catch (err) {
    alert("Erreur : " + err.message);
  }
  registerForm.reset();
  // Redirige vers la paGE DASHBOARD
});
const loginForm = document.querySelector("#loginForm");
