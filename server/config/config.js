//==========
//PUERTO
//==========

process.env.PORT = process.env.PORT || 3000;
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
    urlDB = 'mongodb+srv://rossa42:0p5wh1LVJaGrOBVp@clusterudemy-2ujvh.mongodb.net/test?retryWrites=true&w=majority';
}
urlDB = 'mongodb+srv://rossa42:0p5wh1LVJaGrOBVp@clusterudemy-2ujvh.mongodb.net/cafe?retryWrites=true&w=majority';


process.env.URLDB = urlDB;