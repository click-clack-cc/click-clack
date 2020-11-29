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
      "no-tabs": ["error", { allowIndentationTabs: true }],
      "indent": ["error", "tab"],
      "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
      "vue/require-prop-types": "off",
      "vue/no-v-html": "off",
      "quotes": [2, "single", { "avoidEscape": true }],
						"vue/comment-directive": 0
    }
}
