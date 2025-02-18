let imagemMusica = document.getElementById("imagemMusica");
let by = document.getElementById("by");
let nomeMusica = document.getElementById("nomeMusica");
let nameCreator = document.getElementById("NameCreator");
const NameMusic = document.getElementById("NameMusic");
const NameCreator = document.getElementById("NameCreator");
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
      imagemMusica.style.display = "block";
      imagemMusica.src = URL.createObjectURL(this.files[0]);
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
  
    // formData.append("id", id);
    formData.append("NameMusic", NameMusic.value.trim());
    formData.append("NameCreator", NameCreator.value.trim());
    formData.append("ImgMusic", file);
  
    try {
      const response = await fetch("http://localhost:3001/track/music", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
  
      const data = await response.json();
      
      
      if (!response.ok) {
        console.error(data.error || "Erro no servidor.");
        return;
      }
  
      console.log("realizado com sucesso:", data);
  
      if (data.redirect) {
        
        
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  }
  


const imgHeart = document.getElementById("imgHeart");
const buttonMark = document.getElementById("buttonMark");
const Card = document.getElementById("card");
NameMusic.addEventListener("input", (e) => {
    console.log(e.target.value);
    nomeMusica.innerHTML = e.target.value;
});

NameCreator.addEventListener("input", (e) => {
    console.log(e.target.value);
    by.innerHTML = e.target.value;
});

let inPlaylist = false;
function togglePlaylist(imgHeart) {
    if (inPlaylist == false) {
        imgHeart.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAQdJREFUSEvFldkRgjAURU+sRCsRGnCpQK1EqUSswKUB7UQrIc6bYQ+BBOLIF5M87sm9LyGKHz/qx/r8B3CFSMFOQaThIy5ncFlBKu8P2GewtM3XUzEc3OApH3ZFp+El4z3zqYZkmy8qr62k+sQ9epWs4VTUlw4klhk8PYSspQoORZwl4AZnBfsQAA3pBg6NiO6gQ4iLhvRqA3Eb8AbmgSCfNSwagMARdTqQzh9DOMgg3lZburFNJze6nr9xDq4wz7fq2F6U2RvnoBiYADHEDQcTIJ3iVoBMeDixivcCHCG94oOAAciguBPAAnESdwa0IBS/AZdD6XVlSuPrl0lwgItgu8bLwRjAF1QtSRlA8ncQAAAAAElFTkSuQmCC'
        inPlaylist = true
    } else {
        imgHeart.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAUdJREFUSEvFVIGNwjAMtDeBSYBJeCYBJgEmgU2eTY5eZZc0TdqYF/pKVao6ufOdHat8+dEv48v/EADYisheRLg+TeVNVa/8BvAjIptaPHVlogDA3Q6W3HvYTxKXHiZwVlVPamxRBn7oiAi4svdoqwPX4iQ4+aZBgdnC7J+qus7TA0Aij+9m4tx3cDtTgksHTm9HGUS6DAAzp9KrqlLh2yJ00f5Hpy8Cmu5NXHioaq8yVfBrHq/TIkXIzEbiDDaXLBr8i4Bb+7pFRQUeZIvtoiqS7MnF831Lj/wG4IUOkRg4z/J+DNmXCLwVuTaRZOCTFi/d5GaSJfCJAi9qcqmqSlrAqwTWEVUlreCzBDUSU+kFLY6V2Wm6MGNYeL79GC/NrPx801jIakKMJvBFi7I5w5rQGs6ryTSt3fomBdGREarBX8BDFn1K9ALnPasZKSz6ZAAAAABJRU5ErkJggg=='
        inPlaylist = false
    }
}


Card.addEventListener('mouseover', () => {
    buttonMark.style.opacity = '100%';
    buttonMark.style.transition = '0.7s all ease-out';
});
Card.addEventListener('mouseout', () => {
    buttonMark.style.opacity = '0';
    buttonMark.style.transition = '0.7s all ease-out';
});

buttonMark.addEventListener('click', () => {
    togglePlaylist(imgHeart);
});