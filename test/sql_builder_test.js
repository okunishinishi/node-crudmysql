/**
 * Test case for sqlBuilder.
 * Runs with nodeunit.
 */

var SqlBuilder = require('../lib/sql/sql_builder.js');

exports['Build insert sql.'] = function (test) {
    var sql = new SqlBuilder().insertSql('Foo', {
        bar: 'baz'
    });
    test.equal(sql, "INSERT INTO Foo (bar) VALUES ('baz')");
    test.done();
};


exports['Build select sql.'] = function (test) {
    var sql = new SqlBuilder().selectSql('Bar', {
        baz: 'quz'
    });
    test.equal(sql, "SELECT * FROM Bar WHERE (baz='quz')");
    test.done();
};
