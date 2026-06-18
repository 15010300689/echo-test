const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = (env) => {
    return {
        mode: env,
        output: {
            pathinfo: true,
        },
        devtool: false,
        plugins: [
            new HtmlWebpackPlugin({
                title: 'module-demo'
            })
        ],
    }
}
