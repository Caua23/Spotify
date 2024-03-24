

var playlist = []
//----------------------------------------------------------------
const imgAccount = document.getElementById('imgAccount')
//----------------------------------------------------------------
const PlayPause = document.getElementById('PlayPause')
const buttonPlayPause = document.getElementById('play')
const next = document.getElementById('next')
const prev = document.getElementById('previous')
const shuffle = document.getElementById('shuffleI')
const refresh = document.getElementById('refresh')
const account = document.getElementById('account')
const menu = document.getElementById('menu')
//----------------------------------------------------------------
async function getImg() {
    const idimg = 1
    const img = await fetch(`http://localhost:3001/conta/${idimg}/imagem`)
        .then(response => {
            if (!response.ok) {
                console.log('Erro ao recuperar a imagem do usuário');
            }
            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            console.log(imageUrl);
            imgAccount.src = imageUrl
        })
    console.log(imgAccount.src)
    console.log(imageUrl)
}

imgAccount.src = ''
refresh.addEventListener("click", () => {
    const currentColor = refresh.style.color;
    if (currentColor === 'rgb(177, 0, 0)' || currentColor === '#b10000') { // Verifica se a cor atual é vermelha
        refresh.style.color = '#ffffff'; 
    } else {
        refresh.style.color = '#b10000'; // Define a cor para vermelho
    }
})

shuffle.addEventListener("click", () => {
    const currentColor = shuffle.style.color;
    if (currentColor === 'rgb(177, 0, 0)' || currentColor === '#b10000') { // Verifica se a cor atual é vermelha
        shuffle.style.color = '#ffffff'; 
    } else {
        shuffle.style.color = '#b10000'; // Define a cor para vermelho
    }
})

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
    getImg()
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


}

account.addEventListener('click', () => {
    menu.classList.toggle('sumir')
    
})

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
const init = document.getElementById('init')
const end = document.getElementById('end')
const rangeSound = document.getElementById('rangeSoud');
const rangeEnd = document.getElementById('rangeEnd');
/*
const formatZero = (n) => (n < 10 ?  '0' + n : n);
const updateTime = () => {
    const currentMinutes = Math.floor(rangeSound.init / 60)
    const currentSeconds = Math.floor(rangeSound.init % 60)
    init.textContent = currentMinutes + ':' + formatZero(currentSeconds)
    const durationFormatted = isNaN(rangeSound.end) ? 0 : rangeSound.end
    const durationMinutes = Math.floor(durationFormatted / 60)
    const durationSeconds = Math.floor(durationFormatted % 60)
    duration.textContent = durationMinutes + ':' + formatZero(durationSeconds)
    
    const progressWidth = durationFormatted
        ? (rangeSound.init / durationFormatted) * 100
        : 0;
    rangeSound.style.backgroundColor = progressWidth + '%'
    
    var y = rangeSound.value;
    var color2 = 'linear-gradient(90deg, #FFFFFF ' + y + '%, #4D4D4D ' + y + '%);';
    rangeSound.style.background = color2;
    
}

*/



function valueProgress(value) {
    init.innerHTML = rangeSound.value

}

// rangeSound.addEventListener('input', () => {
//     var y = rangeSound.value;
//     var color2 = 'linear-gradient(90deg, #FFFFFF ' + y + '%, #4D4D4D ' + y + '%);';
//     rangeSound.style.background = color2;
// })


const pesquisar = document.getElementById('pesquisar')
function toggleSearch() {
    var img = document.getElementById('imgPesquisa');
    var searchContainer = document.getElementById("divPesquisar");
    img.classList.toggle('on')
    searchContainer.classList.toggle('On2')
    pesquisar.classList.toggle('sumir')
}

function search() {
    var searchTerm = document.getElementById('pesquisar').value;
    alert('Pesquisando por: ' + searchTerm);
}

pesquisar.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        search();
    }

});


