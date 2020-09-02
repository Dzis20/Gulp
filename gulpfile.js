//Подключаем модули
const gulp = require('gulp');
const concat = require('gulp-concat'); //Объединение файлов в один
const autoprefixer = require('gulp-autoprefixer'); //Автопрефиксы для CSS
const cleanCSS = require('gulp-clean-css'); //Сжатие файла CSS
const uglify = require('gulp-uglify'); //Сжатие файла JS
const del = require('del'); //Чистка файлов
const browserSync = require('browser-sync').create();



//Порядок подключения CSS файлов
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]
//Порядок подключения JS файлов
const jsFiles = [
    './src/js/slider.js',
    './src/js/main.js'
]



//Таск на стили CSS
function styles() {
    //Шаблон для поиска CSS файлов по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)
    //Объединение файлов в один
    .pipe(concat('style.css'))
    //Добавление автопрефиксов 
    .pipe(autoprefixer({
        cascade: false
    }))
    //Сжатие CSS файла
    .pipe(cleanCSS({
        level: 2
    }))
    //Папка куда переносятся все файлы
    .pipe(gulp.dest('./build/css'))
    //Обновление файлов в браузере
    .pipe(browserSync.stream());
}



//Таск на скрипты JS
function scripts() {
    //Шаблон для поиска JS файлов по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)
    //Объединение файлов в один
    .pipe(concat('script.js'))
    //Сжатие JS файла
    .pipe(uglify({
        toplevel: true
    }))
    //Папка куда переносятся все файлы
    .pipe(gulp.dest('./build/js'))
    //Обновление файлов в браузере
    .pipe(browserSync.stream());
}



//Удалить всё в указанной папке
function clean () {
    return del(['build/*'])
}


//Просматривать файлы
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Следить за CSS файлами
    gulp.watch('.src/css/*.css', styles)
    //Следить за JS файлами
    gulp.watch('.src/js/*.css', scripts)
    //При изменении HTML запустить синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload);
}



//Вызов функции styles
gulp.task('styles', styles);
//Вызов функции scripts
gulp.task('scripts', scripts);
//Вызов функции clean
gulp.task('del', clean);
//Отслеживание изменений
gulp.task('watch', watch);
//Удаление файлов в папке build и запись styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
//Запуск build и watch посследовательно
gulp.task('start', gulp.series('build', 'watch'));
