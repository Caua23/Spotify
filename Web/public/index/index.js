//----------------------------------------------------------------
const imgAccount = document.getElementById("imgAccount");
//----------------------------------------------------------------
const PlayPause = document.getElementById("PlayPause");
const buttonPlayPause = document.getElementById("PlaySoundB");
const next = document.getElementById("next");
const prev = document.getElementById("previous");
const shuffle = document.getElementById("shuffleI");
const refresh = document.getElementById("refresh");
const account = document.getElementById("account");
const menu = document.getElementById("menu");
const playMain = document.getElementById("playMain");
//----------------------------------------------------------------
let inPlaylist = false;
// let Card, imageContainer, img, ButtonPlay, i, p, p2, divMark, buttonMark, imgHeart, audioElement;

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
    if (!response.ok) {
      window.location.href = "/auth/login";
      
      
      return;
    }
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
async function musicas() {
  fetch(`http://localhost:3001/track/musicas`)
    .then((response) => response.json())
    .then((MusicData) => {
      MusicData.musica.map((musica) => {
        console.table(musica);
        tocador(musica);
      });
    });
}
musicas();
function tocador(musica) {
  const imagem = musica.ImageURL;
  const audioElement = new Audio(musica.MusicURL);
  const itens = creator();
  const Card = itens.Card;
  classes(Card, itens);
  ordenacao(Card, itens, audioElement);
  interacoes(Card, itens, audioElement, musica);
  itens.img.src = imagem;
  itens.p.innerHTML = musica.NameMusic;
  itens.p2.innerHTML = musica.NameCreator;
}
function ordenacao(Card, itens, audioElement) {
  const container = document.getElementById("mainMusic");
  Card.appendChild(audioElement);
  Card.appendChild(itens.imageContainer);
  Card.appendChild(itens.p);
  Card.appendChild(itens.p2);
  Card.appendChild(itens.divMark);
  itens.imageContainer.appendChild(itens.img);
  itens.imageContainer.appendChild(itens.ButtonPlay);
  itens.ButtonPlay.appendChild(itens.i);
  itens.divMark.appendChild(itens.buttonMark);
  itens.buttonMark.appendChild(itens.imgHeart);
  container.appendChild(Card);
}

let elementoSelecionado = null;
function interacoes(Card, itens, audioElement, musica) {
  const volumeInicial = 0.1;
  audioElement.volume = volumeInicial;

  const { ButtonPlay, i, buttonMark, imgHeart } = itens;

  Card.addEventListener("click", () => {
    const estaSelecionado = Card.classList.contains("selected");
    if (estaSelecionado) {
      Card.classList.remove("selected");
    } else {
      const todosOsCards = document.querySelectorAll(".card");
      todosOsCards.forEach((cartao) => {
        cartao.classList.remove("selected");
      });

      Card.classList.add("selected");
    }
  });

  ButtonPlay.addEventListener("click", () => {
    togglePlayback(audioElement, i, PlayPause);
  });

  buttonPlayPause.addEventListener("click", (event) => {
    const cartaoSelecionado = document.querySelector(".card.selected");

    if (cartaoSelecionado) {
      MusicSoundBar(musica);
      const audioSelecionado = cartaoSelecionado.querySelector("audio");
      togglePlayPause(audioElement, i, PlayPause, audioSelecionado);
    }
  });

  const rangeEnd = document.getElementById("rangeEnd");
  const volumeImg = document.getElementById("volume");
  
  rangeEnd.addEventListener("input", () => {
    const volume = rangeEnd.value / 1200;
  
    if (rangeEnd.value >= 75) { 
      volumeImg.src = "Assets/bx-volume-full.png";
    } else if (rangeEnd.value >= 30 && rangeEnd.value < 75) { 
      volumeImg.src = "Assets/bx-volume-low.png";
    } else if (rangeEnd.value >= 1 && rangeEnd.value < 30) { 
      volumeImg.src = "Assets/bx-volume.png";
    } else if (rangeEnd.value == 0) { 
      volumeImg.src = "Assets/bx-volume-mute.png";
    }
  
    audioElement.volume = volume;
  });
  

  buttonMark.addEventListener("click", () => {
    togglePlaylist(imgHeart);
  });
  Card.addEventListener("mouseover", () => {
    buttonMark.style.opacity = "100%";
    buttonMark.style.transition = "0.7s all ease-out";
  });
  Card.addEventListener("mouseout", () => {
    buttonMark.style.opacity = "0";
    buttonMark.style.transition = "0.7s all ease-out";
  });
}

