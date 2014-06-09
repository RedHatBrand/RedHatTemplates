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

var MetalSmith         = require('metalsmith'),
    ignore             = require('metalsmith-ignore'),
    collection         = require('metalsmith-collections'),
    templates          = require('metalsmith-templates'),
    sass               = require('metalsmith-sass'),
    autoprefixer       = require('metalsmith-autoprefixer'),
    _                  = require('lodash'),
    q                  = require('q');

var handlebars         = require('handlebars');

handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

function url(){
  return function addUrl(files, metalsmith, done){
    for (var file in files) {
      files[file].url = '/' + file;
    }
    done();
  };
}

function tree() {
  return function tree(files, metalsmith, done){
    for (var file in files) {
      (function () {
        var path = file.split('/');
        var siblings = [];
        path.pop();

        for (var possibleSibling in files) {
          var possibleSiblingPath = possibleSibling.split('/');
          possibleSiblingPath.pop();

          if ((file !== possibleSibling) && _.isEqual(path, possibleSiblingPath)) {
            siblings.push(files[possibleSibling]);
          }
        }

        return files[file].siblings = siblings;
      })(file, files);
    }
    done();
  }
}


gulp.task('smith', function () {
  var defered = q.defer();

  MetalSmith(__dirname)
    .use(url())
    .use(tree())
    .use(collection({
      templates: 'templates/**/index.html'
    }))
    .use(ignore('**/_*.scss'))
    .use(sass())
    .use(autoprefixer())
    .use(templates({
      engine: 'handlebars',
      directory: 'layouts'
    }))
    .destination(dest)
    .build(function () {
      return defered.resolve.call(defered, arguments);
    });

  return defered.promise;
});

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
