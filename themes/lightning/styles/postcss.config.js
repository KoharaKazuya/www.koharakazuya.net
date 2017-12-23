module.exports = {
  plugins: [
    require('postcss-import')(),
    require('autoprefixer')(),
    require('cssnano')(),
    process.env.HASH_FILENAME === 'true' && require('postcss-hash')()
  ]
};
