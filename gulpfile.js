var gulp           = require('gulp'),
		browserSync    = require('browser-sync'),
		sass           = require('gulp-sass'),
		notify         = require('gulp-notify'),
		autoprefixer   = require('gulp-autoprefixer'),
		rename         = require('gulp-rename'),
		cleanCSS       = require('gulp-clean-css'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		del            = require('del');

gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: 'dev'
		},
		notify: false,
		port: 3000,
		ui: {
			port: 3001,
		}
	})
})

gulp.task('sass', function() {
	return gulp.src('dev/sass/**/*.sass')
		.pipe(sass({
				outputStyle: 'expanded',
				indentType: 'tab',
				indentWidth: '1'
			})
		.on('error', notify.onError()))
		.pipe(autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dev/css'))
		.pipe(rename({
			prefix : '',
			suffix: '.min'
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dev/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src([
		'dev/libs/jquery/jquery-3.2.1.min.js',
		'dev/libs/slick/slick.min.js',
		'dev/js/custom.js',
		])
	.pipe(concat('main.js'))
	.pipe(gulp.dest('dev/js'))
	.pipe(rename({
			prefix : '',
			suffix: '.min'
		}))
	.pipe(uglify())
	.pipe(gulp.dest('dev/js'))
	.pipe(browserSync.reload({stream: true}));
});


gulp.task('watch', ['sass', 'js', 'browserSync'], function() {
	gulp.watch('dev/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'dev/js/custom.js'], ['js']);
	gulp.watch('dev/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('dev/img/**/*')
		.pipe(cache(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({plugins: [{removeViewBox: true}]})
		])))
		.pipe(gulp.dest('build/img')); 
});

gulp.task('del', function() {
	return del.sync('build'); 
});

gulp.task('build', ['del', 'imagemin', 'sass', 'js'], function() {

	var buildHtml = gulp.src('dev/*.html')
		.pipe(gulp.dest('build'));

	var buildFonts = gulp.src('dev/fonts/**/*')
		.pipe(gulp.dest('build/fonts'));

	var buildCss = gulp.src('dev/css/main.min.css')
		.pipe(gulp.dest('build/css'));

	var buildJs = gulp.src('dev/js/main.min.js')
		.pipe(gulp.dest('build/js'));

});

gulp.task('default', ['watch']);