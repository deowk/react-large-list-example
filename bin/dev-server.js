import path from 'path';
import express from 'express';
import webpack from 'webpack';
import http from 'http';
import fs from 'fs';
import request from 'request';
var ROOT_PATH = path.resolve(__dirname, '..');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// check if there is a app.config.custom file - if not then create one
if (fs.existsSync(ROOT_PATH + '/etc/app.config.custom.js')) {
    console.log('custom config present, skipping creation');
} else {
    console.log('created new custom config file');
    fs.closeSync(fs.openSync(ROOT_PATH + '/etc/app.config.custom.js', 'w'));
}

const config = require('../etc/webpack.config.babel').default;

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function (req, res) {
    request(config.output.publicPath + 'index.html')
    .pipe(res);
});

console.log('Using app.config.' + process.env.NODE_ENV + '.js');
var httpServer = http.createServer(app);
httpServer.listen(3001);
console.log('Listening at http://0.0.0.0:3001');
