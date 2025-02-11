async function formulario(event) {
  event.preventDefault();
  let email = document.getElementById("inputText").value.trim();
  let pass = document.getElementById("inputPass").value.trim();
  let res = document.getElementById("res");
  res.innerHTML = "";
  if (!email || !pass) {
    res.innerHTML = "Coloque Suas informações abaixo ";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.innerHTML = "Por favor, insira um endereço de e-mail válido.";
    return;
  }
  async function login(email, pass) {
    try {
      const response = await fetch("http://localhost:3001/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: pass }),
      });

      const data = await response.json(); 

      if (!response.ok) { 
        res.innerHTML = data.error || "Erro desconhecido no servidor.";
        return;
      }
  
      if (data.redirect) { 
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.log(error);
    }
  }
  await login(email, pass);
}
