//Requeridos

var express = require('express');
var mongoose = require('mongoose');

//Inicializar variables
var app = express();


//Conexión con la BD
mongoose.connection.openUri('mongodb://127.0.0.1:27017/hospitalDB', (err, res) =>{

    if ( err ) throw err;

    console.log(' Base de datos OK OK OK');
})

//Rutas
app.get('/', (req, res, next ) =>{

    res.status(200).json({
        ok: true,
        mensaje: 'Este es el mensaje y todo va bien'
    })
})

//Escuchar peticiones
app.listen(3000, () => {
    console.log('El servidor se inicio correctamente');
});