var express = require("express");
var bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");

var Medico = require("../models/medico");
//var SEED = require('../config/config').SEED;

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();

//==============================
// Get todos los Medicos
//==============================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("hospital")
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error al cargar los medicos",
          errors: err
        });
      }

      Medico.count({}, (err, cant) => {
        res.status(201).json({
          ok: true,
          mensaje: "Medicos ok",
          medicos: medicos,
          total: cant
        });
      });
    });
});

//==============================
//Crear un nuevo Medico
//==============================

app.post("/", mdAutentificacion.verificarToken, (req, res) => {
  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    img: body.img,
    usuario: req.usuario.id,
    hospital: body.hospital
  });

  medico.save((err, saveMedico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error al crear el nuevo Medico",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: "Medico creado correctamente",
      medico: saveMedico,
      usuarioToken: req.usuario
    });
  });
});

//==============================
//Actualizar un nuevo Medico
//==============================

app.put("/:id", mdAutentificacion.verificarToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error al buscar el Medico",
        errors: err
      });
    }

    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: "El medico con el ID" + id + " no existe",
        errors: { message: "No existe un medico con ese ID" }
      });
    }

    medico.nombre = body.nombre;
    medico.img = body.img;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save((err, updateMedico) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje:
            "No se pudo actualizar el medico, a ocurrido un error inesperado",
          errors: err
        });
      }

      return res.status(200).json({
        ok: true,
        mensaje: "El medico se actualizo correctamente",
        medico: updateMedico,
        usuarioToken: req.usuario
      });
    });
  });
});

//==============================
//Eliminar un nuevo Medico
//==============================
app.delete("/:id", mdAutentificacion.verificarToken, (req, res) => {
  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, deleteMedico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al eliminar el medico",
        errors: err
      });
    }

    if (!deleteMedico) {
      return res.status(400).json({
        ok: false,
        mensaje: "El medico no existe en la base de datos",
        errors: { message: "El medico no existe en la base de datos" }
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: "El medico se elimino correctamente",
      medico: deleteMedico,
      usuarioToken: req.usuario
    });
  });
});

module.exports = app;
