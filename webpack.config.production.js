const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
 //   CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = {
    mode: 'production',
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
   /* plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
        ,new webpack.optimize.AggressiveMergingPlugin()
    ]*/
    plugins: [
        // clean the build folder
        new CleanWebpackPlugin(),
        // expose and write the allowed env vars on the compiled bundle
        new webpack.EnvironmentPlugin(["NODE_ENV"]),
   /*     new CopyWebpackPlugin([{
          patterns: [
              {
                from: "manifest.json",
              }
          ],
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(JSON.stringify({
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString())
            }))
          }
        }]),*/
        new HtmlWebpackPlugin({
          template: path.join(__dirname, "src", "popup.html"),
          filename: "popup.html",
          chunks: ["popup"]
        }),
        new HtmlWebpackPlugin({
          template: path.join(__dirname, "src", "help.html"),
          filename: "options.html",
          chunks: ["options"]
        }),
        new HtmlWebpackPlugin({
          template: path.join(__dirname, "src", "background.html"),
          filename: "background.html",
          chunks: ["background"]
        }),
        new WriteFilePlugin()
      ]
}