


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
import sourcemaps from 'gulp-sourcemaps';
import autoPrefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import htmlmin from 'gulp-htmlmin';
import size from 'gulp-size';
import newer from 'gulp-newer';
import browsersync from 'browser-sync';
import ejs from 'gulp-ejs';

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
    },
    images: {
        src: 'src/img/*',
        dest: 'dist/img/'
    },
    htmls: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    ejs: {
        src: 'src/ejsFiles/*.ejs',
        dest: 'dist/ejsFiles'
    }
}

// Минификация html файла

const html = () => {
    return gulp.src(path.htmls.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size())
    .pipe(gulp.dest(path.htmls.dest))
    .pipe(browsersync.stream())
}


const EJS = () => {
    return gulp.src(path.ejs.src)
    .pipe(ejs({
        msg: "Hello gulp!"
    }))
    .pipe(gulp.dest(path.ejs.dest))
    .pipe(browsersync.stream())
}



// Функция для обработки стилей

const styles = () => {
    return gulp.src(path.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoPrefixer({
        cascade: false
    }))
    .pipe(cleanCss())
    .pipe(rename({
        basename: 'main',
        suffix: '.min',
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(path.styles.dest))
    .pipe(browsersync.stream())
}


// Функция для обработки скриптов

const scripts = () => {
    return gulp.src(path.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({   // Перевод в более старый стандарт
        presets: ['@babel/env']
    })) 
    .pipe(uglify()) // Минимизация(удаление строк и пробелов и ненужные отступов)
    .pipe(concat('main.min.js')) // Объединение все файлов в main.min.js
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(path.scripts.dest))
    .pipe(browsersync.stream())
}


// Уменьшение размера изображение и перевод их в webp формат

const img = () => {
    return gulp.src(path.images.src)
    .pipe(newer(path.images.dest))
    .pipe(
        imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3
        })
    )
    .pipe(size({
        showFiles:true
    }))
    .pipe(webp())
    .pipe(gulp.dest(path.images.dest))
}

// Функция для очищения папки проекта

const clean = () => deleteAsync(['dist/*', '!dist/img']);


// Слежка за изменениями в папках

const watch = () => {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        }
    }),
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
    gulp.watch(path.htmls.src).on('change', browsersync.reload)
    gulp.watch(path.htmls.src, html)
    gulp.watch(path.images.src, img)
    gulp.watch(path.ejs.src, EJS)
}


// Объединение все функций

const build = gulp.series(clean, gulp.parallel(EJS, html), gulp.parallel(styles, scripts, img), watch);


gulp.task('default', build);
