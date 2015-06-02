var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var open = require('gulp-open');
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var cssmin = require('gulp-cssmin');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var htmlreplace = require('gulp-html-replace');
// var sftp = require('gulp-sftp');

var port = process.env.port || 3000;
var now = new Date();
var month = now.getMonth() + 1
if(month < 10){
    month = '0' + month
}
var version = now.getFullYear() + month + now.getDate() + '-' + now.getHours() + '' + now.getMinutes() + '-' + now.getSeconds()
var prefix =  'http://img1.cache.netease.com/utf8/3g/light/' + version + '/'

var sassTask = function(options){
    var s = sass();
    s.on('error', function(e){
        console.log(e)
        s.end()
    })
    return gulp.src('./app/src/scss/**/*.scss')
        .pipe(s)
        .pipe(gulpif(!options.development, streamify(cssmin())))
        .pipe(gulp.dest(options.dest));
}
var browserifyTask = function(options){
    return browserify({
        entries: ['./app/src/js/app.js'], // Only need initial file, browserify finds the rest
        debug: options.development, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
    })
    .transform('reactify', { 'es6': true })
    .bundle()
    .on('error', console.log)
    .pipe(source('app.js'))
    .pipe(gulpif(!options.development, streamify(uglify())))
    .pipe(gulp.dest(options.dest));
}
gulp.task('sass', function() {
    sassTask({development: true, dest: './tmp'})
});
gulp.task('browserify', function() {
    browserifyTask({
        development: true,
        dest: './tmp'
    })
});

gulp.task('connect', function() {
    connect.server({
        root: ['app', 'tmp'],
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
    gulp.src('./tmp/**/*.js').pipe(connect.reload());
});

gulp.task('css', function () {
    gulp.src('./tmp/**/*.css').pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch('./app/index.html', ['html']);
    gulp.watch('./tmp/**/*.js', ['js']);
    gulp.watch('./tmp/**/*.css', ['css']);
    gulp.watch('./app/src/**/*.scss', ['sass']);
    gulp.watch('./app/src/**/*.js', ['browserify']);
});
gulp.task('clean', function(){
    return gulp.src('./dist', {read: false})
        .pipe(clean({force: true}));
})
gulp.task('default', ['browserify', 'sass']);
gulp.task('serve', ['browserify', 'sass', 'connect', 'open', 'watch']);
gulp.task('deploy', ['clean'], function(){
    
    browserifyTask({
        development: false,
        dest: './dist' + version
    })
    sassTask({
        development: false,
        dest: './dist' + version
    })
    gulp.src('./app/index.html')
        .pipe(htmlreplace({
            'css': 'styles.min.css',
            'js': 'js/bundle.min.js'
        }))
        .pipe(gulp.dest('./dist/' + version))
})

// gulp.task('test', function(){
//     return gulp.src('dist/*')
//         .pipe(sftp({
//             host: '61.135.251.132',
//             port: 16321,
//             remotePath: '/utf8/3g/touch/dyb',
//             auth: 'keyMain'
//         }))
// })





