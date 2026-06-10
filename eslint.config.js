import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  {
    files: ['**/*.{js,vue}'],

    languageOptions: {
      parser: vueParser,

      ecmaVersion: 'latest',

      sourceType: 'module',

      globals: globals.browser,
    },

    plugins: {
      vue: pluginVue,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...pluginVue.configs['flat/recommended'].rules,

      'no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
]
