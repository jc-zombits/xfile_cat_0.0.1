const app = require("./app");
const port = process.env.PORT || 3001; // Si deseas manejar el puerto explícitamente

// Verificar conexión a la base de datos
const db = require('./src/config/db');
db.pool.query('SELECT NOW()')
  .then(() => console.log('✔ PostgreSQL conectado'))
  .catch(err => {
    console.error('✖ Error de conexión a PostgreSQL:', err);
    process.exit(1);
  });

// En Vercel, no necesitas escuchar en el puerto manualmente. Vercel maneja esto automáticamente.
// Sin embargo, si prefieres un entorno local, puedes dejar esta parte para pruebas locales.
if (process.env.NODE_ENV === 'development') {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}

// Exporta el app para que Vercel lo maneje
module.exports = app;
