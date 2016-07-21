var config = {
    entry: './src/index.js',               // entry point
    output: {                     // output folder
        path: './dist',           // folder path
        filename: 'my-app.js'     // file name
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './'
    },
}
module.exports = config;