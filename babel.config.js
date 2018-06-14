module.exports = {
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', {
      targets: { browsers: ['> 2%'] },
      useBuiltIns: 'usage',
    }],
    '@babel/preset-flow',
  ],

  plugins: ['@babel/plugin-proposal-class-properties'],
};
