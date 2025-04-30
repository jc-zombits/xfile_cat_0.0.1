const app = require("./app");
const port = process.env.PORT || 3001;

// Elimina estas líneas redundantes:
// const express = require('express');
// const app = express();

// Verificar conexión a la base de datos
const db = require('./src/config/db');
db.pool.query('SELECT NOW()')
  .then(() => console.log('✔ PostgreSQL conectado'))
  .catch(err => {
    console.error('✖ Error de conexión a PostgreSQL:', err);
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});