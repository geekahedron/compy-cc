var config = require('./config.json');

var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongoClient = require("mongodb").MongoClient;
mongoClient.connect(`mongodb://${config.mongoDBUser}:${config.mongoDBKey}@${config.mongoDBEndpoint}.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=${config.mongoDBAppName}`, { useUnifiedTopology: true })
    .catch((err, client) => {
        client.close();
    });

var app = express();

app.engine('hbs',
    exphbs.create({
        defaultLayout: 'main',
        extname: '.hbs',
        partialsDir: ['views/partials/']
    }).engine);
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
