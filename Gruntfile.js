module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    imageoptim: {

      ImageOptimAlone: {
        src: [
          'images/imageoptim'
        ],
        options: {
          imageAlpha: false,
          jpegMini: false,
          quitAfter: true
        }
      },

      imageAlphaAndImageOptim: {
        src: [
          'images/imagealpha-and-imageoptim'
        ],
        options: {
          imageAlpha: true,
          jpegMini: false,
          quitAfter: true
        }
      },

      jpegMiniAndImageOptim: {
        src: [
          'images/jpegmini-and-imageoptim'
        ],
        options: {
          imageAlpha: false,
          jpegMini: true,
          quitAfter: true
        }
      }

    },

    imagemin: {
      dist: {
        options: {
          // 240 trials
          optimizationLevel: 7
        },
        files: [{
          expand: true,
          dest: 'images/grunt-contrib-imagemin',
          src: [
            'images/grunt-contrib-imagemin/*'
          ]
        }]
      }
    },

    jsdoc: {
      dist: {
        src: [
          'src/**/*.js'
        ],
        options: {
          destination: 'docs'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-imageoptim');
  grunt.loadNpmTasks('grunt-jsdoc');

};
