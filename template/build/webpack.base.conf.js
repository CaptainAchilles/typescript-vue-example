var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var env = process.env.NODE_ENV
    // check env & config/index.js to decide weither to enable CSS Sourcemaps for the
    // various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd
var extractCSS = new ExtractTextPlugin('[name].css');

module.exports = {
    entry: {
        app: './src/main.ts'
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: './[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.ts', '.tsx', '.css', '.scss'],
        //fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components')
        },
        modules: ["node_modules", "lib", "style"]
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: extractCSS.extract({
                    use: ['css-loader'],
                    fallback: 'style-loader'
                })
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    esModule: true,
                    loaders: {
                        css: extractCSS.extract({
                            use: 'css-loader',
                            fallback: 'vue-style-loader'
                        })
                    },
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 2 versions']
                        })
                    ]
                }
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/] },
                include: [path.resolve(__dirname, "../"), path.resolve(__dirname, "../typings/modules")],
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }

        ]
    },
    plugins: [
        extractCSS
    ]
}
