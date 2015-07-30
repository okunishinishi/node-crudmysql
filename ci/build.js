#!/usr/bin/env node

var async = require('async'),
    coz = require('coz');

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