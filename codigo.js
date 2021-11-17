//VARIABLES GLOBALES

let conteo = 1;
let intervalo;
let play = false;

// SONIDOS

const click = new Audio('click.mp3')
const acento = new Audio('acento.mp3')

// FUNCION CONSTRUCTORA DEL OBJETO METRONOMO
class Metronomo {
    constructor (tempo, beat) {
        this.tempo = tempo;
        this.beat = beat;
    }
}

// CREA EL METRONOMO - Si está guardado se carga el guardado, sino crea uno genérico

const metronomoGuardado = JSON.parse(localStorage.getItem("metronomoGuardado"));

if (metronomoGuardado != null) {
    MetronomoActivo = new Metronomo(metronomoGuardado.tempo, metronomoGuardado.beat);
} else {
    MetronomoActivo = new Metronomo(140, 4);
}

// FUNCIONES

// ACTUALIZAR BPM

const actualizarBPM = () => {
    $("#numeroBPM").html(MetronomoActivo.tempo);
    $("#tempoSlider").val = MetronomoActivo.tempo;
}

// ACTUALIZAR BEAT

const actualizarBeat = () => {
    $("#numeroBeat").html(MetronomoActivo.beat);
}

// ARRAY DE BEATS Y FUNCION CONSTRUCTORA DEL OBJETO BEAT

beatArray = [];
class Beat {
    constructor (beat) {
        this.numero = beat;
        this.acento = false;
    }
}

// generar beat iniciales

for (let i = 1; i <= MetronomoActivo.beat; i++) {
    generarDots = beatArray.push(new Beat(i))
  }

// FUNCION PARA MOSTRAR LOS DOTS DE BEAT EN LA UI

contenedorBeat = document.getElementById("contenedorBeat");

const mostrarPuntosBeat = () => {
    contenedorBeat.innerHTML = ``;   
    for (let beat of beatArray) {
        let punto = document.createElement("div");
        punto.setAttribute("id", `beat${beat.numero}`);
        punto.setAttribute("class", "puntoInactivo");
        contenedorBeat.appendChild(punto);    
    }
}

actualizarBPM();
actualizarBeat();
mostrarPuntosBeat();

// FUNCION PARA MOSTRAR EL BEAT ACTIVO EN LA REPRODUCCION

const mostrarConteo = (conteo) => {
    let beatActivo = document.getElementById(`beat${conteo}`);
    beatActivo.setAttribute("class", "puntoActivo");
    if (conteo > 1) {
        let beatInactivo = document.getElementById(`beat${conteo-1}`);
        beatInactivo.setAttribute("class", "puntoInactivo") 
    } else {
        let beatInactivo = document.getElementById(`beat${MetronomoActivo.beat}`);
        beatInactivo.setAttribute("class", "puntoInactivo") 
    }
}

// FUNCION DE REPRODUCCIÓN

const playClick = () => {
    if (conteo === 1) {
        mostrarConteo(conteo);
        acento.play();
        conteo++;
    }
    else {
        mostrarConteo(conteo);
        click.play();
        conteo++;
        if (conteo > MetronomoActivo.beat) {
            conteo = 1;
        }  
    }
}

//FUNCIONES DE INTERVALO

const funcionPlay = () => {
    clearInterval(intervalo);
    intervalo = setInterval(playClick, 60000 / MetronomoActivo.tempo);
    play = true;
};

const funcionStop = () => {
    clearInterval(intervalo);
    play = false;
};

const playStop = () => {
    if (!play) {
        funcionPlay();
        botonPlay.innerHTML = '<i class="fas fa-pause"></i>';
    }
    else {
        funcionStop();
        botonPlay.innerHTML = '<i class="fas fa-play"></i>';
    }
};

botonPlay.addEventListener("click", playStop);

//FUNCION GUARDAR METRÓNOMO

const guardar = () => { 
    const metronomoJSON = JSON.stringify(MetronomoActivo);
    localStorage.setItem("metronomoGuardado", metronomoJSON);
};

// EVENTOS

// EVENTOS BPM

$("#botonSumarBPM").click(() => { 
    if (MetronomoActivo.tempo >= 260) { return };
    MetronomoActivo.tempo ++;
    actualizarBPM();
    if (play) {
        funcionPlay();
    }
});

$("#botonRestarBPM").click(() => { 
    if (MetronomoActivo.tempo <= 20) { return };
    MetronomoActivo.tempo --;
    actualizarBPM(); 
    if (play) {
        funcionPlay();
    }
});

$("#slider").change(() => { 
    MetronomoActivo.tempo = $("#slider").val();
    $("#numeroBPM").html(MetronomoActivo.tempo);
    if (play) {
        funcionPlay();
    }
});

// EVENTOS BEATS 

$("#botonSumarBeat").click(() => { 
    if (MetronomoActivo.beat >= 12) { return };
    MetronomoActivo.beat ++;
    actualizarBeat();
    generarDots = beatArray.push(new Beat(MetronomoActivo.beat));
    mostrarPuntosBeat();
    conteo = 1;
});

$("#botonRestarBeat").click(() => { 
    if (MetronomoActivo.beat <= 2) { return };
    MetronomoActivo.beat --;
    actualizarBeat();
    generarDots = beatArray.pop()
    mostrarPuntosBeat();
    conteo = 1;
});

// EVENTO GUARDAR METRONOMO

botonGuardar.addEventListener("click", guardar);

// ANIMACIONES

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

// BUSCADOR

let busqueda;
let id_track;

const buscar = () => {
    busqueda = $("#campoBusqueda").val();
    let URL_API = `https://api.happi.dev/v1/music?apikey=fb54fdT6RON3uTzQLFBEfDtkF4PLKqYDfdFEZHgWyCzo6ZbeaD9VwIjQ&limit=12&q=${busqueda}`;
    $(".cardResultado").remove();
    $.get(URL_API, (respuesta, estado) => {
        if (estado === "success") {
            let canciones = respuesta.result;
            for (const cancion of canciones) {
                $(".contenedorResultados").append(`
                <div class="cardResultado">
                    <img src="${cancion.cover}" alt="" class="cover"> 
                    <div>
                        <h3 class="titulo">${cancion.track}</h3>
                        <h4 class="banda">${cancion.artist}</h4>
                    </div>
                    <div class="bpmCard">
                        <p class="bpmCancion">${cancion.bpm}<span class="textoBPMCard">bpm</span></p>
                    </div>          
                </div>`);
                id_track = cancion.id_track; 
            }
        }
    }) 
};

$("#botonBuscar").on("click", () => {
    buscar();
});

$("#campoBusqueda").on('keypress',function(e) {
    if(e.which == 13) {
        e.preventDefault();
        buscar();
    }
});




