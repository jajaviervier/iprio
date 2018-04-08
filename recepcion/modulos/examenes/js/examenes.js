rutaExamenes = "sistema/examenes/";
rutaEstudios = "sistema/estudios/";
rutaPacientes = "sistema/pacientes/";
rutaMedicos = "sistema/medicos/";

function cargarExamenesPendientes() {
    db.ref(rutaExamenes).orderByChild('estado').equalTo('Pendiente').once('value', function(datExamenPendiente) {
        contenidoTablaExamenPendiente = ''
        datExamenPendiente.forEach(function(iExamenPendiente) {
            datexampend = iExamenPendiente.val();
            contenidoEstado = "";
            if (datexampend.estadoArchivo == 'Subiendo') {
                contenidoEstado = `
<div class="preloader-wrapper small active">
    <div class="spinner-layer spinner-green-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
                `
            }
            if (datexampend.estadoArchivo == "Activo") {
                contenidoEstado = `<i class="material-icons">done_all</i>`
            }
            contenidoTablaExamenPendiente += `<tr>
<td> ` + datexampend.nombreMedico + `  ` + datexampend.apellidoMedico + `</td>
<td> ` + datexampend.nombrePaciente + `  ` + datexampend.apellidoPaciente + `</td>
<td> ` + datexampend.siglaExamen + ` </td>
<td> ` + datexampend.fechaIngreso + ` </td>
<td> ` + contenidoEstado + ` </td>
<td>      <i class="material-icons" onclick="abrirOpcionesExamen('` + iExamenPendiente.key + `')">
                                    content_paste
                                </i> </td>
            `
        })
        $('#cuerpoTablaExamenesPendientes').html(contenidoTablaExamenPendiente)
        $('#tablaPendientes').DataTable();
    })
}

function cargarArchivo() {
    const file = $('#cargadorArchivo').get(0).files[0];
    const name = (+new Date()) + '-' + file.name;
    const tipoArchivo = file.type;
    const metadata = {
        contentType: file.type
    };
    var pesoTotal = 0;
    const task = ref.child(name).put(file, metadata);
    $('#modal1').modal('close');
    Materialize.toast('<span class="yellow-text">Subiendo Archivo...</span>', 4000)
    db.ref(rutaExamenes + localStorage.keyExamenActual).update({
        estadoArchivo: 'Subiendo'
    })
    cargarExamenesPendientes()
    task.on('state_changed', function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        pesoTotal = Math.round(snapshot.totalBytes / 1024)
        console.log('Upload is ' + progress + '% done');
        $('#divCargador').show('20', function() {});
        $('#cargadorPorcentaje').attr('style', 'width:' + progress + "%");
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    }, function(error) {
        Materialize.toast('<span class="red-text">Algo salió mal... Intenta contactar con el administrador</span>', 4000)
    }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        var downloadURL = task.snapshot.downloadURL;
        db.ref(rutaExamenes + localStorage.keyExamenActual).update({
            url: task.snapshot.downloadURL,
            tipoArchivo: tipoArchivo,
            pesoArchivo: pesoTotal,
            estadoArchivo: 'Activo'
        })
        Materialize.toast('<span class="green-text">Archivo subido con Exito!</span>', 4000)
        cargarExamenesPendientes()
    });
}

function abrirOpcionesExamen(llave) {
    localStorage.keyExamenActual = llave;
    $('#modal1').modal('open');
    db.ref(rutaExamenes).orderByKey().equalTo(llave).once('value', function(datExamenPendiente) {
        datExamenPendiente.forEach(function(iExamenPendiente) {
            dd = iExamenPendiente.val()
            localStorage.llavePaciente = dd.llavePaciente
            localStorage.llaveMedico = dd.llaveMedico
            if (dd.estadoArchivo == "Activo") {
                $('#collectionArchivo').html(`
                        <ul class="collection ">
                        <li class="collection-item">
                            <div>
                                Archivo
                            </div>
                            <li class="collection-item">
                                <div>
                                    Previsualizar
                                    <a class="secondary-content"  id="rutaArchivo">
                                       <i class="material-icons" >
                                    attach_file
                                </i>
                                    </a>
                                </div>
                            </li>
                            <li class="collection-item">
                                <div>
                                    Tamaño
                                    <a class="secondary-content" href="#!">
                                        <span id="tamañoArchivo">
                                        </span>
                                    </a>
                                </div>
                            </li>
                            <li class="collection-item">
                                <div>
                                    Extensión
                                    <a class="secondary-content" href="#!">
                                        <span id="tipoArchivo">
                                        </span>
                                    </a>
                                </div>
                            </li>
                        </li>
                    </ul>
                    `)
                $('#rutaArchivo').attr('onclick', 'abrirlink("' + dd.url + '")')
                $('#tamañoArchivo').html(dd.pesoArchivo)
                $('#tipoArchivo').html(dd.tipoArchivo)
            }
            if (dd.estadoArchivo == "Subiendo") {
                $('#collectionArchivo').html(`
                        <ul class="collection ">
                        <li class="collection-item">
                          Cargando Archivo...
                        </li>
                    </ul>
                    `)
            }
            $('#iconoEliminarExamen').attr('onclick', `eliminarExamen('` + iExamenPendiente.key + `')`);
            $('#iconoPublicarExamen').attr('onclick', `publicarExamen('` + iExamenPendiente.key + `')`);
            $('#nombreMedicoOpciones').html(dd.nombreMedico)
            $('#apellidoMedicoOpciones').html(dd.apellidoMedico)
            $('#rutMedicoOpciones').html(dd.rutMedico)
            $('#nombrePacienteOpciones').html(dd.nombrePaciente)
            $('#apellidoPacienteOpciones').html(dd.apellidoPaciente)
            $('#rutPacienteOpciones').html(dd.rutPaciente)
            $('#nombreExamenOpciones').html(dd.nombreExamenActual)
            $('#siglaExamenOpciones').html(dd.siglaExamen)
            $('#tipoExamenOpciones').html(dd.tipoExamen)
        })
    })
}

