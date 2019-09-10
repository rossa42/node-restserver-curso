//==========
//PUERTO
//==========

process.env.PORT = process.env.PORT || 3000;

//==========xs
//ENTORNO
//==========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========
//BD
//==========

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}


process.env.URLDB = urlDB;


//==========
//Vencimiento del token
//==========
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//==========
//SEED autenticación
//==========
process.env.SEED = process.env.SEED || 'este-es-el-secre-desarrollo';

//==========
//Google Client Id
//==========