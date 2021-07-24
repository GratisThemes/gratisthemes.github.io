const gulp       = require('gulp')
const plumber    = require('gulp-plumber')
const sass       = require('gulp-sass')(require('sass'))
const prefix     = require('gulp-autoprefixer')
const handlebars = require('gulp-compile-handlebars')
const rename     = require('gulp-rename')
const liveServer = require("live-server")

const pkg = require('./package.json')

const options = {
  batch: [
    './src/html/partials'
  ]
}

function html() {
  return gulp.src('./src/html/pages/**/*.html')
    .pipe(plumber())
    .pipe(handlebars(
      {
        version: pkg.version
      },
      {
        batch: [
          './src/html/partials'
        ],
        helpers: {
          isEqual: function(a, b, opts) {
            return (a == b) ? opts.fn(this) : opts.inverse(this)
          },
          listItems: function(...items) {
            const options = items.pop()
            return items
          }
        }
      }
    ))
    .pipe(rename(function(path) {
      if ( path.basename !== 'index' ) {
        path.dirname += `/${path.basename}`
        path.basename = 'index'
      }
    }))
    .pipe(gulp.dest('./docs'))
}

function css() {
  return gulp.src('./src/scss/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded', includePaths: ['scss'] }).on('error', sass.logError))
    .pipe(prefix(['last 30 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('./docs'))
}

function static() {
  return gulp.src('./src/static/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('./docs'))
}

function serve(done) {
  liveServer.start({
    root: './docs',
    open: false,
  })
  done()
}

function watch() {
  gulp.watch('src/html/**/*',      {cwd: './', usePolling: true}, html)
  gulp.watch('src/scss/**/*.scss', {cwd: './', usePolling: true}, css)
  gulp.watch('src/static/**/*',    {cwd: './', usePolling: true}, static)
}

module.exports.html   = html
module.exports.css    = css
module.exports.static = static
module.exports.dev    = gulp.series(html, css, static, serve, watch)
module.exports.build  = gulp.series(html, css, static, watch)