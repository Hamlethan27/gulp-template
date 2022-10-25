


// Подключение модулей

import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import {deleteAsync} from 'del';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import babel from 'gulp-babel';

const sass = gulpSass(dartSass);


// Пути к файлам

const path = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}


// Функция для обработки стилей

const styles = () => {
    return gulp.src(path.styles.src)
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(rename({
        basename: 'main',
        suffix: '.min',
    }))
    .pipe(gulp.dest(path.styles.dest))
}


// Функция для обработки скриптов

const scripts = () => {
    return gulp.src(path.scripts.src, {
        sourcemaps: true
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(path.scripts.dest))
}


// Функция для очищения папки проекта

const clean = () => deleteAsync(['./dist/*']);


// Слежка за изменениями в папках

const watch = () => {
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
}


// Объединение все функций

const build = gulp.series(clean, gulp.parallel(styles, scripts), watch);


gulp.task('default', build);
