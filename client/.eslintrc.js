module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        '@nuxtjs',
        'plugin:nuxt/recommended'
    ],
    rules: {
        "template-curly-spacing": "off",
        "indent": 0,
        "no-tabs": 0,
        "vue/html-indent": 0
    }
}
