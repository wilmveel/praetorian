var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");

var compiler = webpack(require('./webpack.config'));
app.use(webpackDevMiddleware(compiler, {} ));

app.use(express.static('assets'));
app.use(express.static('components'));
app.use(express.static('bower_components'));

var proxy = require('express-http-proxy');

app.use('/web3', function(req, res, next){

    proxy('128.199.53.68:8545', {
        forwardPath: function(req, res) {
            return require('url').parse(req.url).path;
        }
    })(req, res, next)

});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
