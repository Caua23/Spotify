const dropMenu = document.getElementById('dropMenu');
const Menu = document.getElementById('Menu');
const resName = document.getElementById('resName');
const imgDropMenu = document.getElementById('ImgMenu');
const ImgProfile = document.getElementById('ImgProfile');
dropMenu.addEventListener('click', (e) => {
    Menu.classList.toggle('sumir')
})


document.getElementById('real-file-input').addEventListener('change', function () {
    let isValid = false;
    var fileInput = this;
    var validExtensions = ['jpeg','jpg', 'gif', 'pjpeg', 'png'];
    for (var i = 0; i < fileInput.files.length; i++) {
        var extension = fileInput.files[i].name.split('.').pop().toLowerCase();
        if (validExtensions.indexOf(extension) !== -1) {
            isValid = true;
            break;
        }
    }
    if (!isValid) {
        document.getElementById('error-message').style.display = 'block';
        // Limpar o campo de entrada de arquivo
        fileInput.value = '';
    } else {
        document.getElementById('error-message').style.display = 'none';
        var fileName = this.value.split('\\').pop();
        document.getElementById('file-name').textContent = fileName;
    }
});
const idUsuario = 1
const fileName = document.getElementById('file-name')
const inputEmail = document.getElementById('inputEmail')
const inputPassword = document.getElementById('inputPassword')
const inputFile = document.getElementById('real-file-input')
async function dataUser() {
    fetch(`http://localhost:3001/data/${idUsuario}`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data);
            const User = data.dataEmail;
            const Picture = data.ImgProfile;
            const Url = Picture[0].Url;
            imgDropMenu.src = Url;
            ImgProfile.src = Url;
            resName.innerHTML = User[0].nome;
            inputEmail.value = User[0].emails;
            inputPassword.value = User[0].Password;

        })
        .catch((erro) => {
            console.log(erro);
        })

}
dataUser()


function valueStart(){
    dataUser()
    fileName.innerHTML = '';
    inputFile.value = '';
}


var pais = document.getElementById('pais')
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`)
            .then(response => response.json())
            .then(data => {
                const country = data.countryName;
                pais.innerText = country
                console.log("País:", country);
            })
            .catch(error => {
                console.error("Erro ao obter país:", error);
            });
    }, (error) => {
        console.error("Erro ao obter localização:", error);
    });
} else {
    console.error("Geolocalização não suportada pelo navegador.");
}



