var MetalSmith         = require('metalsmith'),
    ignore             = require('metalsmith-ignore'),
    collection         = require('metalsmith-collections'),
    templates          = require('metalsmith-templates'),
    sass               = require('metalsmith-sass'),
    autoprefixer       = require('metalsmith-autoprefixer'),
    _                  = require('lodash');

var dest               = './build';

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
  .build();
