import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactThree from "@react-three/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: { 
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    plugins: {
      js: pluginJs,
      typescript: tseslint,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-three': pluginReactThree,
    }
  },
];