/**
 * Test for mysqlclud.
 * Runs with nodeunit.
 */

"use strict";

var async = require('async'),
    Mysqlcrud = require('../lib/mysqlcrud');

var testDbConfig = require('../ci/configs/test_db_config'),
    extend = require('extend'),
    setupTestDb = require('../ci/helpers/setup_test_db');

exports.setUp = function (done) {
    setupTestDb(function (err) {
        done();
    });
};

exports['Connect.'] = function (test) {
    var crud = new Mysqlcrud().connect(testDbConfig);
    crud
        .on('connect', function () {
            crud.disconnect();
            test.done();
        })
        .on('error', function (err) {
            test.ifError(err);
            crud.disconnect();
            test.done();
        });
};

exports['Interact with table.'] = function (test) {
    var dbConfig = extend({}, testDbConfig, {
        database: 'crudmysql_test'
    });
    var crud = new Mysqlcrud().connect(dbConfig);
    crud
        .on('connect', function () {
            var person = crud.table('TEST_PERSON');
            async.series([

            ], function (err) {
                test.ifError(err);
                crud.disconnect();
                test.done();
            });
        });
};