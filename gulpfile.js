var gulp               = require('gulp'),
    gulpFilter         = require('gulp-filter'),
    gutil              = require('gulp-util'),
    debug              = require('gulp-debug'),
    deployS3           = require('gulp-awspublish'),
    ejs                = require('gulp-ejs'),
    livereload         = require('gulp-livereload'),
    express            = require('express'),
    app                = express(),
    deploy             = require("gulp-gh-pages");

var es                 = require('event-stream');

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
  productionS3: 'http://red-hat-assets.s3.amazonaws.com',
  production: 'http://redhatbrand.github.io/RedHatTemplates',
  development: ''
};

handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

function url(){
  return function addUrl(files, metalsmith, done){
    for (var file in files) {
      files[file].url = file;
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
          var name = possibleSiblingPath.pop();

          if ((file !== possibleSibling) &&
              _.isEqual(path, possibleSiblingPath)) {

            siblings.push(files[possibleSibling]);
          }
        }

        files[file].siblings = siblings;
      })(file, files);
    }
    done();
  };
}

function previewIndexes () {
  return function previewIndexes(files, metalsmith, done){
    for (var file in files) {
      (function (file, files) {
        if ((file.split('/').pop() === 'index.html') && !(files[file].hasOwnProperty('template'))) {
          files[file].template = 'preview.hbt';
        }
      })(file, files);
    }

    done();
  };
}


gulp.task('smith', function () {
  var defered = q.defer();

  MetalSmith(__dirname)
    .use(ignore(['**/_*.scss', '**/.**.**.swp', '**/.DS*']))
    .use(previewIndexes())
    .use(url())
    .use(tree())
    .use(collection({
      templates: 'templates/**/index.html'
    }))
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
      return defered.resolve.apply(defered, arguments);
    });

  return defered.promise;
});

gulp.task('build-tmp', ['smith'], function () {
  var xmlFilter = gulpFilter(['**/*.html', '**/*.svg']);

  return gulp.src(tmp + '/**/*', { base: tmp })
    .pipe(xmlFilter)
    .pipe(ejs({ 
        baseUrl: base.development, 
        version: Date.now(),
        color: 'hsl(0, 100%, 30%)'
      })
      .on('error', gutil.log))
    .pipe(xmlFilter.restore())
    .pipe(gulp.dest(tmp));
});

gulp.task('build-s3', ['smith'], function () {
  var xmlFilter = gulpFilter(['**/*.html', '**/*.svg']);

  return gulp.src(tmp + '/**/*', { base: tmp })
    .pipe(xmlFilter)
    .pipe(ejs({ 
        baseUrl: base.productionS3, 
        version: Date.now(),
        color: 'hsl(0, 100%, 30%)'
      })
      .on('error', gutil.log))
    .pipe(xmlFilter.restore())
    .pipe(gulp.dest(prod));
});

gulp.task('watch', ['build-tmp'], function() {
  gulp.watch('./src/**/*.*', ['build-tmp']);
});

gulp.task('serve', ['watch'], function () {
  return app
    .use(express.static(tmp))
    .listen(4000, function () {
      console.log('Express Server listening on 4000');
    });
});

gulp.task('publish-s3', function () {
  var publisher = deployS3.create({
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
    .pipe(deployS3.reporter());
});

gulp.task('ejs', ['smith'], function () {
  var xmlFilter = gulpFilter(['**/*.html', '**/*.svg']);

  return gulp.src(tmp + '/**/*', { base: './.tmp' })
    .pipe(xmlFilter)
    .pipe(ejs({ 
        baseUrl: base.production, 
        version: Date.now(),
        color: 'hsl(0, 100%, 30%)'
      })
      .on('error', gutil.log))
    .pipe(xmlFilter.restore())
    .pipe(gulp.dest(tmp));
});

gulp.task('build', ['ejs'], function () {
  return gulp.src(tmp + '/**/*', { base: tmp })
    .pipe(gulp.dest(prod));
});

gulp.task('deploy', function () {
  return gulp.src(prod + '/**/*.*')
    .pipe(deploy());
});

gulp.task('default', ['serve']);

gulp.task('shapes', function () {
  var colors = [
    { name: 'red', value: 'hsl(0, 100%, 30%)' },
    { name: 'yellow', value: 'hsl(42, 100%, 54%)' },
    { name: 'blue', value: 'hsl(206, 68%, 59%)' },
    { name: 'blue-mid', value: 'hsl(206, 54%, 39%)' },
    { name: 'green', value: 'hsl(79, 100%, 42%)' },
    { name: 'green-mid', value: 'hsl(79, 100%, 38%)' },
    { name: 'green-dark', value: 'hsl(79, 100%, 24%)' },
    { name: 'grey', value: 'hsl(0, 0%, 30%)' },
    { name: 'grey-light', value: 'hsl(0, 0%, 69%)' },
    { name: 'navy', value: 'hsl(201, 100%, 14%)' }
  ];
  var streams = [];

  colors.forEach(function (color) {
    var colorStream = gulp.src('src/global-assets/images/shapes/*.svg')
      .pipe(ejs({ color: color.value }, { ext: '.svg' }))
      .pipe(gulp.dest('src/global-assets/images/shapes/' + color.name));

    streams.push(colorStream);
  });

  return es.merge.apply(null, streams);
});
