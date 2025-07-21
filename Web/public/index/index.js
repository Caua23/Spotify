// ------------------------------
// Element references
const imgAccount      = document.getElementById("imgAccount");
const PlayPause       = document.getElementById("PlayPause");
const buttonPlayPause = document.getElementById("PlaySoundB");
const next            = document.getElementById("next");
const prev            = document.getElementById("previous");
const shuffle         = document.getElementById("shuffleI");
const refresh         = document.getElementById("refresh");
const account         = document.getElementById("account");
const menu            = document.getElementById("menu");

let inPlaylist = false;
let currentAudio = null;

// ------------------------------
// Utility: format seconds as MM:SS
function formatTime(seconds = 0) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ------------------------------
// Pause all audios and reset play buttons
function pauseAllAudios() {
  document.querySelectorAll("audio").forEach(a => a.pause());
  document.querySelectorAll(".image-button i").forEach(btn => {
    btn.classList.remove("bx-pause");
    btn.classList.add("bx-play");
  });
  if (PlayPause) {
    PlayPause.classList.remove("bx-pause-circle");
    PlayPause.classList.add("bx-play-circle");
  }
  currentAudio = null;
}

// ------------------------------
// Toggle playback for a specific audio
function togglePlayPause(audioElement, btnIcon) {
  const isPaused = audioElement.paused;
  pauseAllAudios();

  if (isPaused) {
    audioElement.play();
    btnIcon.classList.replace("bx-play", "bx-pause");
    PlayPause.classList.replace("bx-play-circle", "bx-pause-circle");
    currentAudio = audioElement;
  } else {
    audioElement.pause();
    btnIcon.classList.replace("bx-pause", "bx-play");
    PlayPause.classList.replace("bx-pause-circle", "bx-play-circle");
    currentAudio = null;
  }
}

// ------------------------------
// Create card elements structure
function creator() {
  const Card          = document.createElement("div");
  const imageContainer= document.createElement("div");
  const img           = document.createElement("img");
  const ButtonPlay    = document.createElement("button");
  const i             = document.createElement("i");
  const p             = document.createElement("p");
  const p2            = document.createElement("p");
  const divMark       = document.createElement("div");
  const buttonMark    = document.createElement("button");
  const imgHeart      = document.createElement("img");

  // data attributes for toggle
  imgHeart.dataset.unmarked = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAUdJREFUSEvFVIGNwjAMtDeBSYBJeCYBJgEmgU2eTY5eZZc0TdqYF/pKVao6ufOdHat8+dEv48v/EADYisheRLg+TeVNVa/8BvAjIptaPHVlogDA3Q6W3HvYTxKXHiZwVlVPamxRBn7oiAi4svdoqwPX4iQ4+aZBgdnC7J+qus7TA0Aij+9m4tx3cDtTgksHTm9HGUS6DAAzp9KrqlLh2yJ00f5Hpy8Cmu5NXHioaq8yVfBrHq/TIkXIzEbiDDaXLBr8i4Bb+7pFRQUeZIvtoiqS7MnF831Lj/wG4IUOkRg4z/J+DNmXCLwVuTaRZOCTFi/d5GaSJfCJAi9qcqmqSlrAqwTWEVUlreCzBDUSU+kFLY6V2Wm6MGNYeL79GC/NrPx801jIakKMJvBFi7I5w5rQGs6ryTSt3fomBdGREarBX8BDFn1K9ALnPasZKSz6ZAAAAABJRU5ErkJggg==";
  imgHeart.dataset.marked   = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAQdJREFUSEvFldkRgjAURU+sRCsRGnCpQK1EqUSswKUB7UQrIc6bYQ+BBOLIF5M87sm9LyGKHz/qx/r8B3CFSMFOQaThIy5ncFlBKu8P2GewtM3XUzEc3OApH3ZFp+El4z3zqYZkmy8qr62k+sQ9epWs4VTUlw4klhk8PYSspQoORZwl4AZnBfsQAA3pBg6NiO6gQ4iLhvRqA3Eb8AbmgSCfNSwagMARdTqQzh9DOMgg3lZburFNJze6nr9xDq4wz7fq2F6U2RvnoBiYADHEDQcTIJ3iVoBMeDixivcCHCG94oOAAciguBPAAnESdwa0IBS/AZdD6XVlSuPrl0lwgItgu8bLwRjAF1QtSRlA8ncQAAAAAElFTkSuQmCC";

  return { Card, imageContainer, img, ButtonPlay, i, p, p2, divMark, buttonMark, imgHeart };
}

