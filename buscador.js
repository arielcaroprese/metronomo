let busqueda

$("#botonBuscar").on("click", () => {
    busqueda = $("#campoBusqueda").val();
    let URL_API = `https://api.happi.dev/v1/music?apikey=fb54fdT6RON3uTzQLFBEfDtkF4PLKqYDfdFEZHgWyCzo6ZbeaD9VwIjQ&limit=12&q=${busqueda}`;
    console.log(busqueda)
    console.log(URL_API)
    $(".cardResultado").remove();
    $.get(URL_API, (respuesta, estado) => {
        if (estado === "success") {
            let canciones = respuesta.result;
            for (const cancion of canciones) {
                $(".contenedorResultados").append(`
                <div class="cardResultado">
                <img src="${cancion.cover}" alt="" class="cover">
                <div class="infoCard">
                    <h3 class="titulo">${cancion.track}</h3>
                    <h4 class="banda">${cancion.artist}</h4>
                    <p class="bpmCancion">${cancion.bpm}<span class="textoBPMCard">bpm</span></p>
                </div>
            </div>`)
            }
        }
    })
} )



