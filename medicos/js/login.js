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
  firebase.auth().onAuthStateChanged(function(user) {
      console.log('Cargando datos')
      if (user) {
          db.ref(rutacuentas).orderByKey().equalTo(firebase.auth().currentUser.uid).once('value', function(datosuser) {
              datosuser.forEach(function(itemuser) {
                  console.log(itemuser.val());
                  sessionStorage.tipocredencial = itemuser.val().tipo;
                  sessionStorage.nombreusuario = itemuser.val().nombre;
              })
              console.log(sessionStorage.tipocredencial+" Tipo usuario Logeado")
              switch (sessionStorage.tipocredencial) {
                  case 'derivador':
                      // statements_1
                      
                      cargadorModulo('app', 'examenes', 'pendientes');
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
          })
      } else {
          location.href = "../index.html";
          console.log("No logeado")
      }
  });
  variable = {};