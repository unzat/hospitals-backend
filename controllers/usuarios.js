const { response, json } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res = response) => {

    const usuarios = await Usuario.find({}, 'name email role google');

    res.json({
        ok: true,
        usuarios
    })
}

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
            });
        }

        const usuario = new Usuario(req.body);

        // encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // guardar usuario
        await usuario.save();

        // generar token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
}

const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese id',
            });
        }

        // actualizaciones
        const { password, google, email, ...campos} = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email',
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500), json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese id',
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            mdg: 'Usuario eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500), json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
}