const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcryptjs');
const _ = require('underscore');

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email role estado google img').skip(desde).limit(limite).exec((err, usuarios) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            //  usuarioDB.password = null;
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })

        }

    })


});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        estado: body.estado,
        google: body.google,


    });


    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            //  usuarioDB.password = null;
            res.json({
                ok: true,
                usuario: usuarioDB
            })
        }
    });
    /* if (body.nombre === undefined) {
         res.status(400).json({
             ok: false,
             mensaje: 'El nombre es necesario'
         });
     } else {
         res.json({ persona: body })
     }*/


});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { context: 'query', new: true, runValidators: true, useFindAndModify: false }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }

    })




});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['estado']);


    Usuario.findByIdAndUpdate(id, body, { context: 'query', new: true, runValidators: true, useFindAndModify: false }, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                res.json({
                    ok: true,
                    usuario: usuarioDB
                });
            }

        })
        /*Usuario.findByIdAndRemove(id, { useFindAndModify: false }, (err, usuarioBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else if (usuarioBorrado === null) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: 'Usuario no existe en BD'
                    }
                });
            } else {
                res.json({
                    ok: true,
                    usuario: usuarioBorrado
                });
            }

        });*/
});



module.exports = app;