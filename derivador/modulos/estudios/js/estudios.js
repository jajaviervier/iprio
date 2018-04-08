rutaEstudios = "sistema/estudios/";

function cargarEstudios() {
    db.ref(rutaEstudios).once('value', function(datEstudios) {
        contenidoTablaEstudios = ""
        datEstudios.forEach(function(iEstudios) {
            datosEstudios = iEstudios.val();
            contenidoTablaEstudios += `<tr>
<td>` + datosEstudios.nombre + `</td>
<td>` + datosEstudios.tipo + `</td>
<td>` + datosEstudios.sigla + `</td>
<td>  <i class="material-icons"  onclick="editarEstudio('` + iEstudios.key + `')">edit</i></td>
<td>  <i class="material-icons"  onclick="eliminarEstudio('` + iEstudios.key + `')">delete</i></td>
</tr>`
        })
        $('#cuerpoTablaExamenes').html(contenidoTablaEstudios);
    })
}

function eliminarEstudio(llave) {
    alertify.confirm('Eliminar Estudio', 'Está seguro que desea eliminar el Estudio?', function() {
        db.ref(rutaEstudios + llave).remove();
        cargarEstudios();
    }, function() {});
}

function agregarEstudio(nombre, tipo, sigla) {
    db.ref(rutaEstudios).orderByChild('sigla').equalTo(sigla).once('value', function(darExamenes) {
        estadoEstudio = false;
        darExamenes.forEach(function(iEstudios) {
            estadoEstudio = true;
        })
        if (estadoEstudio == false) {
            db.ref(rutaEstudios).push({
                nombre: nombre,
                tipo: tipo,
                sigla: sigla
            })
            $('#nombreEstudio').val('').blur();
            $('#tipoEstudio').val('').blur();
            $('#siglaEstudio').val('').blur();
            Materialize.toast('<span class="green-text">Estudio Registrado Con Exito!</span>', 4000)
        } else {
            Materialize.toast('<span class="yellow-text">Sigla ya registrada </span>', 4000)
            $('#siglaExamen').val('').focus();
        }
    })
}