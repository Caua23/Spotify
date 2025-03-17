const dropMenu = document.getElementById("dropMenu");
const Menu = document.getElementById("Menu");
const resName = document.getElementById("resName");
const imgDropMenu = document.getElementById("ImgMenu");
const ImgProfile = document.getElementById("ImgProfile");
dropMenu.addEventListener("click", (e) => {
  Menu.classList.toggle("sumir");
});

document
  .getElementById("real-file-input")
  .addEventListener("change", function () {
    let isValid = false;
    var fileInput = this;
    var validExtensions = ["jpeg", "jpg", "gif", "pjpeg", "png"];
    for (var i = 0; i < fileInput.files.length; i++) {
      var extension = fileInput.files[i].name.split(".").pop().toLowerCase();
      if (validExtensions.indexOf(extension) !== -1) {
        isValid = true;
        break;
      }
    }
    if (!isValid) {
       document.getElementById("error-message").style.display = "block";
       // Limpar o campo de entrada de arquivo
       fileInput.value = "";
      } else {

      document.getElementById("error-message").style.display = "none";
      var fileName = this.value.split("\\").pop();
      document.getElementById("file-name").textContent = fileName;
    }
  });
async function token() {
  try {
    const token = getCookie("token");

    if (!token) {
      console.error("Token não encontrado.");
      return (window.location.href = "/auth/login");
    }

    const response = await fetch("http://localhost:3001/auth/jwtAuthenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      return data.dados.id;
    }
    if (!response.ok) return (window.location.href = "/auth/login");
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
  }
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
const fileName = document.getElementById("file-name");
const inputEmail = document.getElementById("inputEmail")
const inputPassword = document.getElementById("inputPassword")
const inputFile = document.getElementById("real-file-input");

async function formulario(event) {
  event.preventDefault();

  const id = await token(); 

  if (!id) {
    console.error("ID do usuário não encontrado.");
    return;
  }

  if (inputFile.files.length === 0) {
    console.error("Nenhum arquivo selecionado.");
    return;
  }

  const file = inputFile.files[0];
  const formData = new FormData();

  formData.append("id", id);
  formData.append("email", inputEmail.value.trim());
  formData.append("password", inputPassword.value.trim());
  formData.append("file", file);
  
  

  try {
    
    const response = await fetch("http://localhost:3001/user/account/overview", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();
    
    
    if (!response.ok) {
      console.error(data.error || "Erro no servidor.");
      return;
    }
    if (response.ok) {
      window.location.reload;
    }
  } catch (error) {
    console.error("Erro ao enviar o formulário:", error);
  }
}



async function dataUser() {
  const idUsuario = await token();
  fetch(`http://localhost:3001/user/data/${idUsuario}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      
      const User = data.UserData;
      const Picture = data.ImgProfile;
      const Url = Picture[0].url;
      imgDropMenu.src = Url;
      ImgProfile.src = Url;
      resName.innerHTML = User[0].nome;
      inputEmail.value = User[0].email;
      
    })
    .catch((erro) => {
      console.log(erro);
    });
}
dataUser();

function valueStart() {
  dataUser();
  fileName.innerHTML = "";
  inputFile.value = "";
}

var pais = document.getElementById("pais");
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
      )
        .then((response) => response.json())
        .then((data) => {
          const country = data.countryName;
          pais.innerText = country;
          console.log("País:", country);
        })
        .catch((error) => {
          console.error("Erro ao obter país:", error);
        });
    },
    (error) => {
      console.error("Erro ao obter localização:", error);
    }
  );
} else {
  console.error("Geolocalização não suportada pelo navegador.");
}
