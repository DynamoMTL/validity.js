module.exports = (grunt) ->

  grunt.initConfig
    coffee:
      options:
        bare: false
      compile:
        files:
          'src/validity.js': 'src/validity.coffee'
          'test/validity.spec.js': 'test/validity.spec.coffee'
          'test/helpers.js': 'test/helpers.coffee'
    pkg: grunt.file.readJSON('package.json')
    uglify:
      options:
        banner: '/*! <%= pkg.name %> (version <%= pkg.version %>) <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build:
        src: 'src/validity.js'
        dest: 'src/validity.min.js'
    watch:
      files: [
        'src/validity.coffee'
        'test/validity.spec.coffee'
      ]
      tasks: 'default'
      karma:
        files: ['src/validity.js', 'test/validity.spec.js']
        tasks: ['karma:unit:run']
    karma:
      unit:
        configFile: 'karma.conf.js'
        background: true
      continuous:
        configFile: 'karma.conf.js'
        singleRun: true
        browsers: ['PhantomJS']

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.registerTask 'default', ['coffee', 'uglify']
