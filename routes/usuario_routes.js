var express = require("express");
var bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");

var Usuario = require("../models/usuario");
//var SEED = require('../config/config').SEED;

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();

//==============================
// Get todos los Usuarios
//==============================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Usuario.find({}, "nombre email img role")
    .skip(desde)
    .limit(5)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error al cargar los Usuarios",
          errors: err
        });
      }

      Usuario.count({}, (err, cant) => {
        res.status(201).json({
          ok: true,
          mensaje: "Usuario ok",
          usuarios: usuarios,
          total: cant
        });
      });
    });
});

//==============================
//Crear un nuevo Usuario
//==============================

app.post("/", mdAutentificacion.verificarToken, (req, res) => {
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcryptjs.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, userSave) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error al crear el nuevo Usuario",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: "Usuario creado correctamente",
      usuario: userSave,
      usuarioToken: req.usuario
    });
  });
});

//==============================
//Actualizar un nuevo Usuario
//==============================

app.put("/:id", mdAutentificacion.verificarToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error al buscar el Usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el ID" + id + " no existe",
        errors: { message: "No existe un usuario con ese ID" }
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, updateUser) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "No se pudo actualizar el usuario",
          errors: err
        });
      }

      updateUser.password = ":)";
      return res.status(200).json({
        ok: true,
        mensaje: "El usuario se actualizo correctamente",
        usuario: updateUser,
        usuarioToken: req.usuario
      });
    });
  });
});

//==============================
//Eliminar un nuevo Usuario
//==============================
app.delete("/:id", mdAutentificacion.verificarToken, (req, res) => {
  var id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, deleteUser) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al eliminar el usuario",
        errors: err
      });
    }

    if (!deleteUser) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario no existe en la base de datos",
        errors: { message: "El usuario no existe en la base de datos" }
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: "El usuario se elimino correctamente",
      usuario: deleteUser,
      usuarioToken: req.usuario
    });
  });
});

module.exports = app;
