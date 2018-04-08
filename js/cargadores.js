function cargadorModulo(objeto, modulo, archivo) {
    $('#' + objeto).fadeOut('200', function() {
        $("#" + objeto).load("modulos/" + modulo + "/" + archivo + ".html");
    });
    $('#' + objeto).fadeIn('200', function() {
        console.log(archivo + " Cargado en el objeto " + modulo);
    });
}

function cargarBarra(objeto, modulo, archivo) {
    $("#" + objeto).load("modulos/" + modulo + "/" + archivo + ".html");
    console.log("Barra de navegacion operativa")
}