const bcrypt = require('bcryptjs');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token

        });
    })

});

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    console.log("payloiad" + payload);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }


}
//verify().catch(console.error);

app.post('/google', async(req, res) => {


    let token = req.body.idtoken;

    console.log('token' + token);

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });


    console.log(googleUser.email);
    if (googleUser.email != undefined) {
        Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } else if (googleUser) {
                console.log('usuarioDB.google ' + usuarioDB.google);
                if (usuarioDB.google === false) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: "Usar autenticación normal"
                        }
                    });
                } else {
                    let token =
                        jwt.sign({
                            usuario: usuarioDB
                        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    })

                }
            } else {
                //Usuario no existe en la base de datos
                let usuario = new Usuario();
                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.google = true;

                usuario.img = googleUser.img;
                usuario.password = ':)';

                usuario.save((err, usuarioDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                })


            }
        });

        console.log('fin');
    }

});
module.exports = app;