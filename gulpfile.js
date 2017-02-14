var gulp = require('gulp');
var minifycss = require('gulp-minify-css');   //css压缩
var concat = require('gulp-concat');          //文件合并
var uglify = require('gulp-uglify');          //js压缩插件
var rename = require('gulp-rename');          //重命名
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin'); // 图片压缩
var pngquant = require('imagemin-pngquant'); // 深度压缩


/*browser-sync服务*/
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            proxy: 'http://localhost:8080',
            baseDir: 'www'
        }
    })
});
/*压缩css*/
gulp.task('minifycss', function () {
    return gulp.src('www/css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('www/dist/css'));
});

/*js合并压缩*/
gulp.task('minifyjs', function () {
    return gulp.src('www/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('www/dist/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('www/dist/js'));
});

gulp.task('images', function () {
    return gulp.src('www/images/**/*.{png,jpg,gif,svg}') // 指明源文件路径、并进行文件匹配
        .pipe(imagemin({
            progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
            use: [pngquant()] // 使用pngquant插件进行深度压缩
        }))
        .pipe(gulp.dest('www/dist/images')); // 输出路径
});

/*build*/
gulp.task('build', ['minifycss', 'minifyjs', 'images']);

/*监听文件变化，自动执行build任务*/

gulp.task('watch', function () {
    gulp.watch(['www/js/*.js', 'www/css/*.css', 'www/*.html'], ['build']);
});

gulp.task('default', ['build', 'watch']);