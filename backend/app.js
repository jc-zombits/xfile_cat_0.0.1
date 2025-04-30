const express = require("express");
const cors = require("cors");
const fileRoutes = require("./src/routes/fileRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Importar rutas
const testRoutes = require("./src/routes/testRoutes");
app.use("/api/test", testRoutes);
app.use("/api/files", fileRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error en el servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.get("/", (req, res) => {
  res.send("✅ Servidor funcionando");
});

module.exports = app;