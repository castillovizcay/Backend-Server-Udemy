var express = require('express');
var bcryptjs = require('bcryptjs');

var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var Usuario = require('../models/usuario');

var app = express();

app.post('/', (req , res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email}, (err, usuarioDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Ocurrio un error al buscar el Usuario',
                errors: err
            });  
        }

        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no fue encontrado',
                errors: {message: 'No existe un usuario con ese EMail'}
            });  
        }

        if ( !bcryptjs.compareSync( body.password, usuarioDB.password ) ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La contraseña no coinside',
                //errors: {message: 'No existe un usuario con ese con ese EMail'}
            });  
        }
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14000 } );  // 4 horas

        return res.status(200).json({
            ok: true,
            mensaje: 'El usuario si es valido WELCOME',                
            usuario: usuarioDB,
            token: token
        });
    });

    
});




module.exports = app;