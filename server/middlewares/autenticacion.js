//==========
//Verificar Token
//==========

const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                errerr: {
                    message: "Token no válido"
                }
            })
        } else {
            req.usuario = decoded.usuario;
            console.log(req.usuario);
        }
        next();
    })


};

let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario

    if (req.usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: "Uusario no es administrador"
            }
        });
    } else {
        next();
    }




};

module.exports = {
    verificarToken,
    verificarAdminRole
}