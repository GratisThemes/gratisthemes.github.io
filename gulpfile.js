const gulp = require('gulp')
const plumber = require('gulp-plumber')
const jade = require('gulp-jade')
const sass = require('gulp-sass')
const prefix = require('gulp-autoprefixer')
const webserver = require('gulp-webserver')
const wait = require('gulp-wait')

gulp.task('jade', () => {
  gulp.src('./source/jade/**/!(_)*.jade')
    .pipe(plumber())
    .pipe(jade({
      locals: {},
      pretty: true
    }))
    .pipe(gulp.dest('docs'))
})

gulp.task('sass', () => {
  gulp.src('./source/scss/**/*.scss')
    .pipe(plumber())
    .pipe(wait(500))
    .pipe(sass({ outputStyle: 'expanded', includePaths: ['scss'] }))
    .pipe(prefix(['last 30 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('docs'))
})



gulp.task('other', () => {
  gulp.src([
    './source/**/*.*',
    '!./source/jade/**/*.*', 
    '!./source/scss/**/*.*'
  ])
    .pipe(plumber())
    .pipe(gulp.dest('docs'))
})

gulp.task('webserver', () => {
  gulp.src('./docs')
    .pipe(plumber())
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }))
})

gulp.task('watch', () => {
  gulp.watch('./source/jade/**/*.*', ['jade'])
  gulp.watch('./source/scss/**/*.*', ['sass'])
  gulp.watch([
    './source/**/*.*',
    '!./source/jade/**/*.*', 
    '!./source/scss/**/*.*'
  ], ['other'])
})

gulp.task('default', ['watch', 'jade', 'sass', 'other', 'webserver'])