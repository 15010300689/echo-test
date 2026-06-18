const { series, parallel, src, dest, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const rollup = require('rollup');
function defaultTask(cb) {
    // place code for your default task here
    cb();
}
function clean(cb) {
    cb();
}

function build(cb) {
    cb();
}

function transpile(cb) {
    cb();
}

// function bundle(cb) {
//     cb();
// }

function javascript(cb) {
    cb();
}

function css(cb) {
    cb();
}

exports.build = build;
// exports.default = series(clean, build);
// exports.default = series(transpile, bundle);
// exports.default = parallel(javascript, css);
// exports.default = function() {
//     return src('./src/*.js')
//     .pipe(babel())
//     .pipe(src('./vendor/*.js'))
//     .pipe(uglify())
//     .pipe(rename({extname: '.min.js'}))
//     .pipe(dest('output/'));
// }

// exports.default = async function(){
//     const bundle = await rollup.rollup({
//         input: 'src/index.js'
//     });
//     return bundle.write({
//         file: 'output/bundle.js',
//         formate: 'iife'
//     });
// }

exports.default = async function() {
    const bundle = await rollup.rollup({
        input: 'src/index.js'
    });
  
    return bundle.write({
        file: 'output/bundle.js',
        name: 'bundle',
        format: 'iife'
    });
}

watch('src/*.css', function() {
    console.log('css 被编辑了');
});