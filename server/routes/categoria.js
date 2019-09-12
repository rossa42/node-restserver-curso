const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');

const app = express();
const Categoria = require("../models/categoria");
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');


//Mostrar todas las categorias
app.get('/categoria', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Categoria.find({}, 'nombre descripcion').sort('descripcion').populate('usuario', 'nombre email').skip(desde).limit(limite).exec((err, categorias) => {

        console.log(categorias);
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo
                })
            })

        }

    })

});

//Mostrar categoría por ID
app.get('/categoria/:id', (req, res) => {
    //Categoria.findById
    let id = req.params.id;
    Categoria.findById(id, 'nombre descripcion').exec((err, categorias) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: err.message,
                    description: "Id ínválido"
                }
            });
        } else {
            Categoria.countDocuments({ id }, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo
                })
            })

        }

    })
});

//Crear Categoria
app.post('/categoria', [verificarToken, verificarAdminRole], function(req, res) {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            //  usuarioDB.password = null;
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        }
    });



});

//Actualizar Categoria
app.put('/categoria/:id', (req, res) => {
    //actualizar descripcion cateforia

    let id = req.params.id;
    let descripcion = req.body.descripcion;

    console.log(descripcion);
    Categoria.findOneAndUpdate(({ _id: id }), { descripcion: descripcion }, { new: true, useFindAndModify: false }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: err.message,
                    description: "Id ínválido"
                }
            });
        } else {
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria,
                    conteo
                })
            })

        }

    })
});

//Elimiaar Categoria

app.delete('/categoria/:id', (req, res) => {
    //Categoria.findById
    let id = req.params.id;

    Categoria.findOneAndDelete(({ _id: id }), (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: err.message,
                    description: "Id ínválido"
                }
            });
        } else {
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria,
                    conteo
                })
            })

        }

    })
});

module.exports = app;