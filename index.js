var Metalsmith  = require("metalsmith");
var layouts     = require("metalsmith-layouts");
var permalinks  = require("metalsmith-permalinks");
var collections = require("metalsmith-collections");
var serve       = require("metalsmith-serve");
var watch       = require("metalsmith-watch");
var drafts      = require("metalsmith-drafts");
var dateFormat  = require("metalsmith-date-formatter");
var handlebars  = require("handlebars");
var moment      = require("moment");
var assets      = require("metalsmith-static");
var inPlace     = require("metalsmith-in-place");
var marked      = require("marked");
var _           = require("lodash");
var rootPath    = require('metalsmith-rootpath')

var templateConfig = {
  engineOptions: {
    root: "./",
    filters: {
    },
    extensions: {
    },
    globals: {
      marked: function() {
        var myMarked = marked;
        // Read file from rendered file for each layout;
        var renderedFilename = this.ctx.filename.replace(/\.(\w+)/, ".js");
        var myRendered = marked.Rendered;

        try {
          myRendered = require(renderedFilename);
          myRendered = _.assign(new marked.Renderer(), myRendered);
          myMarked.setOptions({
            renderer: myRendered
          })
        } catch(e) {
        }

        return myMarked;
      }
    }
  }
}

Metalsmith(__dirname)
  .metadata({
    title: "lexicoi | centered on improvement",
    description: "centered on improvement",
    generator: "Metalsmith",
    url: "http://www.lexicoi.org"
  })
  .use(dateFormat({ dates: "date" }))
  .source("./src")
  .destination("./build")
  .clean(false)
  .use(drafts())
  .use(inPlace(templateConfig))
  .use(permalinks())
  .use(layouts({
    engine: "nunjucks",
    directory: "./layouts",
  }))
  .use(assets({
    src: "assets",
    dest: "."
  }))
  .use(serve({
    port: 8000,
    host: "0.0.0.0",
    verbose: true
  }))
  .use(watch({
    livereload: true,
    paths: {
      "${source}/**/*": true,
      "layout/**/*": true
    }
  }))
  .build(function(err, files) {
    if (err) { console.log(files); throw err; }
  });
