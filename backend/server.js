const { default: axios } = require('axios');
const { authorize } = require('./middleware/authorize');
const {errorHandling} = require('./middleware/errorHandling');

const express = require('express'),
cookieParser = require('cookie-parser'),
log = require('morgan'),
path = require('path'),
cors = require('cors'),
multer = require('multer'),
    upload = multer(),
    app = express(),
    config = require('./config');
const PORT = config.PORT;
const NODE_ENV = config.env;


app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(cors());
app.use(log('tiny'));

// parse application/json
app.use(express.json());

// parse raw text
app.use(express.text());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// put static content here if you want to server it to the public
app.use('/login',express.static('public/login'));

// parse multipart/form-data
app.use(upload.any()); 
// app.use(express.static('public'));

app.use(cookieParser());
app.use(authorize);
app.use('/',express.static('public/the_rest'));

// put any static content here if you want to server it if requester has right

// app.use('/drugs',express.static('public'));
require('./routes')(app);

// catch 404
app.use((req, res, next) => {
    // log.(`Error 404 on ${req.url}.`);
    res.status(404).send({ status: 404, error: 'Not found' });
});

app.use(errorHandling);

// module.exports = app;
const server = app.listen(PORT, () => {
    console.log(
        `Express Server started on Port ${app.get(
            'port'
        )} | Environment : ${app.get('env')}`
    );
});
module.exports = server;




// let userID="1",password="123";
// let loginReq = {
//     method: 'post',
//     url: 'http://localhost:3000/login',
//     data: {username:userID,password:password},
//     responseType:'json'
// }
// axios(loginReq);
// axios(loginReq).then((data)=>(console.log("data")));
