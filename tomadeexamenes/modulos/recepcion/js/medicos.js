rutaMedicos = "sistema/recepcionistas/"

function cargarRecepcionistas() {
    db.ref(rutaMedicos).once('value', function(datMedicos) {
        contenidoTablaMedicos = ""
        datMedicos.forEach(function(iMedicos) {
            datosMedicos = iMedicos.val();
            contenidoTablaMedicos += `<tr>
<td>` + datosMedicos.nombre + `</td>
<td>` + datosMedicos.apellido + `</td>
<td>` + datosMedicos.rut + `</td>
<td>` + datosMedicos.fono + `</td>
<td>` + datosMedicos.correo + `</td>
<td>  <i class="material-icons"  onclick="editarRecepcionista('` + iMedicos.key + `')">edit</i></td>
</tr>`
        })
        $('#cuerpoTablaRecepcionistas').html(contenidoTablaMedicos);
        $('#tablaMedicos').DataTable();
    })
}

function eliminarRecepcionista(llave) {
    alertify.confirm('Eliminar Recepcionista', 'Está seguro que desea eliminar el Recepcionista?', function() {
        db.ref(rutaMedicos + llave).remove();
        cargarMedicos();
    }, function() {});
}

function agregarRecepcionista(nombreMedico, apellidoMedico, rutMedico, fonoMedico, correoMedico, passMedico, rePassMedico) {
    db.ref(rutaMedicos).orderByChild('rut').equalTo(rutMedico).once('value', function(datMedicos) {
        estadoMedico = false;
        datMedicos.forEach(function(iMedicos) {
            estadoMedico = true;
        })
        if (estadoMedico == false) {
            if (passMedico == rePassMedico) {
                secondaryApp.auth().createUserWithEmailAndPassword(correoMedico, passMedico).then(function(firebaseUser2) {
                    console.log("User " + firebaseUser2.uid + " created successfully!");
                    secondaryApp.auth().signOut();
                    db.ref(rutaMedicos + firebaseUser2.uid).set({
                        nombre: nombreMedico,
                        apellido: apellidoMedico,
                        rut: rutMedico,
                        fono: fonoMedico,
                        correo: correoMedico,
                        fechaIngreso: obtenerFecha()
                    })
                    db.ref('sistema/cuentas/' + firebaseUser2.uid).set({
                        nombre: nombreMedico,
                        tipo: 'recepcion'
                    })
                    $('#nombreRecepcionista').val('').blur();
                    $('#apellidoRecepcionista').val('').blur();
                    $('#rutRecepcionista').val('').blur();
                    $('#fonoRecepcionista').val('').blur();
                    $('#correoRecepcionista').val('').blur();
                    $('#passRecepcionista').val('').blur();
                    $('#rePassRecepcionista').val('').blur();
                    Materialize.toast('<span class="green-text">Recepcionista Registrado Con Exito!</span>', 4000)
                })
            } else {
                Materialize.toast('<span class="green-text">Las Pass no son iguales</span>', 4000)
            }
        } else {
            Materialize.toast('<span class="yellow-text">Rut ya registrado </span>', 4000)
            $('#rutPaciente').val('').focus();
        }
    })
}