
// sonidos

const click = new Audio('click.mp3')

//Variables globales

let conteo = 1;

//función constructora del objeto metrónomo

class Metronomo {
    constructor (tempo, beat) {
        this.tempo = tempo;
        this.beat = beat;
    }
}

//crear el metronomo

const MetronomoActivo = new Metronomo(140, 4);

// interacción con el html

//BPM

const tempoSlider = document.getElementById("slider");
const incrementarBPM = document.getElementById("botonSumarBPM");
const disminuirBPM = document.getElementById("botonRestarBPM");
const mostrarBPM = document.getElementById("numeroBPM");

incrementarBPM.addEventListener('click', () => {
    if (MetronomoActivo.tempo >= 260) { return };
    MetronomoActivo.tempo ++;
    mostrarBPM.innerHTML = MetronomoActivo.tempo;
    tempoSlider.value = MetronomoActivo.tempo;
})

disminuirBPM.addEventListener('click', () => {
    if (MetronomoActivo.tempo <= 20) { return };
    MetronomoActivo.tempo --;
    mostrarBPM.innerHTML = MetronomoActivo.tempo;
    tempoSlider.value = MetronomoActivo.tempo;
})

tempoSlider.addEventListener('input', () => {
    MetronomoActivo.tempo = tempoSlider.value;
    mostrarBPM.innerHTML = MetronomoActivo.tempo;
})

//BEAT

const incrementarBeat = document.getElementById("botonSumarBeat");
const disminuirBeat = document.getElementById("botonRestarBeat");
const numeroBeat = document.getElementById("numeroBeat");

incrementarBeat.addEventListener('click', () => {
    if (MetronomoActivo.beat >= 12) { return };
    MetronomoActivo.beat ++;
    numeroBeat.innerHTML = MetronomoActivo.beat;
})

disminuirBeat.addEventListener('click', () => {
    if (MetronomoActivo.beat <= 2) { return };
    MetronomoActivo.beat --;
    numeroBeat.innerHTML = MetronomoActivo.beat;
})

const mostrarConteo = (conteo) => {
    let contadorBeat = document.getElementById("contadorBeat");
    contadorBeat.innerHTML = `${conteo}`
}

// funciones de reproducción

const playClick = () => {
    if (conteo < MetronomoActivo.beat) {
        mostrarConteo(conteo);
        click.play();;
        conteo++;
    }
    else {
        mostrarConteo(conteo);
        click.play();;
        conteo = 1;
    }
    }


let intervalo = false;
let play = false;

const playStop = () => {
  if (!play) {
    intervalo = setInterval(playClick, 60000 / MetronomoActivo.tempo);
    play = true;
    botonPlay.innerHTML = '<i class="fas fa-pause"></i>';
  }
  else {
    clearInterval(intervalo);
    play = false;
    botonPlay.innerHTML = '<i class="fas fa-play"></i>';
  }
}

botonPlay.addEventListener("click", playStop);
