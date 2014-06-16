(function (global) {
  var $ = global.jQuery;
  var Mustache = global.Mustache;

  $(function () {
    var data = $('#data').data('template-data');

    function parseValues (vals, render) {
      return {
        one: parseFloat(render(vals[0])),
        two: parseFloat(render(vals[1]))
      }
    }

    data.add = function () {
      return function (text, render) {
        var vals = parseValues(text.split('+'), render);

        return vals.one + vals.two;
      }
    }

    data.minus = function () {
      return function (text, render) {
        var vals = parseValues(text.split('-'), render);

        return vals.one - vals.two;
      }
    }

    data.multiply = function () {
      return function (text, render) {
        var vals = parseValues(text.split('*'), render);

        return vals.one * vals.two;
      }
    }

    data.divide = function () {
      return function (text, render) {
        var vals = parseValues(text.split('/'), render);

        return vals.one / vals.two;
      }
    }

    data.toJSON = function () {
      return function (text, render) {
        return JSON.stringify(this[text]);
      }
    }

    function writeTemplate (doc, template, data) {
      var compiledTemplate = Mustache.render(template, data);
      doc.open();
      doc.write(compiledTemplate);
      doc.close();
    }

    $.each($('.preview-frame'), function(_i, preview) {
      var xmlUrl = $(preview).data('xml-url');
      var xml = $.ajax({ url: xmlUrl, dataType: 'text/plain' });
      var doc = $(preview).contents()[0];

      xml.then(function (response) {
        writeTemplate(doc, response, data);
      }, function(response) {
        if (response.status === 200) {
          writeTemplate(doc, response.responseText, data);
        }
      });
    });
  });
})(window || this);