function abrirlink(ruta) {
    window.open(ruta, 'Download');
}

function cargarExamenesFinalizados() {
    db.ref(rutaExamenes).orderByChild('estado').equalTo('Finalizado').once('value', function(datExamenPendiente) {
        contenidoTablaExamenPendiente = ''
        datExamenPendiente.forEach(function(iExamenPendiente) {
            datexampend = iExamenPendiente.val();
            contenidoEstado = "";
            contenidoTablaExamenPendiente += `<tr>
<td> ` + datexampend.nombreMedico + `  ` + datexampend.apellidoMedico + `</td>
<td> ` + datexampend.nombrePaciente + `  ` + datexampend.apellidoPaciente + `</td>
<td> ` + datexampend.siglaExamen + ` </td>
<td> ` + datexampend.fechaIngreso + ` </td>
<td> ` + contenidoEstado + ` </td>
<td>      <i class="material-icons" onclick="abrirOpcionesExamen('` + iExamenPendiente.key + `')">
                                    content_paste
                                </i> </td>
            `
        })
        $('#cuerpoTablaExamenesPendientes').html(contenidoTablaExamenPendiente)
        $('#tablaFinalizados').DataTable();
    })
}

function cargarTodoExamenes() {
    //autocomplete estudio
    db.ref(rutaEstudios).once('value', function(datEstudios) {
        listadoEstudios = '{'
        datEstudios.forEach(function(iestudios) {
            nombreEstudio = iestudios.val().nombre;
            listadoEstudios += '"' + nombreEstudio + '":null,'
        })
        listadoEstudios = listadoEstudios.substring(0, listadoEstudios.length - 1)
        listadoEstudios += '}';
        cadena = JSON.parse(listadoEstudios);
        $('#estudioExamen').autocomplete({
            data: cadena,
            limit: 20,
            onAutocomplete: function(val) {},
            minLength: 1,
        })
    })
    //autocomplete medico
    db.ref(rutaMedicos).once('value', function(datMedico) {
        listadoMedico = '{'
        datMedico.forEach(function(imedico) {
            nombreMedico = imedico.val().rut;
            listadoMedico += '"' + nombreMedico + '":null,'
        })
        listadoMedico = listadoMedico.substring(0, listadoMedico.length - 1)
        listadoMedico += '}';
        cadenaMedicos = JSON.parse(listadoMedico);
        $('#medicoExamen').autocomplete({
            data: cadenaMedicos,
            limit: 20,
            onAutocomplete: function(val) {},
            minLength: 1,
        })
    })
    //autocomplete medico
    db.ref(rutaPacientes).once('value', function(datPacientes) {
        listadoPacientes = '{'
        datPacientes.forEach(function(iPacientes) {
            rutPaciente = iPacientes.val().rut;
            listadoPacientes += '"' + rutPaciente + '":null,'
        })
        listadoPacientes = listadoPacientes.substring(0, listadoPacientes.length - 1)
        listadoPacientes += '}';
        cadenaPacientes = JSON.parse(listadoPacientes);
        $('#pacienteExamen').autocomplete({
            data: cadenaPacientes,
            limit: 20,
            onAutocomplete: function(val) {},
            minLength: 1
        })
    })
}
$("#pacienteExamen").change(function() {
    db.ref(rutaPacientes).orderByChild('rut').equalTo($("#pacienteExamen").val()).once('value', function(nompa) {
        textoPaciente = "Paciente"
        sessionStorage.controlPaciente = false
        nompa.forEach(function(resultPaciente) {
            textoPaciente = resultPaciente.val().nombre + " " + resultPaciente.val().apellido
            sessionStorage.controlPaciente = true
            sessionStorage.pacienteActual = resultPaciente.key
            sessionStorage.nombrePacienteActual = resultPaciente.val().nombre
            sessionStorage.apellidoPacienteActual = resultPaciente.val().apellido
            sessionStorage.rutPacienteActual = resultPaciente.val().rut
        })
        $('#textoPaciente').html(textoPaciente);
    })
});
$("#medicoExamen").change(function() {
    db.ref(rutaMedicos).orderByChild('rut').equalTo($("#medicoExamen").val()).once('value', function(nommedic) {
        textoMedico = "Medico"
        sessionStorage.controlMedico = false
        nommedic.forEach(function(resultMedico) {
            textoMedico = resultMedico.val().nombre + " " + resultMedico.val().apellido
            sessionStorage.controlMedico = true
            sessionStorage.medicoActual = resultMedico.key
            sessionStorage.nombreMedicoActual = resultMedico.val().nombre
            sessionStorage.apellidoMedicoActual = resultMedico.val().apellido
            sessionStorage.tipoMedicoActual = resultMedico.val().tipo
            sessionStorage.rutMedicoActual = resultMedico.val().rut
        })
        $('#textoMedico').html(textoMedico);
    })
});
$("#estudioExamen").change(function() {
    db.ref(rutaEstudios).orderByChild('nombre').equalTo($("#estudioExamen").val()).once('value', function(txtEstudio) {
        textEstudio = "Estudio"
        sessionStorage.controlEstudio = false
        txtEstudio.forEach(function(resultEstudio) {
            sessionStorage.controlEstudio = true
            textEstudio = resultEstudio.val().nombre + " - " + resultEstudio.val().sigla + " - " + resultEstudio.val().tipo
            sessionStorage.nombreExamenActual = resultEstudio.val().nombre;
            sessionStorage.siglaExamenActual = resultEstudio.val().sigla;
            sessionStorage.tipoExamenActual = resultEstudio.val().tipo;
        })
        $('#textoEstudio').html(textEstudio);
    })
});

