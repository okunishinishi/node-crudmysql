/**
 * A database table object.
 * @constructor MysqlcludTable
 * @param {string} tableName - Table name
 * @param {object} config - Table configuration.
 */

"use strict";

var argx = require('argx'),
    SqlBuilder = require('./sql/sql_builder');


function MysqlcludTable(tableName, config) {
    var s = this;
    config = config || {};
    var connection = config.connection;
    s._sqlBuilder = new SqlBuilder({});
    s._connection = connection;
    s._tableName = tableName;

}
MysqlcludTable.prototype = {
    _tableName: undefined,
    _connection: undefined,
    _sqlBuilder: undefined,
    _idKey: 'id',
    _executeSql: function (sql, callback) {
        var s = this,
            connection = s._connection;
        connection.query(sql, callback);
    },
    /**
     * Create a data.
     * @param {object} data - Data to insert.
     * @param {object} options - Optional settings.
     * @param {function} callback - Callback when done.
     */
    create: function (data, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        data = args.shift() || {};
        options = args.shift() || {};

        var sql = s._sqlBuilder.insertSql(s._tableName, data);
        console.log('sql', sql);
        return s._executeSql(sql, callback);

    },
    one: function (id, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        id = args.shift();
        options = args.shift() || {};

        if (typeof(id) === 'undefined') {
            callback(new Error("id is required."));
            return;
        }
        var condition = {};
        condition[s._idKey] = id;
        var sql = s._sqlBuilder.selectSql(s._tableName, condition);
        return s._executeSql(sql, function (err, result) {
            callback(err, result && result.shift());
        });

    },
    list: function (condition, callback) {
        var s = this,
            connection = s._connection;
    },
    count: function (condition, callback) {
        var s = this,
            connection = s._connection;
    },
    update: function (id, data, callback) {
        var s = this,
            connection = s._connection;
    },
    updateBulk: function (condition, data, callback) {
        var s = this,
            connection = s._connection;
    },
    destroy: function (id, callback) {

    },
    destroyBulk: function (condition, callback) {

    }
};


module.exports = MysqlcludTable;