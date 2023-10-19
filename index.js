require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// crear el servidor express
const app = express();

// cors
app.use(cors());

// lectura y parseo del body
app.use(express.json());

// base de datos
dbConnection();

// unzat
// masterkey
// mongodb+srv://unzat:masterkey@cluster0.djo4syu.mongodb.net/hospitaldb

// rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});