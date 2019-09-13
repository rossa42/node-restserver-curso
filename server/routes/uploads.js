const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            else: 'No files were uploaded.'
        });
    }


    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Tipos permitidos son " + tiposValidos.join(' , '),
                tipo: tipo
            }
        });
    }


    let archivoMuestra = req.files.archivoMuestra;

    let nombreCortado = archivoMuestra.name.split('.');

    let extensionArchivo = nombreCortado[nombreCortado.length - 1];

    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];
    let esPermitida = extensionesPermitidas.indexOf(extensionArchivo);

    if (esPermitida < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Las extensiones permitidas son " + extensionesPermitidas.join(' , '),
                ext: extensionArchivo
            }
        });
    }


    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;


    // Use the mv() method to place the file somewhere on your server
    archivoMuestra.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }

        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }
        /*
                res.json({
                    ok: true,
                    message: 'Imagen subida exitosamente'
                });*/
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios')

            return res.status(401).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios')

            return res.status(400).json({
                ok: false,
                err: {
                    messsage: "Usuario no existe"
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios')


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo

            });
        });
    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos')

            return res.status(401).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos')

            return res.status(400).json({
                ok: false,
                err: {
                    messsage: "Producto no existe"
                }
            });
        }

        borraArchivo(productoDB.img, 'productos')


        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo

            });
        });
    })
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);


    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;