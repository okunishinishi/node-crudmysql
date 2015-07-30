/**
 * Test case for mysqlcrudTable.
 * Runs with nodeunit.
 */

var MysqlcrudTable = require('../lib/mysqlcrud_table.js');


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
    table.create({
        last_name: 'foo',
        first_name: 'baz'
    }, function (err, result) {
        test.ifError(err);
        test.ok(result);
        var insertId = result.insertId;
        table.one(insertId, function (err, data) {
            test.equal(data.id, insertId);
            test.equal(data.last_name, 'foo');
            test.ifError(err);
            test.done();
        });
    });
};

