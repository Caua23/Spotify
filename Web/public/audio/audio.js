const allowedMimes = [
  "audio/mpeg", // MP3
  "audio/wav", // WAV
  "audio/aac", // AAC
  "audio/ogg", // OGG
  "audio/midi", // MIDI
  "audio/x-midi", // Alternativo para MIDI
  "audio/mp4", // MP4 de áudio
  "audio/webm", // WebM de áudio
  "audio/flac", // FLAC
];

document
  .getElementById("real-file-input")
  .addEventListener("change", function () {
    let isValid = false;
    var fileInput = this;

    for (var i = 0; i < fileInput.files.length; i++) {
      var fileType = fileInput.files[i].type;
      if (allowedMimes.includes(fileType)) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      document.getElementById("error-message").style.display = "block";
      fileInput.value = "";
    } else {
      document.getElementById("error-message").style.display = "none";
      var fileName = this.files[0].name;
      document.getElementById("file-name").textContent = fileName;
    }
  });
  const inputFile = document.getElementById("real-file-input");
async function formulario(event) {
  event.preventDefault();
  const pathSegments = window.location.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];
  if (!id) {
    console.error("ID do usuário não encontrado.");
    return;
  }
  if (inputFile.files.length === 0) {
    console.error("Nenhum arquivo selecionado.");
    return;
  }
  
  const formData = new FormData();
  formData.append("audiofile", inputFile.files[0]);

  const token = getCookie("token");
  const response = await fetch(`http://localhost:3001/track/music/audio/${id}`, {
    method: "POST",
    body: formData,
    headers: {
      
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", 
  })

  const data = await response.json();
  if(!response.ok) {
    return console.error("Erro ao processar a solicitação:", data.error);
  }
  console.log(data);
  
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}