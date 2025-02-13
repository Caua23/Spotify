async function formulario(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const res = document.getElementById("res");
  const pass = document.getElementById("password1").value;
  const passConfirm = document.getElementById("password2").value;
  const res2 = document.getElementById("res2");

  res.innerHTML = "";
  res2.innerHTML = "";

  if (!email) {
    res.innerHTML = "Por favor, insira seu endereço de e-mail para prosseguir.";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.innerHTML = "Por favor, insira um endereço de e-mail válido.";
    return;
  }

  if (!pass || pass.length < 6) {
    res2.innerHTML =
      "A senha deve ter pelo menos 6 caracteres. Escolha uma senha mais robusta.";
    return;
  }

  if (pass !== passConfirm) {
    res2.innerHTML = "As senhas não correspondem. Por favor, tente novamente.";
    return;
  }

  async function singUp(email, senha) {
    try {
      const response = await fetch("http://localhost:3001/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      if (data.redirect) {
        window.location.href = data.redirect;
      }

      if (!response.ok) {
        const data = await response.json();
        if (data.error) {
          res.innerHTML = data.error;
          throw new Error(data.error);
        }
        throw new Error("Erro desconhecido no servidor.");
      }

      console.log("Sucesso:", data);
    } catch (error) {
      console.error("Erro na solicitação:", error.message);
      throw error;
    }
  }

  await singUp(email, pass);
}
