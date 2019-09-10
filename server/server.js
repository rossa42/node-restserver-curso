require('./config/config')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//habilitar carpta public
app.use(express.static(__dirname + '/public'));

//app.use(express.static(path.resolve(__dirname, '/public')));
console.log(path.resolve(__dirname + '/public'));
app.use(require('./routes/index'));


mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto`, process.env.PORT);
})