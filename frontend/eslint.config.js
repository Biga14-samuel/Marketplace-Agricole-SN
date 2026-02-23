import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        // Vue globals
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
      }
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
    ignores: [
      'dist/**',
      'node_modules/**',
      '.venv/**',
      '**/*.d.ts',
      '**/*.vue',
      '**/*.ts',
      '**/*.tsx'
    ]
  },
  // Node.js files (CommonJS)
  {
    files: ['**/*.cjs', '**/*.js', 'scripts/**/*.js', 'check-*.js', 'check-*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        console: 'readonly',
      }
    },
    rules: {
      'no-console': 'off', // Allow console in Node.js scripts
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    }
  },
  // Config files that use ES modules
  {
    files: ['eslint.config.js', 'tailwind.config.js', 'postcss.config.js', 'vite.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    }
  }
];