function classes(Card, itens) {
  Card.classList.add("card");
  itens.imageContainer.classList.add("image-container");
  itens.img.classList.add("imgMusic");
  itens.ButtonPlay.classList.add("image-button");
  itens.i.classList.add("bx", "bx-play");
  itens.p.classList.add("resMusic");
  itens.p2.classList.add("by");
  itens.imgHeart.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAUdJREFUSEvFVIGNwjAMtDeBSYBJeCYBJgEmgU2eTY5eZZc0TdqYF/pKVao6ufOdHat8+dEv48v/EADYisheRLg+TeVNVa/8BvAjIptaPHVlogDA3Q6W3HvYTxKXHiZwVlVPamxRBn7oiAi4svdoqwPX4iQ4+aZBgdnC7J+qus7TA0Aij+9m4tx3cDtTgksHTm9HGUS6DAAzp9KrqlLh2yJ00f5Hpy8Cmu5NXHioaq8yVfBrHq/TIkXIzEbiDDaXLBr8i4Bb+7pFRQUeZIvtoiqS7MnF831Lj/wG4IUOkRg4z/J+DNmXCLwVuTaRZOCTFi/d5GaSJfCJAi9qcqmqSlrAqwTWEVUlreCzBDUSU+kFLY6V2Wm6MGNYeL79GC/NrPx801jIakKMJvBFi7I5w5rQGs6ryTSt3fomBdGREarBX8BDFn1K9ALnPasZKSz6ZAAAAABJRU5ErkJggg==";
  itens.buttonMark.classList.add("buttonMark");
  itens.divMark.classList.add("divMark");
}
function creator() {
  let Card = document.createElement("div");
  let imageContainer = document.createElement("div");
  let img = document.createElement("img");
  let ButtonPlay = document.createElement("button");
  let i = document.createElement("i");
  let p = document.createElement("p");
  let p2 = document.createElement("p");
  let divMark = document.createElement("div");
  let buttonMark = document.createElement("button");
  let imgHeart = document.createElement("img");

  return {
    Card,
    imageContainer,
    img,
    ButtonPlay,
    i,
    p,
    p2,
    divMark,
    buttonMark,
    imgHeart,
  };
}
function togglePlaylist(imgHeart) {
  if (inPlaylist == false) {
    imgHeart.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAQdJREFUSEvFldkRgjAURU+sRCsRGnCpQK1EqUSswKUB7UQrIc6bYQ+BBOLIF5M87sm9LyGKHz/qx/r8B3CFSMFOQaThIy5ncFlBKu8P2GewtM3XUzEc3OApH3ZFp+El4z3zqYZkmy8qr62k+sQ9epWs4VTUlw4klhk8PYSspQoORZwl4AZnBfsQAA3pBg6NiO6gQ4iLhvRqA3Eb8AbmgSCfNSwagMARdTqQzh9DOMgg3lZburFNJze6nr9xDq4wz7fq2F6U2RvnoBiYADHEDQcTIJ3iVoBMeDixivcCHCG94oOAAciguBPAAnESdwa0IBS/AZdD6XVlSuPrl0lwgItgu8bLwRjAF1QtSRlA8ncQAAAAAElFTkSuQmCC";
    inPlaylist = true;
  } else {
    imgHeart.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAUdJREFUSEvFVIGNwjAMtDeBSYBJeCYBJgEmgU2eTY5eZZc0TdqYF/pKVao6ufOdHat8+dEv48v/EADYisheRLg+TeVNVa/8BvAjIptaPHVlogDA3Q6W3HvYTxKXHiZwVlVPamxRBn7oiAi4svdoqwPX4iQ4+aZBgdnC7J+qus7TA0Aij+9m4tx3cDtTgksHTm9HGUS6DAAzp9KrqlLh2yJ00f5Hpy8Cmu5NXHioaq8yVfBrHq/TIkXIzEbiDDaXLBr8i4Bb+7pFRQUeZIvtoiqS7MnF831Lj/wG4IUOkRg4z/J+DNmXCLwVuTaRZOCTFi/d5GaSJfCJAi9qcqmqSlrAqwTWEVUlreCzBDUSU+kFLY6V2Wm6MGNYeL79GC/NrPx801jIakKMJvBFi7I5w5rQGs6ryTSt3fomBdGREarBX8BDFn1K9ALnPasZKSz6ZAAAAABJRU5ErkJggg==";
    inPlaylist = false;
  }
}
function togglePlayback(audioElement, i, PlayPause) {
  if (audioElement.paused) {
    audioElement.play();
    PlayPause.classList.remove("bx-play-circle");
    PlayPause.classList.add("bx-pause-circle");
    i.classList.remove("bx-play");
    i.classList.add("bx-pause");
  } else {
    audioElement.pause();
    i.classList.remove("bx-pause");
    i.classList.add("bx-play");
    PlayPause.classList.remove("bx-pause-circle");
    PlayPause.classList.add("bx-play-circle");
  }
}
function togglePlayPause(audioElement, i, PlayPause, audioSelecionado) {
  // Pausa todos os áudios, exceto o áudio selecionado
  const todosOsAudios = document.querySelectorAll("audio");
  todosOsAudios.forEach((audio) => {
    if (audio !== audioSelecionado) {
      audio.pause();
    }
  });

  // Verifica se o áudio selecionado é o mesmo que está sendo reproduzido
  const mesmoAudio = audioElement === audioSelecionado;
  const todosOsBotoes = document.querySelectorAll(".image-button i");
  todosOsBotoes.forEach((botao) => {
    botao.classList.remove("bx-pause");
    botao.classList.add("bx-play");
  });

  // Atualiza o botão de reprodução global conforme o estado do áudio selecionado
  if (mesmoAudio && audioElement.paused) {
    audioElement.play();
    PlayPause.classList.remove("bx-play-circle");
    PlayPause.classList.add("bx-pause-circle");
    i.classList.remove("bx-play");
    i.classList.add("bx-pause");
    console.log("esta on");
    return;
  } else {
    // Se o mesmo áudio estiver reproduzindo ou se outro áudio foi selecionado, pausa
    audioElement.pause();
    i.classList.remove("bx-pause");
    i.classList.add("bx-play");
    PlayPause.classList.remove("bx-pause-circle");
    PlayPause.classList.add("bx-play-circle");
    console.log("esta pausado");
  }
}