function eliminarExamen(llave) {
    alertify.confirm('Eliminar Examen', 'Está seguro que desea eliminar el Examen?', function() {
        db.ref(rutaExamenes + llave).remove();
        cargarExamenesPendientes();
    }, function() {});
}

function publicarExamen(llave) {
    alertify.confirm('Compartir Examen', 'Está seguro que desea publicar y compartir el Examen?', function() {
        db.ref(rutaExamenes + llave + "/").update({
            estado: "Finalizado"
        });
        $('#modal1').modal('close');
        cargarExamenesPendientes();
    }, function() {});
}

function guardarSolicitudExamen(medico, paciente, estudio, prioridad) {
    alertify.prompt('Codigo Verificación', 'Ingrese su Clave', 'Prompt Value', function(evt, value) {}, function() {});
    estadoFormularioExamen = true
    if (sessionStorage.controlPaciente == "false") {
        estadoFormularioExamen = false;
        Materialize.toast('<span class="yellow-text">Paciente no Valido</span>', 4000)
    }
    if (sessionStorage.controlEstudio == "false") {
        estadoFormularioExamen = false
        Materialize.toast('<span class="yellow-text">Estudio no Valido</span>', 4000)
    }
    if (sessionStorage.controlMedico == "false") {
        estadoFormularioExamen = false
        Materialize.toast('<span class="yellow-text">Medico no Valido</span>', 4000)
    }
    $("#pacienteExamen").val('');
    $("#medicoExamen").val('');
    $("#estudioExamen").val('');
    $('#textoPaciente').html('Paciente');
    $('#textoMedico').html('Medico');
    $('#textoEstudio').html('Estudio');
    if (estadoFormularioExamen == true) {
        db.ref('sistema/examenes').push({
            nombreExamenActual: sessionStorage.nombreExamenActual,
            siglaExamen: sessionStorage.siglaExamenActual,
            tipoExamen: sessionStorage.tipoExamenActual,
            nombreMedico: sessionStorage.nombreMedicoActual,
            apellidoMedico: sessionStorage.apellidoMedicoActual,
            rutMedico: sessionStorage.rutMedicoActual,
            horaIngreso: obtenerHora(),
            fechaIngreso: obtenerFecha(),
            tipoUsuarioRegistro: "recepcion",
            nombreUsuarioRegistro: sessionStorage.nombreusuario,
            estado: "Pendiente",
            nombrePaciente: sessionStorage.nombrePacienteActual,
            apellidoPaciente: sessionStorage.apellidoPacienteActual,
            rutPaciente: sessionStorage.rutPacienteActual,
            url: "",
            llavePaciente: sessionStorage.pacienteActual,
            llaveMedico: sessionStorage.medicoActual,
            estadoArchivo: "ninguno",
            prioridad: prioridad
        }).then(function(datosIngreso) {
            db.ref('sistema/medicos/' + sessionStorage.medicoActual + "/examenes/" + datosIngreso.key).set(true)
            db.ref('sistema/pacientes/' + sessionStorage.pacienteActual + "/examenes/" + datosIngreso.key).set(true)
        })
    }
}