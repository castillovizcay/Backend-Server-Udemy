//Requeridos

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
//Inicializar variables
var app = express();

// Importar Rutas
var appRoutes = require("./routes/app_routes");
var usuarioRoutes = require("./routes/usuario_routes");
var loginRoutes = require("./routes/login_routes");
var medicoRoutes = require("./routes/medico_routes");
var hospitalRoutes = require("./routes/hospital_routes");
var busquedaRoutes = require("./routes/busqueda_routes");
var imagenesRoutes = require("./routes/imagenes_routes");
var uploadRoutes = require("./routes/upload_routes");

//==============================
//Configurcion Body Parser
//==============================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//==============================
// End Configurcion Body Parser
//==============================

//Conexión con la BD
mongoose.connection.openUri(
  "mongodb://127.0.0.1:27017/hospitalDB",
  (err, res) => {
    if (err) throw err;

    console.log(" Base de datos OK OK OK");
  }
);

//Rutas
app.use("/", appRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/login", loginRoutes);
app.use("/medico", medicoRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/imagen", imagenesRoutes);
app.use("/upload", uploadRoutes);
app.use("/busqueda", busquedaRoutes);

//Escuchar peticiones
app.listen(3000, () => {
  console.log("El servidor se inicio correctamente");
});