function MusicSoundBar(musica) {}

async function dataUser() {
  const idUsuario = await token();
  const response = await fetch(`http://localhost:3001/user/data/${idUsuario}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.error("Erro na solicitação:", response.text);
     window.location.href = "/auth/login";
    return;
  }
  const data = await response.json();
  if (response.ok) {
    const Picture = data.ImgProfile;
    if (Picture && Picture.length > 0) {
      const Url = Picture[0].url;
      imgAccount.src = Url;
    }
    return;
  }
}
dataUser();

refresh.addEventListener("click", () => {
  const currentColor = refresh.style.color;
  if (currentColor === "rgb(177, 0, 0)" || currentColor === "#b10000") {
    // Verifica se a cor atual é vermelha
    refresh.style.color = "#ffffff";
  } else {
    refresh.style.color = "#b10000"; // Define a cor para vermelho
  }
});

shuffle.addEventListener("click", () => {
  const currentColor = shuffle.style.color;
  if (currentColor === "rgb(177, 0, 0)" || currentColor === "#b10000") {
    // Verifica se a cor atual é vermelha
    shuffle.style.color = "#ffffff";
  } else {
    shuffle.style.color = "#b10000"; // Define a cor para vermelho
  }
});

function carregar() {
  var salutation = document.getElementById("salutation");
  var dataAtual = new Date();
  var hora = dataAtual.getHours();

  if (hora >= 6 && hora < 12) {
    salutation.innerHTML = `Bom dia`;
  } else if (hora >= 12 && hora < 18) {
    salutation.innerHTML = `Boa tarde`;
  } else {
    salutation.innerHTML = `Boa noite`;
  }
}

account.addEventListener("click", () => {
  menu.classList.toggle("sumir");
});

//Scroll do select
document.addEventListener("DOMContentLoaded", () => {
  var select = document.getElementById("playlist");
  addEventListener("scroll", () => {
    var scrollPosition = window.scrollY || window.pageYOffset;
    if (scrollPosition > 30) {
      select.classList.toggle("shadowScroll");
    }
  });
});

//Range
const init = document.getElementById("init");
const end = document.getElementById("end");
const rangeSound = document.getElementById("rangeSoud");

function valueProgress(value) {
  init.innerHTML = rangeSound.value;
}

const pesquisar = document.getElementById("pesquisar");
function toggleSearch() {
  var img = document.getElementById("imgPesquisa");
  var searchContainer = document.getElementById("divPesquisar");
  img.classList.toggle("on");
  searchContainer.classList.toggle("On2");
  pesquisar.classList.toggle("sumir");
}

function search() {
  var searchTerm = document.getElementById("pesquisar").value;
  alert("Pesquisando por: " + searchTerm);
}

pesquisar.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    search();
  }
});
