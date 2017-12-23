const { FuseBox, QuantumPlugin, Sparky } = require('fuse-box');

let fuse;
let app;
let production = true;

Sparky.task('default', ['build'], () => {});

Sparky.task('watch', async () => {
  production = false;
  await Sparky.start('config');
  app.watch();
  fuse.run();
});

Sparky.task('build', ['config'], () => fuse.run());

Sparky.task('config', () => {
  fuse = FuseBox.init({
    homeDir: 'src',
    output: '../static/$name-$hash.js',
    target: 'browser@es5',
    sourceMaps: !production,
    hash: production,
    tsConfig: 'tsconfig.json',
    plugins: [
      production &&
        QuantumPlugin({
          bakeApiIntoBundle: 'app',
          treeshake: true,
          uglify: true
        })
    ]
  });

  app = fuse.bundle('app').instructions('> app.ts');
});
