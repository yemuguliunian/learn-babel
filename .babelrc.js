module.exports = {
    plugins: [
        ['./plugins/babel-plugin-taro-ui-import', {}],
        [
            './plugins/babel-plugin-remove-console',
            {
                ignore: ['warn'],
            },
        ],
    ],
};
