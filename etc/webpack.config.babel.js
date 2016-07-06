import path from 'path';
import HtmlwebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import appConfig from './app.config';
var ROOT_PATH = path.resolve(__dirname, '..');

/**
 * Certain of the settings / attributes are overridden or extended depending on the environment requirements.
 *
 * Most attributes below are shared across all environments without modifications.
 */
var webpackConfig = {
    entry: ['babel-polyfill', path.resolve(ROOT_PATH, 'app/js')],
    output: {
        path: path.resolve(ROOT_PATH, 'dist'),
        filename: 'bundle.js',
        publicPath: appConfig.deployment.host + appConfig.deployment.base_path + '/'
    },
    node: {
        fs: 'empty'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(ROOT_PATH, 'app/'),
                    path.resolve(ROOT_PATH, 'etc/')
                ],
                exclude: /webpack\.config/i
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css?sourceMap', 'autoprefixer', 'resolve-url', 'sass?sourceMap=true&precision=0'],
                include: path.resolve(ROOT_PATH, 'app/')
            },
            {
                test: /\.html/, loader: 'raw'
            },

            {
                test: /\.json/, loader: 'json'
            },
            {
                test: /\.otf/, loader: 'file-loader'
            },
            {
                test: /\.ico$/, loader: 'file-loader?name=./favicon.ico'
            }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            hash: true,
            absolutePath: appConfig.deployment.host + appConfig.deployment.base_path + '/bundle.js',
            filename: 'index.html',
            template: path.resolve(ROOT_PATH, 'app/template.html')
        }),
        /*
        Note that since webpack -production runs uglify dead-code elimination,
        anything wrapped in one of these blocks will be stripped out
        */
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
        })
    ],
    externals: {
      /*
      Add external deps here
      */
    }
};

if (typeof(process.env.NODE_ENV) === 'undefined') process.env.NODE_ENV = 'development';

switch(process.env.NODE_ENV) {
    case 'production':
        webpackConfig.module.loaders[0].query.plugins.push(['transform-runtime']);

        webpackConfig.module.loaders.push({
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                'file-loader?hash=sha512&digest=hex&name=img/[name].[ext]',
                'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
        });

        webpackConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
        webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false } }));
        break;
    default:
        webpackConfig.entry.push('webpack-hot-middleware/client');
        webpackConfig.devtool = ['eval', 'eval-source-map'];

        webpackConfig.module.preLoaders =  [
          {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
        ];

        webpackConfig.eslint = {
            configFile: path.resolve(ROOT_PATH, '.eslintrc'),
            formatter: require('eslint-friendly-formatter')
        };

        webpackConfig.module.loaders.push({
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [ 'file-loader?hash=sha512&digest=hex&name=img/[name].[ext]' ]
        });

        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
        break;
}

export default webpackConfig;
