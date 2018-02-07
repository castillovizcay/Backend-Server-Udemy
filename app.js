//Requeridos

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//Inicializar variables
var app = express();

// Importar Rutas
var appRoutes = require('./routes/app_routes');
var usuarioRoutes = require('./routes/usuario_routes');
var loginRoutes = require('./routes/login');

//==============================
//Configurcion Body Parser
//==============================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//==============================
// End Configurcion Body Parser
//==============================


//Conexión con la BD
mongoose.connection.openUri('mongodb://127.0.0.1:27017/hospitalDB', (err, res) =>{

    if ( err ) throw err;

    console.log(' Base de datos OK OK OK');
})

//Rutas
app.use('/', appRoutes); 
app.use('/usuario', usuarioRoutes); 
app.use('/login', loginRoutes); 

//Escuchar peticiones
app.listen(3000, () => {
    console.log('El servidor se inicio correctamente');
});