const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Permitir solicitudes desde el frontend

// Importar rutas
const testRoutes = require("./src/routes/testRoutes");
app.use("/api/test", testRoutes); // ✅ CORREGIDO
app.use("/api/files", fileRoutes); // Rutas para manejar archivos

// Ruta principal de prueba
app.get("/", (req, res) => {
    res.send("✅ Servidor backend funcionando correctamente.");
});



module.exports = app;
