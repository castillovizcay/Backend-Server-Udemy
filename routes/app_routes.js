

var express = require('express');

var app_routes = express();

app_routes.get('/', (req, res, next ) =>{

    res.status(200).json({
        ok: true,
        mensaje: 'Este es el mensaje y todo va bien'
    })
})

module.exports = app_routes;