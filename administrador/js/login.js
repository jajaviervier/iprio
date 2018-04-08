  //aqui van las credenciales
  var config = {
      apiKey: "AIzaSyA9c7-wnVEAnkoNCp7Tknk72npn4lxRu-Y",
      authDomain: "medicos-3cdc3.firebaseapp.com",
      databaseURL: "https://medicos-3cdc3.firebaseio.com",
      projectId: "medicos-3cdc3",
      storageBucket: "medicos-3cdc3.appspot.com",
      messagingSenderId: "146289192580"
  };
  firebase.initializeApp(config);
  const ref = firebase.storage().ref();
  var db = firebase.database();
  var secondaryApp = firebase.initializeApp(config, "Secondary");
  //aqui van las credenciales
  var rutacuentas = "sistema/cuentas/";
  var rutaNotificaciones = "sistema/notificaciones/";

  function logear(correo, pass) {
      var control = 0;
      firebase.auth().signInWithEmailAndPassword(correo, pass).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          control = 1;
          console.log(error.code)
          if (error.code == "auth/user-not-found") {
              alertify.error("Usuario no encontrado");
          } else {
              if (error.code == "auth/wrong-password") {
                  alertify.error("Pass invalida");
              } else {}
          }
          // ...
      });
  }

  function logout() {
      alertify.confirm('Cerrar Sesion', 'Está seguro que desea cerrar la sesion?', function() {
          firebase.auth().signOut().then(function() {
              // Sign-out successful.
          }, function(error) {
              // An error happened.
          });
      }, function() {});
  }
  firebase.auth().onAuthStateChanged(function(user) {
      console.log(user)
      if (user) {
          db.ref(rutacuentas).orderByKey().equalTo(firebase.auth().currentUser.uid).once('value', function(datosuser) {
              datosuser.forEach(function(itemuser) {
                  console.log(itemuser.val());
                  sessionStorage.tipocredencial = itemuser.val().tipo;
                  sessionStorage.nombreusuario = itemuser.val().nombre;
              })
              if (sessionStorage.tipocredencial == "admin") {
                  // lo tira al panel de admin
                  cargadorModulo('app', 'examenes', 'pendientes');
                  cargarNotificaciones();
              } else {
                  if (sessionStorage.tipocredencial == "trabajador") {
                      // lo tira al panel de caja
                      logout()
                  } else {
                      // no lo tira a ningun lado y lo desconecta
                      console.log("Tipo de cuenta incorrecto")
                  }
              }
          })
      } else {
          location.href = "../index.html";
          console.log("No logeado")
      }
  });
  variable = {};

  function cargarNotificaciones() {
      db.ref(rutaNotificaciones).on('value', function(datNoti) {
          sumaNoti = 0
          datNoti.forEach(function(iNoti) {
              datnot = iNoti.val();
              sumaNoti += parseInt(datnot);
          })
          if (sumaNoti > 0) {
              $('#avisoNotificaciones').html(`

 <a href="#!" onclick="borrarnotificaciones()">
                      ` + sumaNoti + `
                        <i class="material-icons right">
                            notifications
                        </i>
                    </a>

                `);
              $('#avisoNotificaciones').attr('class', 'indigo white-text');
              if (sumaNoti == 1) {
                  Materialize.toast('<span class="green-text">Existe ' + sumaNoti + ' Examen pendiente</span>', 4000)
              } else {
                  Materialize.toast('<span class="green-text">Existen ' + sumaNoti + ' Examenes pendientes</span>', 4000)
              }
          } else {
              $('#avisoNotificaciones').html('');
              $('#avisoNotificaciones').attr('class', '');
          }
      })
  }

  function borrarnotificaciones() {
      db.ref(rutaNotificaciones).update({
          cantidadNoti: 0
      })
      cargadorModulo('app', 'examenes', 'pendientes');
  }