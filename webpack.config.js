const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const config = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/index.js'
    ],
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    // 在使用react-hot-loader3.x的版本时, 需要在后面加上webpack,否则无法加载
                    'react-hot-loader/webpack',
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'

                })
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.css'],
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    devServer: {
        contentBase: './dist',
        historyApiFallback: true
    }

}
if (process.env.NODE_ENV === 'production') {
    config.devtool = "cheap-module-source-map"
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
        new ExtractTextPlugin({
            filename: 'bundle.css',
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 1,
            moveToParents: true

        })
    )

} else {
    config.devtool = "cheap-module-eval-source-map"
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
        new ExtractTextPlugin({ disable: true })
    )
}

module.exports = config