const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');


let app = express();
let Producto = require('../models/producto');

//Obtener Productos
app.get('/producto', (req, res) => {

    Producto.find().populate('usuario').populate('categoria').exec((err, productosDB) => {
        if (err) {
            res.status(400).json({
                ok: "false",
                err
            })
        } else {
            res.json({
                ok: "true",
                mensaje: 'Productos Obtenidos  exitosamente',
                productosDB
            })
        }
    })

});

//Obtener Productos por ID
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    let opciones = { useFindAndModify: false, new: true };
    Producto.find({ nombre: regex }).populate('categoria', 'nombre').exec((err, productosDB) => {
        if (err) {
            res.status(400).json({
                ok: "false",
                err
            })
        } else {
            res.json({
                ok: "true",
                mensaje: 'Productos Obtenidos  exitosamente',
                productosDB
            })
        }
    })


});


//Obtener Productos por ID
app.get('/producto/:id', (req, res) => {
    let id = req.params.id;

    let opciones = { useFindAndModify: false, new: true };
    Producto.findById(id, (err, productosDB) => {
        if (err) {
            res.status(400).json({
                ok: "false",
                err
            })
        } else {
            res.json({
                ok: "true",
                mensaje: 'Productos Obtenidos  exitosamente',
                productosDB
            })
        }
    })


});

//Crear Producto
app.post('/producto', verificarToken, (req, res) => {
    //Crear usuario
    //grabar una categoría del listsado
    //
    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, producto) => {
        if (err) {
            res.status(400).json({
                ok: "false",
                err
            })
        } else {
            res.json({
                ok: "true",
                mensaje: 'Producto guardado exitosamente',
                producto
            })
        }
    });




});

//Actualizar Producto
app.put('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;


    let producto = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    };




    let opciones = { useFindAndModify: false, new: true };
    Producto.findByIdAndUpdate(id, producto, opciones, (err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: "false",
                err
            })
        } else {
            res.json({
                ok: "true",
                mensaje: 'Producto actualizado  exitosamente',
                productoDB
            })
        }
    })

});

//Eliminar Producto solo lógico
app.delete('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;


    let producto = {
        disponible: false
    };




    let opciones = { useFindAndModify: false, new: true };
    Producto.findByIdAndUpdate(id, producto, opciones, (err, producto) => {
        if (err) {
            res.status(400).json({
                ok: "false",
                err
            })
        } else {
            res.json({
                ok: "true",
                mensaje: 'Producto actualizado  exitosamente',
                producto
            })
        }
    })

});

module.exports = app;