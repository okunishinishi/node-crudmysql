#!/usr/bin/env node

"use strict";

var async = require('async'),
    path = require('path'),
    coz = require('coz');

var basedir = path.resolve(__dirname, '..');

process.chdir(basedir);

async.series([
    function (callback) {
        coz.render([
            '.*.bud',
            'lib/.*.bud',
            'test/.*.bud'
        ], callback);
    }
], function (err) {
    if (err) {
        console.error(err);
    }
});