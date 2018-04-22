module.exports = {
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', { targets: { browser: ['> 1%'] } }],
    '@babel/preset-flow',
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
};
