const path = require('path')

module.exports = {
    entry: {
        svgSpriteViewer: './src/view/app/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: '[name].js',
    },
    devtool: 'eval-source-map',
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        modules: ['node_modules', path.resolve(__dirname, './src/view/app')],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                options: {},
            },
            {
                test: /\.(svg)$/,
                type: 'asset/inline',
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
        ],
    },
    performance: {
        hints: false,
    },
}
