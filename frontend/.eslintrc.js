module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    // Add these when plugins are installed:
    // '@typescript-eslint/recommended',
    // 'plugin:vue/vue3-essential',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // parser: '@typescript-eslint/parser', // Enable when plugin installed
  },
  // plugins: ['@typescript-eslint', 'vue'], // Enable when plugins installed
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    // TypeScript and Vue specific rules can be added here
  },
  ignorePatterns: [
    'dist', 
    'node_modules', 
    '.venv',
    '*.d.ts',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js'
  ],
  // Override for TypeScript files
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off', // TypeScript handles this
      }
    },
    {
      files: ['*.vue'],
      rules: {
        'no-undef': 'off', // Vue handles this
      }
    }
  ]
};