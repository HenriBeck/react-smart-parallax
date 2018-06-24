import babelConfig from './babel.config';

export default {
  files: [
    'src/*.test.js',
  ],
  require: [
    'raf/polyfill',
    '@babel/register',
    './tests/browser-env.js',
  ],

  babel: { testOptions: babelConfig },
};
