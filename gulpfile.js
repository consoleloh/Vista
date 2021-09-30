'use strict';
	
var gulp = require('gulp'),
	rigger = require('gulp-rigger'),
	newer = require('gulp-newer'),
	// pug = require('gulp-pug'),

	sass = require('gulp-sass')(require('sass')),
	prefixer = require('gulp-autoprefixer'),
	shorthand = require('gulp-shorthand'),
	// combineMq = require('gulp-combine-mq'),
	cssmin = require('gulp-minify-css'),
	stripCssComments = require('gulp-strip-css-comments'),

	uglify = require('gulp-uglify'),

    // imagemin = require('gulp-imagemin'),
    // pngquant = require('imagemin-pngquant'),

	svgSprite = require('gulp-svg-sprites'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'),

	concat = require('gulp-concat'),
	rename = require('gulp-rename'),

	sourcemaps = require('gulp-sourcemaps'),
	watch = require('gulp-watch'),
	browserSync = require("browser-sync");

var path = {
	build: {
		html: 'build/',
		// pug: 'build/pug/',
		js: 'build/js/',
		style: 'build/css/',
		style: 'build/css/',
		img: 'build/img/',
		icons: 'build/img/icons/',
		fonts: 'build/fonts/'
	},
	src: {
		html: 'src/*.html',
		pug: 'src/*.pug',
		js: 'src/js/*.js',
		style: 'src/scss/style.scss',
		img: 'src/img/**/*.*',
		icons: 'src/img/icons/*.svg',
		fonts: 'src/fonts/**/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		// pug: 'src/**/*.pug',
		js: 'src/js/**/*.js',
		style: 'src/scss/**/*.scss',
		img: 'src/img/**/*.*',
		icons: 'src/img/icons/*.svg',
		fonts: 'src/fonts/**/*.*'
	}
};

var reload = browserSync.reload;
var config = {
	server: {
		baseDir: "./build"
	},
	port: 3000,
	open: false,
};

var minSuffix = '.min';
var sassOutputStyle = 'expanded';
var sassPrefixVersion = 'last 60 versions';

function htmlBuild(){
	console.log('htmlBuild');

	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
}

function styleBuild(){
	console.log('styleBuild');

	return gulp.src(path.src.style)
		.pipe(sass({
			outputStyle: sassOutputStyle
		}))
		.pipe(shorthand())
		.pipe(prefixer({
			browsers: [sassPrefixVersion],
			cascade: false
		}))
		// .pipe(combineMq({
		// 	beautify: true
		// }))
		.pipe(stripCssComments())
		.pipe(gulp.dest(path.build.style))
		.pipe(cssmin())
		.pipe(rename({
			suffix: minSuffix
		}))
		.pipe(gulp.dest(path.build.style))
		.pipe(reload({stream: true}));
};

function jsBuild(){
	console.log('jsBuild');

	return gulp.src(path.src.js)
		.pipe(newer(path.build.js))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
}

function imageBiuld(){
	console.log('imageBiuld');

	return gulp.src(path.src.img)
		.pipe(newer(path.build.img))
		// .pipe(imagemin({
		// 	progressive: true,
		// 	svgoPlugins: [{removeViewBox: false}],
		// 	use: [pngquant()],
		// 	interlaced: true
		// }))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
}

function iconsBuild(){
	console.log('iconsBuild');

	return gulp.src(path.src.icons)
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
				mode: "symbols",
				preview: true,
				selector: "icon-%f",
				svg: {
					symbols: 'sprite.svg'
				}
			}
		))
		.pipe(gulp.dest(path.build.icons));
}

function fontsBuild(){
	console.log('fontsBuild');

	return gulp.src(path.src.fonts)
		.pipe(newer(path.build.fonts))
		.pipe(gulp.dest(path.build.fonts))
}

// function pugBuild(){
// 	return gulp.src(path.src.pug)
// 		.pipe(pug({
// 		// Your options in here.
// 		}))
// 		.pipe(gulp.dest(path.build.pug))
// 		.pipe(reload({stream: true}));
// }

gulp.task('build', gulp.series(
	htmlBuild,
	// pugBuild,
	styleBuild,
	jsBuild,
	imageBiuld,
	iconsBuild,
	fontsBuild
));

function gulpWatch(){
	console.log('watch');
	gulp.watch(path.watch.html, htmlBuild);
	// gulp.watch(path.watch.pug, pugBuild);
	gulp.watch(path.watch.style, styleBuild);
	gulp.watch(path.watch.js, jsBuild);
	gulp.watch(path.watch.img, imageBiuld);
	gulp.watch(path.watch.icons, iconsBuild);
	gulp.watch(path.watch.fonts, fontsBuild);
}

function gulpServer(){
	browserSync(config);
	console.log('webserver');
}

exports.default = gulp.series('build', gulp.parallel(gulpWatch, gulpServer));