// Apply classes to created elements
function classes(elements) {
  const { Card, imageContainer, img, ButtonPlay, i, p, p2, divMark, buttonMark } = elements;
  Card.classList.add("card");
  imageContainer.classList.add("image-container");
  img.classList.add("imgMusic");
  ButtonPlay.classList.add("image-button");
  i.classList.add("bx","bx-play");
  p.classList.add("resMusic");
  p2.classList.add("by");
  divMark.classList.add("divMark");
  buttonMark.classList.add("buttonMark");
}

// ------------------------------
// Fetch and render music list
async function musicas() {
  const resp = await fetch("http://localhost:3001/track/musicas");
  const data = await resp.json();
  data.musica.forEach(m => tocador(m));
}

function tocador(musica) {
  const audioElement   = new Audio(musica.MusicURL);
  audioElement.volume  = 0.1;
  const itens          = creator();
  classes(itens);
  itens.img.src        = musica.ImageURL;
  itens.p.textContent  = musica.NameMusic;
  itens.p2.textContent = musica.NameCreator;

  // build card
  const card = itens.Card;
  card.append(audioElement, itens.imageContainer, itens.p, itens.p2, itens.divMark);
  itens.imageContainer.append(itens.img, itens.ButtonPlay);
  itens.ButtonPlay.append(itens.i);
  itens.divMark.append(itens.buttonMark);
  itens.buttonMark.append(itens.imgHeart);
  document.getElementById("mainMusic").appendChild(card);

  // per-item play/pause
  itens.ButtonPlay.addEventListener("click", e => {
    e.stopPropagation();
    togglePlayPause(audioElement, itens.i); 
  });

  // select card
  card.addEventListener("click", () => {
    document.querySelectorAll(".card").forEach(c => c.classList.remove("selected"));
    card.classList.toggle("selected");

    /*
    <img id="footerImgMusic" src="" alt="">
            <div>
                <p id="footerMusicName"></p>
                <p id="footerMusicAuthor"></p>
            </div>
    */  
   const footerMusic = document.getElementById("music").style.opacity = "1";  

   const footerImgMusic = document.getElementById("footerImgMusic");
   const footerMusicName = document.getElementById("footerMusicName");  
   const footerMusicAuthor = document.getElementById("footerMusicAuthor");

   footerImgMusic.src = card.querySelector(".imgMusic").src;
   footerMusicName.textContent = card.querySelector(".resMusic").textContent;
   footerMusicAuthor.textContent = card.querySelector(".by").textContent;
    const name = card.querySelector(".resMusic").textContent;
    const author = card.querySelector(".by").textContent;
    const imgUrl = card.querySelector(".imgMusic").src;

    console.log("Selected card info:", { name, author, imgUrl });
    
  });

  itens.buttonMark.addEventListener("click", e => {
    e.stopPropagation();
    inPlaylist = !inPlaylist;
    itens.imgHeart.src = inPlaylist ? itens.imgHeart.dataset.marked : itens.imgHeart.dataset.unmarked;
  });
}

// ------------------------------
// Global play/pause button
buttonPlayPause.addEventListener("click", () => {
  if (currentAudio) {
    pauseAllAudios();
  } else {
    const selectedAudio = document.querySelector(".card.selected audio");
    if (selectedAudio) {
      const icon = document.querySelector(".card.selected i");
      togglePlayPause(selectedAudio, icon);
    }
  }
});

// ------------------------------
// Volume control
const rangeEnd = document.getElementById("rangeEnd");
const volumeImg = document.getElementById("volume");
rangeEnd.addEventListener("input", () => {
  if (currentAudio) currentAudio.volume = rangeEnd.value / 1200;
  
});

// ------------------------------

shuffle.addEventListener("click", () => shuffle.classList.toggle("active"));
refresh.addEventListener("click", () => refresh.classList.toggle("active"));
account.addEventListener("click", () => menu.classList.toggle("sumir"));


window.addEventListener("load", () => {
  const salutation = document.getElementById("salutation");
  const h = new Date().getHours();
  salutation.textContent = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
});


const pesquisar = document.getElementById("pesquisar");
function toggleSearch() {
  document.getElementById("imgPesquisa").classList.toggle("on");
  document.getElementById("divPesquisar").classList.toggle("On2");
  pesquisar.classList.toggle("sumir");
}
pesquisar.addEventListener("keyup", e => {
  if (e.key === "Enter") alert("Pesquisando por: " + pesquisar.value);
});


musicas();
