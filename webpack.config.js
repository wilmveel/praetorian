module.exports = {
    entry: './src/index.js',
    output: {
        path: '/'
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json' },
            { test: /\.sol$/, loader: 'raw' }
        ]
    }
};