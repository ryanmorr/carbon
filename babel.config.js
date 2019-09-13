module.exports = (api) => {
    api.cache(true);

    const presets = [
        ["@babel/preset-env", {
            modules: false
        }]
    ];

    const plugins = [
        ['@babel/plugin-transform-react-jsx', {
            pragma: 'h'
        }]
    ];

    return {
        presets,
        plugins,
    };
};
