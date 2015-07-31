/**
 * Test case for sqlBuilder.
 * Runs with nodeunit.
 */

var SqlBuilder = require('../lib/sql/sql_builder.js');

exports['Build insert sql.'] = function (test) {
    var builder = new SqlBuilder();
    test.equal(builder.insertSql('Foo', {
            bar: 'baz'
        }),
        "INSERT INTO Foo (bar) VALUES ('baz')"
    );
    test.done();
};


exports['Build select sql.'] = function (test) {
    var builder = new SqlBuilder();
    test.equal(
        builder.selectSql('Bar', {
            where: {
                baz: 'quz'
            }
        }),
        "SELECT * FROM Bar WHERE (Bar.baz = 'quz')"
    );

    test.equal(
        builder.selectSql('Bar', {
            where: {
                baz: 'quz'
            },
            fields: ["count(1)"]
        }),
        "SELECT count(1) FROM Bar WHERE (Bar.baz = 'quz')"
    );
    test.equal(
        builder.selectSql('Bar', {
            where: {
                baz: 'quz'
            },
            order: ["baz", {quz: false}]
        }),
        "SELECT * FROM Bar WHERE (Bar.baz = 'quz') ORDER BY baz ASC, quz DESC"
    );
    test.equal(
        builder.selectSql('Bar', {
            where: {
                baz: 'quz'
            },
            limit: 40,
            offset: 8
        }),
        "SELECT * FROM Bar WHERE (Bar.baz = 'quz') LIMIT 40 OFFSET 8"
    );
    test.equal(
        builder.selectSql('Bar', {
            where: {
                baz: 'quz'
            },
            ref: {
                quz_id: 'quz.id'
            }
        }),
        "SELECT * FROM Bar LEFT JOIN quz `quz` ON (Bar.quz_id = quz.id) WHERE (Bar.baz = 'quz')"
    );
    test.done();
};


exports['Build update sql.'] = function (test) {
    var builder = new SqlBuilder();
    test.equal(
        builder.updateSql('Bar', {
            where: {
                id: '3'
            },
            values: {
                baz: 'quz'
            }
        }),
        "UPDATE Bar SET baz = 'quz' WHERE (Bar.id = '3')"
    );
    test.done();
};


exports['Build delete sql.'] = function (test) {
    var builder = new SqlBuilder();
    test.equal(
        builder.deleteSql('Bar', {
            where: {
                id: '3'
            }
        }),
        "DELETE FROM Bar WHERE (Bar.id = '3')"
    );
    test.done();
};
