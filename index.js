require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// crear el servidor express
const app = express();

// cors
app.use(cors());

// base de datos
dbConnection();

// unzat
// masterkey
// mongodb+srv://unzat:masterkey@cluster0.djo4syu.mongodb.net/hospitaldb

// rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola Mundo'
    })
});

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});