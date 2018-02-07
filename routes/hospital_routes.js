var express = require("express");

var Hospital = require("../models/hospital");
//var SEED = require('../config/config').SEED;

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();

//==============================
// Get todos los Hospitales
//==============================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error al cargar los Hospitales",
          errors: err
        });
      }

      Hospital.count({}, (err, cant) => {
        res.status(201).json({
          ok: true,
          mensaje: "Hospitales ok",
          hospitales: hospitales,
          total: cant
        });
      });
    });
});

//==============================
//Crear un nuevo Hospital
//==============================

app.post("/", mdAutentificacion.verificarToken, (req, res) => {
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    img: body.img,
    usuario: req.usuario._id
  });

  hospital.save((err, hospitalSave) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error al crear el nuevo Hospital",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: "Hospital creado correctamente",
      hospital: hospitalSave,
      usuarioToken: req.usuario
    });
  });
});

//==============================
//Actualizar un nuevo Hospital
//==============================

app.put("/:id", mdAutentificacion.verificarToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error al buscar el Hospital",
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el ID" + id + " no existe",
        errors: { message: "No existe un hospital con ese ID" }
      });
    }

    hospital.nombre = body.nombre;
    hospital.img = body.img;
    hospital.usuario = req.usuario._id;

    hospital.save((err, updateHospital) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje:
            "No se pudo actualizar el hospital, a ocurrido un error inesperado",
          errors: err
        });
      }

      return res.status(200).json({
        ok: true,
        mensaje: "El hospital se actualizo correctamente",
        hospital: updateHospital,
        usuarioToken: req.usuario
      });
    });
  });
});

//==============================
//Eliminar un nuevo Hospital
//==============================
app.delete("/:id", mdAutentificacion.verificarToken, (req, res) => {
  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, deleteHospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al eliminar el hospital",
        errors: err
      });
    }

    if (!deleteHospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital no existe en la base de datos",
        errors: { message: "El hospital no existe en la base de datos" }
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: "El hospital se elimino correctamente",
      hospital: deleteHospital,
      usuarioToken: req.usuario
    });
  });
});

module.exports = app;
