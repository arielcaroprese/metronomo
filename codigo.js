
// sonidos

const click = new Audio('click.mp3')

//Variables globales

let conteo = 1;

//GET ELEMENTS

// BPM
// const tempoSlider = document.getElementById("slider");
// const incrementarBPM = document.getElementById("botonSumarBPM");
// const disminuirBPM = document.getElementById("botonRestarBPM");
// const mostrarBPM = document.getElementById("numeroBPM");
// BEAT
// const incrementarBeat = document.getElementById("botonSumarBeat");
// const disminuirBeat = document.getElementById("botonRestarBeat");
// const numeroBeat = document.getElementById("numeroBeat");

//FUNCIONES GLOBALES

// const actualizarBPM = () => {
//     mostrarBPM.innerHTML = MetronomoActivo.tempo;
//     tempoSlider.value = MetronomoActivo.tempo;
// }

// const actualizarBeat = () => {
//     numeroBeat.innerHTML = MetronomoActivo.beat;
// }

//actualizar bpm con jQuery

const actualizarBPM = () => {
    $("#numeroBPM").html(MetronomoActivo.tempo);
    $("#tempoSlider").val = MetronomoActivo.tempo;
}

const actualizarBeat = () => {
    $("#numeroBeat").html(MetronomoActivo.beat);
}

//función constructora del objeto metrónomo

class Metronomo {
    constructor (tempo, beat) {
        this.tempo = tempo;
        this.beat = beat;
    }
}

//crear el metronomo - si está guardado se carga el guardado, sino crea uno genérico

const metronomoGuardado = JSON.parse(localStorage.getItem("metronomoGuardado"));
let MetronomoActivo = new Metronomo(140, 4);
actualizarBPM();
actualizarBeat();

if (metronomoGuardado != null) {
    MetronomoActivo = new Metronomo(metronomoGuardado.tempo, metronomoGuardado.beat);
    actualizarBPM();
    actualizarBeat();
}

// EVENTOS DE BOTONES

// incrementarBPM.addEventListener('click', () => {
//     if (MetronomoActivo.tempo >= 260) { return };
//     MetronomoActivo.tempo ++;
//     actualizarBPM();
// })


// disminuirBPM.addEventListener('click', () => {
//     if (MetronomoActivo.tempo <= 20) { return };
//     MetronomoActivo.tempo --;
//     actualizarBPM();
// })

// tempoSlider.addEventListener('input', () => {
//     MetronomoActivo.tempo = tempoSlider.value;
//     mostrarBPM.innerHTML = MetronomoActivo.tempo;
// })

// EVENTOS DE BOTONES CON JQUERY

$("#botonSumarBPM").click(() => { 
    if (MetronomoActivo.tempo >= 260) { return };
    MetronomoActivo.tempo ++;
    actualizarBPM(); 
});

$("#botonRestarBPM").click(() => { 
    if (MetronomoActivo.tempo >= 260) { return };
    MetronomoActivo.tempo --;
    actualizarBPM(); 
});

$("#slider").change(() => { 
    MetronomoActivo.tempo = $("#slider").val();
    $("#numeroBPM").html(MetronomoActivo.tempo);
});

//BEAT

// función constructora de beats

beatArray = [];

class Beat {
    constructor (beat) {
        this.numero = beat;
        this.acento = false;
    }
}

//generar beat iniciales

for (let i = 1; i <= MetronomoActivo.beat; i++) {
    generarDots = beatArray.push(new Beat(i))
  }

contenedorBeat = document.getElementById("contenedorBeat");

// función para actualizar los beats del contador en el html

const mostrarPuntosBeat = () => {
    contenedorBeat.innerHTML = ``;   
    for (let beat of beatArray) {
        let punto = document.createElement("div");
        punto.setAttribute("id", `beat${beat.numero}`)
        punto.setAttribute("class", "puntoInactivo")
        contenedorBeat.appendChild(punto);    
    }
}

mostrarPuntosBeat();

//ejecutar la función para mostrar los puntos de los beats

$("#botonSumarBeat").click(() => { 
    if (MetronomoActivo.beat >= 12) { return };
    MetronomoActivo.beat ++;
    actualizarBeat();
    generarDots = beatArray.push(new Beat(MetronomoActivo.beat))
    mostrarPuntosBeat();
});

$("#botonRestarBeat").click(() => { 
    if (MetronomoActivo.beat <= 2) { return };
    MetronomoActivo.beat --;
    actualizarBeat();
    generarDots = beatArray.pop()
    mostrarPuntosBeat();
});

const mostrarConteo = (conteo) => {
    let beatActivo = document.getElementById(`beat${conteo}`);
    beatActivo.setAttribute("class", "puntoActivo");
    if (conteo >1) {
        let beatInactivo = document.getElementById(`beat${conteo-1}`);
        beatInactivo.setAttribute("class", "puntoInactivo") 
    } else {
        let beatInactivo = document.getElementById(`beat${MetronomoActivo.beat}`);
        beatInactivo.setAttribute("class", "puntoInactivo") 
    }
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
        click.play();
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

//FUNCION GUARDAR METRÓNOMO

const guardar = () => { 
    const metronomoJSON = JSON.stringify(MetronomoActivo);
    localStorage.setItem("metronomoGuardado", metronomoJSON);
}

botonGuardar.addEventListener("click", guardar);

//ANIMACIONES jQuery

$("#botonConfig").click(() => { 
    $(".contenedorConfig").slideDown(700, () => {
        $(".botonesConfig").fadeIn();
    });
});

$("#botonCerrar").click(() => { 
    $(".contenedorConfig").slideUp(700, () => {
        $(".botonesConfig").fadeOut();
    });
});