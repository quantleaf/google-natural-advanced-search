const path = require('path')
module.exports = {
    devtool: 'inline-source-map',
    entry: {
        inject: path.resolve(__dirname, 'src', 'inject.ts'),
        advancedSearchChema: path.resolve(__dirname, 'src', 'advanced-search-schema.ts'),
        background: path.resolve(__dirname, 'src', 'background.ts')
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules')

        ],
        extensions: ['.js', '.ts']
    },
}