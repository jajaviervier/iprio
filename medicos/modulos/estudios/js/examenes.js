rutaExamenes = "sistema/examenes/";

function cargarExamenes() {
    db.ref(rutaExamenes).once('value', function(datExamenes) {
        contenidoTablaExamenes = ""
        montoTotalPremios = 0;
        contadorPremios = 0;
        datExamenes.forEach(function(iExamenes) {
            datosExamenes = iExamenes.val();
            contenidoTablaExamenes += `<tr>
<td>` + datosExamenes.nombre + `</td>
<td>` + datosExamenes.tipo + `</td>
<td>` + datosExamenes.sigla + `</td>
<td>  <i class="material-icons"  onclick="editarExamen('` + iExamenes.key + `')">edit</i></td>
<td>  <i class="material-icons"  onclick="eliminarExamen('` + iExamenes.key + `')">delete</i></td>
</tr>`
        })
        $('#cuerpoTablaExamenes').html(contenidoTablaExamenes);
    })
}

function eliminarExamen(llave) {
    alertify.confirm('Eliminar Examen', 'Está seguro que desea eliminar el Examen?', function() {
        db.ref(rutaExamenes + llave).remove();
        cargarExamenes();
    }, function() {});
}

function agregarExamen(nombre, tipo, sigla) {
    db.ref(rutaExamenes).orderByChild('sigla').equalTo(sigla).once('value', function(darExamenes) {
        estadoExamen = false;
        darExamenes.forEach(function(iExamenes) {
            estadoExamen = true;
        })
        if (estadoExamen == false) {
            db.ref(rutaExamenes).push({
                nombre: nombre,
                tipo: tipo,
                sigla: sigla
            })
            $('#nombreExamen').val('').blur();
            $('#tipoExamen').val('').blur();
            $('#siglaExamen').val('').blur();
            Materialize.toast('<span class="green-text">Examen Registrado Con Exito!</span>', 4000)
        } else {
            Materialize.toast('<span class="yellow-text">Sigla ya registrada </span>', 4000)
            $('#siglaExamen').val('').focus();
        }
    })
}