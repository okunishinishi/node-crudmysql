/**
 * Test case for mysqlcrudTable.
 * Runs with nodeunit.
 */

var MysqlcrudTable = require('../lib/mysqlcrud_table.js'),
    async = require('async');

var testDbConfig = require('../ci/configs/test_db_config'),
    mysql = require('mysql'),
    extend = require('extend'),
    setupTestDb = require('../ci/helpers/setup_test_db');


var connection = mysql.createConnection(extend({}, testDbConfig, {
    database: 'crudmysql_test'
}));
exports.setUp = function (done) {
    setupTestDb(function (err) {
        connection.connect(function () {
            done();
        });
    });
};
exports.tearDown = function (done) {
    connection.end(function () {
        done();
    });
};

exports['Mysqlcrud table'] = function (test) {
    var table = new MysqlcrudTable('TEST_PERSON', {
        connection: connection
    });
    var insertId, insertId2;
    async.series([
        function (callback) {
            table.create({
                last_name: 'foo',
                first_name: 'baz'
            }, function (err, result) {
                test.ifError(err);
                test.ok(result);
                insertId = result.insertId;
                callback(err, result);
            });
        },
        function (callback) {
            table.create({
                last_name: 'foo2',
                first_name: 'baz2'
            }, function (err, result) {
                test.ifError(err);
                test.ok(result);
                insertId2 = result.insertId;
                callback(err, result);
            });
        },
        function (callback) {
            table.one(insertId, function (err, data) {
                test.equal(data.id, insertId);
                test.equal(data.last_name, 'foo');
                test.ifError(err);
                callback(err, data);
            });
        },
        function (callback) {
            table.count({}, function (err, count) {
                test.ifError(err);
                test.ok(count);
                callback(err)
            });
        },
        function (callback) {
            table.count({}, {
                order: ['last_name']
            }, function (err, count) {
                test.ifError(err);
                test.ok(count);
                callback(err)
            });
        },
        function (callback) {
            table.list({}, function (err, data) {
                test.ifError(err);
                test.ok(data.length);
                callback(err)
            });
        },
        function (callback) {
            table.list({}, {
                order: [{'last_name': false}],
                limit: 1,
                offset: 1
            }, function (err, data) {
                test.ifError(err);
                test.ok(data.length);
                callback(err)
            });
        },
        function (callback) {
            table.update(insertId, {
                last_name: 'foo2'
            }, function (err, data) {
                test.ifError(err);
                test.ok(data);
                callback(err);
            });
        },
        function (callback) {
            table.destroy(insertId, function (err, data) {
                test.ifError(err);
                test.ok(data);
                callback(err);
            });
        }
    ], function (err) {
        test.ifError(err);
        test.done();
    });
};

