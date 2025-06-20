    const webpack = require('webpack');

    module.exports = function override(config, env) {

        config.resolve.fallback = {
"http": require.resolve("stream-http"),
"https": require.resolve("https-browserify"),
"util": require.resolve("util/"),
"zlib": require.resolve("browserify-zlib"),
"stream": require.resolve("stream-browserify"),
"assert": require.resolve("assert/")
// Se você tiver outros módulos Node.js que dão erro, adicione aqui
// "url": require.resolve("url/"), // Removido pois 'url' pode causar outros problemas se não for essencial. O axios geralmente lida bem.
// "crypto": require.resolve("crypto-browserify"), // Idem, 'crypto' é mais problemático no navegador.
};

    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ]);

    // Retorna a configuração modificada
    return config;
};