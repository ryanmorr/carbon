const babel = require('@rollup/plugin-babel');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const specs = 'test/specs/index.js';

module.exports = function(config) {
    config.set({
        basePath: __dirname,
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [specs],
        preprocessors: {
            [specs]: ['rollup']
        },
        rollupPreprocessor: {
            output: {
                format: 'esm',
                sourcemap: 'inline'
            },
            plugins: [
                resolve(),
                babel({
                    babelHelpers: 'bundled',
                    exclude: 'node_modules/**',
                    presets: ['@babel/preset-env'],
                    plugins: [
                        ['@babel/plugin-transform-react-jsx', {
                            pragma: 'h'
                        }]
                    ]
                }),
                commonjs()
            ]
        },
        reporters: ['mocha'],
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        singleRun: true
    });
}