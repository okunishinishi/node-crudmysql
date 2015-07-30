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
    _identifyCondition: function (id) {
        if (typeof(id) === 'undefined') {
            throw new Error('id is required.');
        }
        var s = this,
            condition = {};
        condition[s._idKey] = id;
        return condition;
    },
    /**
     * Create a data.
     * @param {object} data - Data to insert.
     * @param {object} [options] - Optional settings.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    create: function (data, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        data = args.shift() || {};
        options = args.shift() || {};

        var sql = s._sqlBuilder.insertSql(s._tableName, data);
        return s._executeSql(sql, callback);

    },
    /**
     * Get a single data.
     * @param {string} id - Id of data.
     * @param {object} [options] - Optional settings.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    one: function (id, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        id = args.shift();
        options = args.shift() || {};

        var condition = s._identifyCondition(id);
        var sql = s._sqlBuilder.selectSql(s._tableName, condition);
        return s._executeSql(sql, function (err, result) {
            callback(err, result && result.shift());
        });

    },
    /**
     * List data.
     * @param {object} condition - Search condition.
     * @param {object} [options] - Optional settings.
     * @param {string[]} [options.fields] - Filed names to select.
     * @param {number} [options.offset] - Offset number
     * @param {number} [options.limit] - Limit number
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    list: function (condition, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        condition = args.shift();
        options = args.shift() || {};
        var sql = s._sqlBuilder.selectSql(s._tableName, condition, {
            fields: options.fields || options.fields,
            //order: options.order || options.orders || options.orderBy,
            offset: options.offset,
            limit: options.limit
        });
        return s._executeSql(sql, callback);
    },
    /**
     * Count data.
     * @param {object} condition - Search condition.
     * @param {object} [options] - Optional settings.
     * @param {string[]} [options.fields] - Filed names to select.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    count: function (condition, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        condition = args.shift();
        options = args.shift() || {};
        var sql = s._sqlBuilder.selectSql(s._tableName, condition, {
            fields: ['count(1) as count'],
            order: options.order || options.orders || options.orderBy
        });
        return s._executeSql(sql, function (err, result) {
            callback(err, result && result.shift()['count']);
        });
    },
    /**
     * Update data.
     * @param {string} id - Resource id.
     * @param {object} data - Search condition.
     * @param {object} [options] - Optional settings.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    update: function (id, data, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        id = args.shift();
        options = args.shift() || {};

        var condition = s._identifyCondition(id);
        var sql = s._sqlBuilder.updateSql(s._tableName, condition, data);
        return s._executeSql(sql, callback);

    },
    /**
     * Destroy a data.
     * @param {string} id - Resource id.
     * @param {object} [options] - Optional settings.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    destroy: function (id, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        id = args.shift();
        options = args.shift() || {};
        var condition = s._identifyCondition(id);
        var sql = s._sqlBuilder.deleteSql(s._tableName, condition);
        return s._executeSql(sql, callback);
    }
};


module.exports = MysqlcludTable;