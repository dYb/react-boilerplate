var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var open = require('gulp-open');
var sass = require('gulp-ruby-sass');
var gulpif = require('gulp-if');
var cssmin = require('gulp-cssmin');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var htmlreplace = require('gulp-html-replace');
var babelify = require('babelify');
var autoprefixer = require('gulp-autoprefixer');
// var sftp = require('gulp-sftp');
require("babelify/polyfill");

var port = process.env.port || 3000;
var now = new Date();
var month = now.getMonth() + 1
if(month < 10){
  month = '0' + month
}
var version = now.getFullYear() + '' + month + now.getDate() + '-' + now.getHours() + '' + now.getMinutes() + '-' + now.getSeconds()
var prefix =  'http://img' + (Math.floor(Math.random() * 6) + 1) + '.cache.netease.com/utf8/3g/headline_game/'

var sassTask = function(options){
  return sass('./app/scss/style.scss')
    .on('error', sass.logError)
    .pipe(autoprefixer({
        browsers: ['last 2 versions', 'Android >= 4.0'],
        cascade: false
    }))
    .pipe(gulpif(!options.development, streamify(cssmin())))
    .pipe(gulp.dest(options.dest));
}
var browserifyVendor = function(options){
  return browserify({debug: options.development})
    .require("babelify/polyfill")
    .require('react')
    .require('react-dom')
    .require('react-router')
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(gulpif(!options.development, streamify(uglify())))
    .pipe(gulp.dest(options.dest));
}
var browserifyTask = function(options){
  return browserify({
    entries: ['./app/js/app.js'], // Only need initial file, browserify finds the rest
    debug: options.development, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
  })
  .transform(babelify)
  .external(['react', 'react-router', 'react-dom'])
  .bundle()
  .on('error', console.log)
  .pipe(source('app.js'))
  .pipe(gulpif(!options.development, streamify(uglify())))
  .pipe(gulp.dest(options.dest));
}
gulp.task('sass', function() {
  sassTask({development: true, dest: './.tmp'})
});
gulp.task('browserify', function() {
  browserifyTask({
    development: true,
    dest: '.tmp'
  })
  browserifyVendor({
    development: true,
    dest: '.tmp'
  })
});

gulp.task('connect', function() {
  connect.server({
    root: ['app', '.tmp'],
    port: port,
    livereload: true
  });
});

gulp.task('open', function(){
  var options = {
    url: 'http://localhost:' + port,
  };
  gulp.src('./app/index.html').pipe(open('', options));
});

gulp.task('html', function () {
  gulp.src('./app/*.html').pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('./.tmp/**/*.js').pipe(connect.reload());
});

gulp.task('css', function () {
  gulp.src('./.tmp/**/*.css').pipe(connect.reload());
});

gulp.task('fonts', function(){
  gulp.src('./app/fonts/*.*').pipe(gulp.dest('./dist/fonts'))
})

gulp.task('watch', function() {
  gulp.watch('./app/index.html', ['html']);
  gulp.watch('./.tmp/**/*.js', ['js']);
  gulp.watch('./.tmp/**/*.css', ['css']);
  gulp.watch('./app/**/*.scss', ['sass']);
  gulp.watch('./app/**/*.js', ['browserify']);
});
gulp.task('clean', function(){
  return gulp.src('./dist', {read: false})
    .pipe(clean({force: true}));
})
gulp.task('default', ['browserify', 'sass']);
gulp.task('serve', ['browserify', 'sass', 'connect', 'open', 'watch']);
gulp.task('deploy', ['clean', 'fonts'], function(){
  process.env.NODE_ENV = 'production'
  browserifyTask({
    development: false,
    dest: './dist/' + version
  })
  browserifyVendor({
    development: false,
    dest: './dist/'
  })
  sassTask({
    development: false,
    dest: './dist/' + version
  })
  return gulp.src('./app/index.html')
    .pipe(htmlreplace({
      'css': prefix + version + '/style.css',
      'js': prefix + version + '/app.js',
      'vendor': prefix + 'lib/vendor-1.js'
    }))
    .pipe(gulp.dest('./dist/'))
})
gulp.task('test', ['clean'], function(){
  process.env.NODE_ENV = 'production'
  browserifyTask({
    development: true,
    dest: './dist/scripts'
  })
  browserifyVendor({
    development: true,
    dest: './dist/lib'
  })
  sassTask({
    development: true,
    dest: './dist/styles'
  })
  var prefix = 'http://f2e.developer.163.com/ybduan/game'
  return gulp.src('./app/index.html')
    .pipe(htmlreplace({
      'css': prefix + '/styles/style.css',
      'js': prefix + '/scripts/app.js',
      'vendor': prefix + '/lib/vendor.js'
    }))
    .pipe(gulp.dest('./dist/'))
})
// scp -r -P 16322 dist/* ybduan@223.252.197.245:/home/ybduan/game/




