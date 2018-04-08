rutaPacientes = "sistema/pacientes/"

function cargarPacientes() {
    db.ref(rutaPacientes).once('value', function(datPacientes) {
        contenidoTablaPacientes = ""
        montoTotalPremios = 0;
        contadorPremios = 0;
        datPacientes.forEach(function(iPacientes) {
            datosPacientes = iPacientes.val();
            contenidoTablaPacientes += `<tr>
<td>` + datosPacientes.nombre + `</td>
<td>` + datosPacientes.apellido + `</td>
<td>` + datosPacientes.rut + `</td>
<td>` + datosPacientes.fono + `</td>
<td>` + datosPacientes.fechaNacimiento + `</td>
<td>  <i class="material-icons"  onclick="editarPaciente('` + iPacientes.key + `')">edit</i></td>
<td>  <i class="material-icons"  onclick="eliminarPaciente('` + iPacientes.key + `')">delete</i></td>
</tr>`
        })
        $('#cuerpoTablaPacientes').html(contenidoTablaPacientes);
        $('#tablaPacientes').DataTable();
    })
}

function editarPaciente(llave) {
    localStorage.pacienteActual = llave;
    cargadorModulo('app', 'pacientes', 'editar')
}

function cargarEditarPaciente() {
    db.ref(rutaPacientes).orderByKey().equalTo(localStorage.pacienteActual).once('value', function(datPacientes) {
        datPacientes.forEach(function(iPacientes) {
            datosPacientes = iPacientes.val();
            $('#nombrePaciente').val(datosPacientes.nombre);
            $('#apellidoPaciente').val(datosPacientes.apellido);
            $('#fechaNacimientoPaciente').val(datosPacientes.fono);
            $('#fonoPaciente').val(datosPacientes.fechaNacimiento);
        })
    })
}

function eliminarPaciente(llave) {
    alertify.confirm('Eliminar Paciente', 'Está seguro que desea eliminar el Paciente?', function() {
        db.ref(rutaPacientes + llave).remove();
        cargarPacientes();
    }, function() {});
}

function agregarPaciente(nombre, apellido, rut, fono, correo, fechaNacimiento, rut) {
    db.ref(rutaPacientes).orderByChild('rut').equalTo(rut).once('value', function(datPacientes) {
        estadoPaciente = false;
        datPacientes.forEach(function(iPacientes) {
            estadoPaciente = true;
        })
        if (estadoPaciente == false) {
            db.ref(rutaPacientes).push({
                nombre: nombre,
                apellido: apellido,
                rut: rut,
                fono: fono,
                fechaNacimiento: fechaNacimiento,
                rut: rut,
                fechaIngreso: obtenerFecha(),
                correo: correo
            })
            $('#nombrePaciente').val('').blur();
            $('#apellidoPaciente').val('').blur();
            $('#rutPaciente').val('').blur();
            $('#fonoPaciente').val('').blur();
            $('#correoPaciente').val('').blur();
            $('#fechaNacimientoPaciente').val('').blur();
            $('#rutPaciente').val('').blur();
            Materialize.toast('<span class="green-text">Paciente Registrado Con Exito!</span>', 4000)
        } else {
            Materialize.toast('<span class="yellow-text">Rut ya registrado </span>', 4000)
            $('#rutPaciente').val('').focus();
        }
    })
}