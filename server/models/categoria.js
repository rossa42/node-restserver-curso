const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, ' nombre necesario']

    },
    descripcion: {
        type: String,
        unique: true,

        required: [true, 'descripcion es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'

    }

});
categoriaSchema.methods.toJSON = function() {
    let categoria = this;
    let categoriaObject = categoria.toObject();
    return categoriaObject;
}
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Categoria', categoriaSchema);