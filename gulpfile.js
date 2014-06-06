var gulp               = require('gulp'),
    gutil              = require('gulp-util'),
    ejs                = require('gulp-ejs'),
    shell              = require('gulp-shell'),
    livereload         = require('gulp-livereload'),
    awspublish         = require('gulp-awspublish'),
    express            = require('express'),
    app                = express(),
    argv               = require('yargs').argv;

var dest               = './build';
var env                = argv.type || 'development';
var base = {
  production: 'http://red-hat-assets.s3.amazonaws.com',
  development: 'http://localhost:4000'
}

gulp.task('smith', shell.task('node smith'));

gulp.task('build', ['smith'], function () {
  return gulp.src('./build/templates/**/*.html', { base: './build/templates' })
    .pipe(ejs({ baseUrl: base[env] }).on('error', gutil.log))
    .pipe(gulp.dest(dest + '/templates'));
});

gulp.task('watch', function() {
  var server = livereload();

  var reload = function(file) {
    server.changed(file.path);
  };

  gulp.watch('./src/**/*.*', ['build']);
  gulp.watch('./build/**/*.*').on('change', reload);
});

gulp.task('serve', ['build', 'watch'], function () {
  return app
    .use(express.static(dest))
    .listen(4000, function () {
      console.log('Express Server listening on 4000');
    });
});

gulp.task('publish', ['build'], function () {
  var publisher = awspublish.create({
    key: process.env.RH_AWS_KEY,
    secret: process.env.RH_AWS_SECRET,
    bucket: 'red-hat-assets',
    region: 'ap-southeast-2'
  });

  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src('./build/**/*')
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('default', ['serve']);

// If you are experiencing issues with Gulp server shutting down, try this... `gulp setUlimit`
gulp.task('setUlimit', shell.task('ulimit -n 8192'));
