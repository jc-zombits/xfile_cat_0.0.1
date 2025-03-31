const app = require("./app");
const express = require('express');
//const app = express();
const port = 3001;


// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint de prueba
app.get('/', (req, res) => {
    res.send("Hello from Express!");
})

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
