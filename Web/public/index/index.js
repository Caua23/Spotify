var playlist = []
//----------------------------------------------------------------
const imgAccount = document.getElementById('imgAccount')
//----------------------------------------------------------------
const PlayPause = document.getElementById('PlayPause')
const buttonPlayPause = document.getElementById('play')
const next = document.getElementById('next')
const prev = document.getElementById('previous')
//----------------------------------------------------------------
imgAccount.src = ''



let OnOff = 0;
let currentIndex = 0;

const audioElement = document.createElement('audio');
buttonPlayPause.addEventListener('click', () => {
    if (OnOff == 0) {
        PlayPause.classList.remove('bx-play-circle')
        PlayPause.classList.add('bx-pause-circle')
        audioElement.play()
        OnOff = 1
    } else {
        PlayPause.classList.remove('bx-pause-circle')
        PlayPause.classList.add('bx-play-circle')
        audioElement.pause()
        OnOff = 0
    }
})


function carregar() {
    var salutation = document.getElementById('salutation')
    var dataAtual = new Date()
    var hora = dataAtual.getHours();

    if (hora >= 6 && hora < 12) {
        salutation.innerHTML = `Bom dia`
    } else if (hora >= 12 && hora < 18) {
        salutation.innerHTML = `Boa tarde`
    } else {
        salutation.innerHTML = `Boa noite`
    }

    const idimg = 1
fetch(`http://localhost:3001/conta/${idimg}/imagem`)
    .then(response =>{
        if(!response.ok){
            console.log('Erro ao recuperar a imagem do usuário');
        }
        return response.blob();
    })
    .then(blob=>{
        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(blob); 
        document.body.appendChild(imgElement); 
        /*
        const imageUrl = URL.createObjectURL(blob);
        imgAccount.src = imageUrl
        */
    })

}

//Scroll do select
document.addEventListener('DOMContentLoaded', () => {
    var select = document.getElementById('playlist')
    addEventListener('scroll', () => {
        var scrollPosition = window.scrollY || window.pageYOffset
        if (scrollPosition > 30) {
            select.classList.toggle('shadowScroll')
        }
    })
})


//Range
const rangeEnd = document.getElementById('rangeEnd');
const rangeSound = document.getElementById('rangeSoud');

// Verificar se os elementos foram encontrados antes de adicionar os ouvintes de eventos
if (rangeEnd) {
    rangeEnd.addEventListener('input', () => {
        var x = rangeEnd.value;
        var color1 = 'linear-gradient(90deg, #FFFFFF ' + x + '%, #4D4D4D ' + x + '%);';
        rangeEnd.style.background = color1;
    });
}

if (rangeSound) {
    rangeSound.addEventListener('input', () => {
        var y = rangeSound.value;
        var color2 = 'linear-gradient(90deg, #FFFFFF ' + y + '%, #4D4D4D ' + y + '%);';
        rangeSound.style.background = color2;
    });
}



function toggleSearch() {
    var img = document.getElementById('imgPesquisa');
    var searchContainer = document.getElementById("divPesquisar");
    img.classList.toggle('on')
    searchContainer.classList.toggle('On2')
}

function search() {
    var searchTerm = document.getElementById('pesquisar').value;
    alert('Pesquisando por: ' + searchTerm);
}

document.getElementById('pesquisar').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        search();
    }
});
