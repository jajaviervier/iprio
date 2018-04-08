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
  var db = firebase.database();
  //aqui van las credenciales
  var rutacuentas = "sistema/cuentas/";

  function logout() {
      alertify.confirm('Cerrar Sesion', 'Está seguro que desea cerrar la sesion?', function() {
          firebase.auth().signOut().then(function() {
              // Sign-out successful.
          }, function(error) {
              // An error happened.
          });
      }, function() {});
  }

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
  firebase.auth().onAuthStateChanged(function(user) {
      console.log(user)
      if (user) {
          db.ref(rutacuentas).orderByKey().equalTo(firebase.auth().currentUser.uid).once('value', function(datosuser) {
              datosuser.forEach(function(itemuser) {
                  console.log(itemuser.val());
                  sessionStorage.tipocredencial = itemuser.val().tipo;
                  sessionStorage.nombreusuario = itemuser.val().nombre;
              })
              console.log(sessionStorage.tipocredencial);
              switch (sessionStorage.tipocredencial) {
                  case 'admin':
                      // statements_1
                      location.href = "administrador/panel.html";
                      break;
                  case 'derivador':
                      // statements_1
                      location.href = "medicos/panel.html";
                      break;
                  case 'recepcion':
                      // statements_1
                      location.href = "recepcion/panel.html";
                      break;
                  case 'paciente':
                      // statements_1
                      location.href = "paciente/panel.html";
                      break;
                  case 'tomadeexamenes':
                      // statements_1
                      location.href = "tomadeexamenes/panel.html";
                      break;
                  default:
                      // statements_def
                      firebase.auth().signOut().then(function() {
                          // Sign-out successful.
                      }, function(error) {
                          // An error happened.
                      });
                      break;
              }
          });
      }
  });
  variable = {};