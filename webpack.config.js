module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
  output: {
    path: __dirname + '/extension/js',
    filename: 'bundle.js'
  }
};
