'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import notify from 'gulp-notify';
import browserSync from 'browser-sync';

// browserify
import browserify from 'browserify';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import babelify from 'babelify';

const reload = browserSync.reload;

gulp.task('less', () => {
  gulp.src('src/less/index.less')
    .pipe(less())
    .pipe(autoprefixer({
        browsers: ['last 3 versions','Explorer >= 8', 'Chrome >= 21', 'Firefox >= 1', 'Edge 13']
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'less task complete'}));
})

gulp.task('babel',() => {
  gulp.src('src/index.js')
    .pipe(babel())
    .pipe(gulp.dest('build/js'))
    .pipe(notify({ message: 'babel task complete' }));
})

gulp.task('js-watch', ['babel'], browserSync.reload);

// The static server
gulp.task('serve', ['less','babel'], () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch('src/less/index.less', ['less']);
    gulp.watch("src/*.js", ['js-watch']);
});

// set browserify task
gulp.task('browserify',()=> {
    browserify({
        entries: ['src/js/main.js','src/js/foo.js'],
        debug: true,
    })
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/js'))
        .pipe(notify({ message: 'browserify task complete' }));
})

gulp.task('default', ['less','babel','serve','browserify']);

gulp.task('watch', () => {
  gulp.watch('src/less/index.less',['less']);
  gulp.watch('src/index.js', ['babel']);
  gulp.watch('src/js/*.js', ['browserify']);
})
