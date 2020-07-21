const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

//Middlewares
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiRoute = require('./routes/api/apiAccess.js');
app.use('/api/data', apiRoute);

//Handle Production env
if(process.env.NODE_ENV === 'production') {
    //Static folder
    app.use(express.static(__dirname + '/public/'));
    //Handle 404 errors
    app.get(/.*/, function (req, res){
      res.status(404).sendFile(__dirname + '/public/pagenotfound.html');
    });
}

app.get(/.*/, (req, res) => {
    res.status(404).send("what???");
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})