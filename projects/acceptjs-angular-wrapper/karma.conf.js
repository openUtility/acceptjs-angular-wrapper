// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    // Add for testing in docker
    // customLaunchers: {
    //   ChromeCustom: {
    //     base: 'ChromeHeadless',
    //     // We must disable the Chrome sandbox when running Chrome inside Docker (Chrome's sandbox needs
    //     // more permissions than Docker allows by default)
    //     flags: ['--no-sandbox']
    //   }
    // },
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // remove for testing in docker
    browsers: ['Chrome'],
    singleRun: false,
    logLevel: config.LOG_DEBUG
  });
};
