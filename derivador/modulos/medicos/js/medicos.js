rutaMedicos = "sistema/medicos/"

function cargarMedicos() {
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
<td>  <i class="material-icons"  onclick="editarMedico('` + iMedicos.key + `')">edit</i></td>
</tr>`
        })
        $('#cuerpoTablaMedicos').html(contenidoTablaMedicos);
    })
}

function eliminarMedico(llave) {
    alertify.confirm('Eliminar Medico', 'Está seguro que desea eliminar el Medico?', function() {
        db.ref(rutaMedicos + llave).remove();
        cargarMedicos();
    }, function() {});
}

function agregarMedico(nombreMedico, apellidoMedico, rutMedico, fonoMedico, correoMedico, passMedico, rePassMedico) {
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
                        tipo: 'medico'
                    })
                    $('#nombreMedico').val('').blur();
                    $('#apellidoMedico').val('').blur();
                    $('#rutMedico').val('').blur();
                    $('#fonoMedico').val('').blur();
                    $('#correoMedico').val('').blur();
                    $('#rutPaciente').val('').blur();
                    $('#passMedico').val('').blur();
                    $('#rePassMedico').val('').blur();
                    Materialize.toast('<span class="green-text">Paciente Registrado Con Exito!</span>', 4000)
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