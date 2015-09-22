var
  gulp      = require('gulp'),
  cp        = require('child_process'),
  jade      = require('gulp-jade'),
  stylus    = require('gulp-stylus'),
  sync      = require('browser-sync'),
  uncss     = require('gulp-uncss'),
  prefixer  = require('autoprefixer-stylus'),
  nib       = require('nib'),
  nano      = require('gulp-cssnano'),
  mainBower = require('gulp-main-bower-files'),
  inject    = require('gulp-inject'),
  series    = require('stream-series'),
  autowatch = require('gulp-autowatch');

var config = {
  stylusPath: './_styles',
  bowerDir  : './bower_components',
  assetDir  : './assets',
  jadePath  : './_markup',
  outputDir : './_site'
};

var versions = [
  'last 5 versions',
  '> 1%',
  'ie 8',
  'ie 7',
  'Blackberry 10'
];

var message = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};


gulp.task('inject', function() {
  var target = gulp.src('./_layouts/template.html');
  var jquery = gulp.src(['assets/**/jquery.js'], {read: false}, {relative: true});
  var vendors = gulp.src(['!assets/**/jquery.js', '!assets/**/script.js','!assets/**/Flowtype.js','!assets/lib/bounce.js','assets/**/*.js'], {read: false}, {relative:true});
  var myStuff = gulp.src(['assets/js/script.js','!assets/lib/animate.css' ,'assets/**/*.css'], {read: false}, {relative: true});

  return target.pipe(inject(series(jquery, vendors, myStuff)))
    .pipe(gulp.dest('./_layouts'));
});


gulp.task('bower', function() {
  return gulp.src('./bower.json')
    .pipe(mainBower())
    .pipe(gulp.dest('assets/lib'));
});

gulp.task('styles', function() {
  return gulp.src(config.stylusPath + '/main.styl')
    .pipe(stylus({
      import: [
        'nib'
      ],
      use: [
        nib(),
        prefixer(versions, {cascade: true }),
      ],
    }))
    .pipe(gulp.dest(config.assetDir +'/css'))
    .pipe(gulp.dest(config.outputDir + '/assets/css'))
    .pipe(sync.stream());
});

gulp.task('jade', function() {
  gulp.src('_markup/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('_includes'))
    .pipe(sync.stream());
});

gulp.task('jekyll-build', ['styles','jade','bower','inject'], function(done) {
  sync.notify(message.jekyllBuild);
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  sync.reload();
});

gulp.task('build', ['styles','jade','bower','inject','jekyll-build']);

gulp.task('serve', ['build'], function() {
  sync.init({
    server: {
      baseDir:"./_site"
    }
  });
  gulp.watch('_styles/**/*.styl',['styles']);
  gulp.watch('_markup/**/*.jade', ['jade']);
  gulp.watch('assets/**/*.js',['inject']);
  gulp.watch(['index.html','_includes/*', '_layouts/*'],['jekyll-rebuild']);
});

gulp.task('default', ['serve']);
