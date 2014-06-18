var gulp               = require('gulp'),
    gutil              = require('gulp-util'),
    debug              = require('gulp-debug'),
    deploy             = require('gulp-awspublish'),
    ejs                = require('gulp-ejs'),
    livereload         = require('gulp-livereload'),
    express            = require('express'),
    argv               = require('yargs').argv,
    app                = express();

var MetalSmith         = require('metalsmith'),
    autoprefixer       = require('metalsmith-autoprefixer'),
    collection         = require('metalsmith-collections'),
    handlebars         = require('handlebars'),
    ignore             = require('metalsmith-ignore'),
    sass               = require('metalsmith-sass'),
    templates          = require('metalsmith-templates'),
    q                  = require('q'),
    _                  = require('lodash');

var tmp                = './.tmp';
var prod               = './build';
var base = {
  production: 'http://red-hat-assets.s3.amazonaws.com',
  development: ''
}

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
    .use(sass({
      outputStyle: "expanded"
    }))
    .use(autoprefixer())
    .use(templates({
      engine: 'handlebars',
      directory: 'layouts'
    }))
    .destination(tmp)
    .build(function () {
      return defered.resolve.call(defered, arguments);
    });

  return defered.promise;
});

gulp.task('replace-urls', ['smith'], function () {
  return gulp.src(tmp + '/templates/**/*.html', { base: './.tmp/templates' })
      .pipe(ejs({ baseUrl: base['development'] }).on('error', gutil.log))
      .pipe(gulp.dest(tmp + '/templates'));
});

gulp.task('replace-urls-production', ['smith'], function () {
  return gulp.src(tmp + '/templates/**/*.html', { base: './.tmp/templates' })
      .pipe(ejs({ baseUrl: base['production'] }).on('error', gutil.log))
      .pipe(gulp.dest(tmp + '/templates'));
});

gulp.task('build', ['replace-urls'], function () {
  return gulp.src(tmp + '/**/*', { base: './.tmp' })
    .pipe(gulp.dest(tmp + '/templates'));
});

gulp.task('build-production', ['replace-urls-production'], function () {
  return gulp.src(tmp + '/**/*', { base: './.tmp' })
    .pipe(gulp.dest(prod));
});

gulp.task('watch', function() {
  var server = livereload();

  var reload = function(file) {
    server.changed(file.path);
  };

  gulp.watch('./src/**/*.*', ['build']);
  gulp.watch(tmp + '/**/*.*').on('change', reload);
});

gulp.task('serve', ['build', 'watch'], function () {
  return app
    .use(express.static(tmp))
    .listen(4000, function () {
      console.log('Express Server listening on 4000');
    });
});

gulp.task('publish', ['build-production'], function () {
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